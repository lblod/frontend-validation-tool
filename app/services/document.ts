/* eslint-disable @typescript-eslint/no-explicit-any */
import { action } from '@ember/object';
import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { Bindings } from 'rdf-js';
import {
  determineDocumentType,
  fetchDocument,
  getPublicationFromFileContent,
  validatePublication,
  getExampleOfDocumentType,
  getBlueprintOfDocumentType,
  getBindingsFromTurtleContent,
  validateDocument,
} from '@lblod/lib-decision-validation';
import { task } from 'ember-concurrency';
import {
  MaturityLevel,
  type MaturityLevelReport,
  type specificMaturityLevelReport,
  type ValidatedProperty,
  type ValidatedPublication,
  type ValidationErrors,
} from '@lblod/lib-decision-validation/dist/types';

export default class DocumentService extends Service {
  corsProxy: string = '';

  @tracked loadingStatus: string = 'We starten het validatieproces';
  @tracked document: Bindings[] = [];
  @tracked documentURL: string = '';
  @tracked documentType: string = '';
  @tracked documentFile: File | null = null;
  @tracked customBlueprint: File | null = null;
  @tracked maturity: string = '';
  @tracked validatedDocument: any = [];
  @tracked isProcessingFile: boolean = false;
  @service declare toaster: any;
  @tracked indexOfUri: Map<string, number> = new Map();

  constructor() {
    // eslint-disable-next-line prefer-rest-params
    super(...arguments);
  }

  setCorsProxy(proxy: string) {
    this.corsProxy = proxy;
    console.log(`Proxy set to: ${this.corsProxy}`);
  }

  getPublicationfilteredByValidity = task({ drop: true }, async () => {
    function filterRecursive(item) {
      if (Array.isArray(item.objects) && item.objects.length > 0) {
        item.objects = item.objects
          .map(filterRecursive)
          .filter((object) => !(object.validCount === object.totalCount));
      } else {
        if (Array.isArray(item.properties) && item.properties.length > 0) {
          item.properties = item.properties
            .map(filterRecursive)
            .filter(
              (property) =>
                !(
                  property.actualCount >= property.minCount &&
                  property.actualCount <= property.maxCount
                ),
            );
        }
        if (Array.isArray(item.value) && item.value.length > 0) {
          item.value = item.value
            .map(filterRecursive)
            .filter((value) => !(value.validCount === value.totalCount));
        }
      }
      return item;
    }

    const { res } = await this.validateDocument.perform();

    res?.classes
      .map(filterRecursive)
      .filter(
        (entry) =>
          !(
            entry.actualCount >= entry.minCount &&
            entry.actualCount <= entry.maxCount
          ),
      );
    console.log('filtered document');
    console.log(document);
    this.validatedDocument = document;
    return document;
  });

  @action updateValidatedDocument(newValidatedDocument: object) {
    this.validatedDocument = newValidatedDocument;
  }

  validateDocument = task({ drop: true }, async () => {
    if (!this.isProcessingFile) {
      this.document = await fetchDocument(this.documentURL, this.corsProxy);
    }
    let res;
    if (this.documentType) {
      const blueprint = await getBlueprintOfDocumentType(this.documentType);
      const example = await getExampleOfDocumentType(this.documentType);
      const onProgress = (message: string) => {
        this.loadingStatus = `${message}`;
      };
      const result = await validatePublication(
        this.document,
        blueprint,
        example,
        onProgress,
      );
      this.indexOfUri = createIndexOfUri(result);
      res = result;
    } else if (this.customBlueprint) {
      const rawBlueprint = await this.customBlueprint.text();
      const blueprint = await getBindingsFromTurtleContent(rawBlueprint);
      res = await validateDocument(this.document, blueprint);
    }
    console.log(res);
    let errors: ValidationErrors[] = [];

    res?.classes.forEach((obj, classIndex) => {
      obj.objects.forEach((object, objectIndex) => {
        if (object.sparqlValidationResults) {
          object.sparqlValidationResults.forEach((sparqlResult) => {
            errors.push({
              url: `#validationBlock-${classIndex + 1}-${objectIndex + 1}`,
              path: `${object.className} ${this.indexOfUri.get(object.uri)}`,
              messages: sparqlResult.resultMessage,
            });
          });
        }
        object.properties.forEach((property, propertyIndex) => {
          const newProperty = property as ValidatedProperty;
          let url = `#validationBlock-${classIndex + 1}-${objectIndex + 1}-${propertyIndex + 1}`;
          if (!newProperty.valid) {
            if (obj.count === 1) {
              url = `#validationBlock-${classIndex + 1}-${propertyIndex + 1}`;
            }
            const maturityLevelString = newProperty.maturityLevel
              ? `(Maturiteit: ${newProperty.maturityLevel})`
              : '';
            errors.push({
              url: url,
              path: `${object.className} ${this.indexOfUri.get(object.uri)} > ${property.name} ${maturityLevelString}`,
              messages: property.value,
            });
          }
          if (newProperty.sparqlValidationResults) {
            newProperty.sparqlValidationResults.forEach((sparqlResult) => {
              errors.push({
                url,
                path: `${object.className} ${this.indexOfUri.get(object.uri)} > ${property.name}`,
                messages: sparqlResult.resultMessage,
              });
            });
          }
        });
      });
    });
    if (res) {
      const errorsFromMaturityLevelReport = getErrorsFromMaturityLevel(res);
      errors = errors.concat(errorsFromMaturityLevelReport);
    }
    return { res, errors };
  });

  clearData() {
    this.document = [];
    this.documentURL = '';
    this.documentType = '';
    this.documentFile = null;
    this.isProcessingFile = false;
    this.maturity = '';
    this.validatedDocument = [];
  }

  @action async handleDocumentTypeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.documentType = target.value;
  }

  // Function to process a document file (as uploaded by the user in route: document-upload)
  @action async processDocumentFile(file: File) {
    this.isProcessingFile = true;
    this.documentFile = file;
    const html = await file.text();
    const document = await getPublicationFromFileContent(html);
    this.document = document;

    const determinedType = await determineDocumentType(document);
    this.documentType =
      determinedType === 'unknown document type' ? '' : determinedType;
  }

  // Function to process a document URL (as entered by the user in route: document-upload)
  @action async processDocumentURL(fileUrl: string) {
    this.documentURL = fileUrl;
    const document: any = await fetchDocument(fileUrl, this.corsProxy).then(
      (resp) => {
        return resp;
      },
    );
    this.documentType = determineDocumentType(document);

    if (this.documentType && this.documentType !== 'unknown document type') {
      return true;
    } else {
      this.documentType = '';
      return false;
    }
  }
}

declare module '@ember/service' {
  interface Registry {
    document: DocumentService;
  }
}
function createIndexOfUri(result: ValidatedPublication): Map<string, number> {
  const indexOfUri: Map<string, number> = new Map();
  for (const c of result.classes) {
    for (const o of c.objects) {
      let indexOfObj = c.objects.indexOf(o);
      // start index from 1
      indexOfObj = indexOfObj + 1;
      indexOfUri.set(o.uri, indexOfObj);
    }
  }
  return indexOfUri;
}

function getErrorsFromMaturityLevel(res: ValidatedPublication) {
  const errors: ValidationErrors = [];
  Object.entries(res.maturityLevelReport ?? {}).forEach(([key, value]) => {
    if (
      key === 'maturityLevel1Report' ||
      key === 'maturityLevel2Report' ||
      key === 'maturityLevel3Report'
    ) {
      const specificMaturityLevelReport = value as specificMaturityLevelReport;
      const maturityLevelString = `(Maturiteit: ${specificMaturityLevelReport.maturityLevel})`;

      specificMaturityLevelReport.missingClasses.forEach((missingClass) => {
        const classIndex = res.classes.findIndex(
          (c) => c.classURI === missingClass,
        );
        if (classIndex != -1) {
          const url = `#validationBlock-${classIndex + 1}`;
          const missingClassName =
            res.classes[classIndex]?.className ?? `${missingClass}`;
          errors.push({
            url,
            path: `${missingClassName} ${maturityLevelString}`,
            messages: ['Klasse niet gevonden'],
          });
        }
      });
      specificMaturityLevelReport.missingOptionalProperties.forEach(
        (missingOptionalProperty) => {
          const classIndex = res.classes.findIndex(
            (c) => c.classURI === missingOptionalProperty.targetClass,
          );
          if (classIndex != -1) {
            const url = `#validationBlock-${classIndex + 1}`;
            const missingTargetClassName =
              res.classes[classIndex]?.className ??
              `${missingOptionalProperty.targetClass}`;
            errors.push({
              url,
              path: `${missingTargetClassName} ${maturityLevelString}`,
              messages: ['Optionele eigenschap werd nergens gebruikt.'],
            });
          }
        },
      );
      specificMaturityLevelReport.mandatarissenThatAreNotDereferenced?.forEach(
        (mandatarisThatIsNotDereferenced) => {
          const url = ``; // no specific class currently for mandataris
          errors.push({
            url,
            path: `Mandataris ${maturityLevelString}`,
            messages: [
              `${mandatarisThatIsNotDereferenced} is geen correcte URI uit de mandatendatabank.`,
            ],
          });
        },
      );
    }
  });

  return errors;
}

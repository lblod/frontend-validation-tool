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

    const document = await this.validateDocument.perform();

    document
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
    if (this.documentType) {
      const blueprint = await getBlueprintOfDocumentType(this.documentType);
      const example = await getExampleOfDocumentType(this.documentType);

      if (!this.isProcessingFile) {
        this.document = await fetchDocument(this.documentURL, this.corsProxy);
      }

      const onProgress = (message: string) => {
        this.loadingStatus = `${message}`;
      };

      return await validatePublication(
        this.document,
        blueprint,
        example,
        onProgress,
      );
    }

    if (this.customBlueprint) {
      const rawBlueprint = await this.customBlueprint.text();
      const blueprint = await getBindingsFromTurtleContent(rawBlueprint);

      return await validateDocument(this.document, blueprint);
    }
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

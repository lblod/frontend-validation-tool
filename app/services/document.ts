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
} from 'app-validation-tool/dist';
import {
  getBlueprintOfDocumentType,
} from 'app-validation-tool/dist/queries';
import config from 'frontend-validation-tool/config/environment';

export default class DocumentService extends Service {
  corsProxy = <string>config.APP['CORS_PROXY_URL'];

  @tracked document: Bindings[] = [];
  @tracked documentURL: string = '';
  @tracked documentType: string = '';
  @tracked documentFile: File | null = null;
  @tracked maturity: string = '';
  @tracked validatedDocument: any = [];
  @tracked isProcessingFile: boolean = false;
  @service declare toaster: any;

  constructor() {
    // eslint-disable-next-line prefer-rest-params
    super(...arguments);

    // Load data from local storage on initialization
    this.loadFromLocalStorage();
  }


  @action async getPublicationfilteredByValidity() {
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

    const document = await this.validateDocument();

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
  }

  @action updateValidatedDocument(newValidatedDocument: object) {
    this.validatedDocument = newValidatedDocument;
  }

  @action async validateDocument(): Promise<any> {
    const blueprint = await getBlueprintOfDocumentType(this.documentType);
    const example = await getExampleOfDocumentType(this.documentType);

    if (!this.isProcessingFile) {
      this.document = await fetchDocument(this.documentURL, this.corsProxy);
    }
    const result = await validatePublication(this.document, blueprint, example);
    console.log(result)
    return result
  }

  clearData() {
    this.document = [];
    this.documentURL = '';
    this.documentType = '';
    this.documentFile = null;
    this.isProcessingFile = false;
    this.maturity = '';
    this.validatedDocument = [];
    // Optionally clear local storage as well if you don't want to persist data at all
    localStorage.removeItem('documentServiceData');
  }

  @action async handleDocumentTypeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.documentType = target.value;

    // Save to local storage
    this.saveToLocalStorage();
  }

  @action async processPublication({ fileUrl }: { fileUrl: string }) {
    const document: any = await fetchDocument(fileUrl, this.corsProxy).then(
      (resp) => {
        return resp;
      },
    );
    const documentType = determineDocumentType(document);
    this.document = document;
    this.saveToLocalStorage();

    return documentType;
  }

  // Function to process a document file (as uploaded by the user in route: document-upload)
  @action async processDocumentFile(file: File) {
    this.isProcessingFile = true;
    this.documentFile = file;
    const html = await file.text();
    const document = await getPublicationFromFileContent(html);
    this.document = document;
    this.documentType = await determineDocumentType(document);

    if (this.documentType && this.documentType !== 'unknown document type') {
      this.saveToLocalStorage();
      return true;
    } else {
      this.documentType = '';
      this.toaster.error(
        'Deze publicatie heeft geen documenttype',
        'Kies een type uit de lijst',
      );
      return false;
    }
  }

  // Function to process a document URL (as entered by the user in route: document-upload)
  @action async processDocumentURL(fileUrl: string) {
    this.documentURL = fileUrl;
    this.documentType =
      (await this.processPublication({ fileUrl: fileUrl })) || '';

    if (this.documentType && this.documentType !== 'unknown document type') {
      // Save to local storage
      this.saveToLocalStorage();
      return true;
    } else {
      this.documentType = '';
      this.toaster.error(
        'Deze publicatie heeft geen documenttype',
        'Kies een type uit de lijst',
      );
      return false;
    }
  }

  // Function to save data to local storage
  saveToLocalStorage() {
    localStorage.setItem(
      'documentServiceData',
      JSON.stringify({
        document: this.document,
        documentURL: this.documentURL,
        documentType: this.documentType,
        documentFile: this.documentFile,
        maturity: this.maturity,
        validatedDocument: this.validatedDocument,
      }),
    );
  }

  // Function to load data from local storage
  loadFromLocalStorage() {
    const data = localStorage.getItem('documentServiceData');
    if (data) {
      const {
        document,
        documentURL,
        documentType,
        documentFile,
        maturity,
        validatedDocument,
      } = JSON.parse(data); // Add maturity here
      this.document = document;
      this.documentURL = documentURL;
      this.documentType = documentType;
      this.documentFile = documentFile;
      this.validatedDocument = validatedDocument;
      this.maturity = maturity; // And add this line
    }
  }
}
declare module '@ember/service' {
  interface Registry {
    document: DocumentService;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { action } from '@ember/object';
import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { Bindings } from 'rdf-js';
import { checkMaturity, determineDocumentType } from './validation';

import {
  fetchDocument,
  getMaturityProperties,
  getPublicationFromFileContent,
} from './queries';

export default class DocumentService extends Service {
  @tracked document: Bindings[] = [];
  @tracked documentURL: string = '';
  @tracked documentType: string = '';
  @tracked documentFile: File | null = null;
  @tracked maturity: string = '';

  @service declare toaster: any;

  constructor() {
    // eslint-disable-next-line prefer-rest-params
    super(...arguments);

    // Load data from local storage on initialization
    this.loadFromLocalStorage();
  }

  @action async handleDocumentTypeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.documentType = target.value;

    // Save to local storage
    this.saveToLocalStorage();
  }

  @action getMaturity(result: any) {
    this.maturity = '';
    if (this.documentType === 'Notulen') {
      const levels: string[] = ['Niveau 1', 'Niveau 2', 'Niveau 3'];
      levels.forEach(async (level) => {
        const properties = await getMaturityProperties(level);
        if (checkMaturity(result, properties)) {
          this.maturity = level;
          this.saveToLocalStorage();
        }
      });
    }
  }

  @action async processPublication({ fileUrl }: { fileUrl: string }) {
    const document: any = await fetchDocument(fileUrl).then((resp) => {
      return resp;
    });
    const documentType: any = await determineDocumentType(document).then(
      (resp) => {
        return resp;
      },
    );
    this.document = document;
    this.saveToLocalStorage();

    return documentType;
  }

  @action async processDocumentFile(file: File) {
    this.documentFile = file;
    const html = await file.text();
    const document = await getPublicationFromFileContent(html);
    this.document = document;
    this.documentType = await determineDocumentType(document);

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
        maturity: this.maturity, // Add this line
      }),
    );
  }

  // Function to load data from local storage
  loadFromLocalStorage() {
    const data = localStorage.getItem('documentServiceData');
    if (data) {
      const { document, documentURL, documentType, documentFile, maturity } =
        JSON.parse(data); // Add maturity here
      this.document = document;
      this.documentURL = documentURL;
      this.documentType = documentType;
      this.documentFile = documentFile;
      this.maturity = maturity; // And add this line
    }
  }
}
declare module '@ember/service' {
  interface Registry {
    document: DocumentService;
  }
}

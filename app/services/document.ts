/* eslint-disable @typescript-eslint/no-explicit-any */
import { action } from '@ember/object';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { Bindings } from 'rdf-js';
import { getPublicationFromFileContent } from 'validation-monitoring-module/src/index';
import {
  determineDocumentType,
  fetchDocument,
} from '../../validation-monitoring-module/src';

export default class DocumentService extends Service {
  @tracked document: any = null;
  @tracked documentURL: string = '';
  @tracked documentType: string = '';
  @tracked documentFile: File | null = null;

  @action async handleDocumentTypeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    console.log(target.value);
  }

  @action async processPublication({ fileUrl }: { fileUrl: string }) {
    const document: Bindings[] = await fetchDocument(fileUrl);
    const actual: string = determineDocumentType(document);
    return actual;
  }

  @action async processDocumentFile(file: File) {
    this.documentFile = file;
    const html = await file.text();
    const document = await getPublicationFromFileContent(html);
    this.documentType = determineDocumentType(document);
    if (this.documentType) {
      return true;
    } else {
      return false;
    }
  }

  @action async processDocumentURL(fileUrl: string) {
    this.documentURL = fileUrl;
    this.documentType =
      (await this.processPublication({ fileUrl: fileUrl })) || '';

    if (this.documentType) {
      return true;
    } else {
      return false;
    }
  }
}
declare module '@ember/service' {
  interface Registry {
    document: DocumentService;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { action } from '@ember/object';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { Bindings } from 'rdf-js';
import {
  determineDocumentType,
  fetchDocument,
} from '../../validation-monitoring-module/src';

export default class DocumentService extends Service {
  @tracked document: any = null;
  @tracked documentURL: string = '';
  @tracked documentType: string = '';

  @action async handleDocumentTypeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    console.log(target.value);
  }

  @action async processPublication({ fileUrl }: { fileUrl: string }) {
    const document: Bindings[] = await fetchDocument(fileUrl);
    const actual: string = determineDocumentType(document);
    return actual;
  }

  @action async processDocumentURL(fileUrl: string) {
    this.documentURL = fileUrl;
    this.documentType =
      (await this.processPublication({ fileUrl: fileUrl })) || 'No type';

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

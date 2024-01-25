/* eslint-disable @typescript-eslint/no-explicit-any */
import { action } from '@ember/object';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { getRelevantPublicationsValue } from 'validation-monitoring-module/src';

export default class DocumentService extends Service {
  @tracked document: any = null;
  @tracked documentURL: string = '';

  @action async handleDocumentTypeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    console.log(target.value);
  }

  @action async processDocumentURL(fileUrl: string) {
    this.document = await getRelevantPublicationsValue({
      publications: [fileUrl],
    });

    if (this.document) {
      this.documentURL = fileUrl;
      return true;
    }
    return false;
  }
}
declare module '@ember/service' {
  interface Registry {
    document: DocumentService;
  }
}

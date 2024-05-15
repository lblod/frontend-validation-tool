import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from 'tracked-built-ins';

import type DocumentService from 'frontend-validation-tool/services/document';

export type RDFShape = {
  type: string;
  targetClass: string;
  properties: Array<RDFProperty>;
  amountOfProperties?: number;
  validAmountOfProperties?: number;
  closed?: boolean;
};

export type RDFProperty = {
  name: string;
  status?: string;
  description: string;
  path?: string;
  class?: string;
  datatype?: string;
  minCount?: number;
  maxCount?: number;
  valid?: boolean;
  amountFound?: number;
};

export default class ValidationResultsController extends Controller {
  @service declare document: DocumentService;

  @tracked isLoading = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(...args: any[]) {
    super(...args);
    this.document.validateDocument().then((resp) => {
      this.document.validatedDocument = resp;
    });
  }

  get singleCollection() {
    return this.document.validatedDocument.length === 1;
  }
}

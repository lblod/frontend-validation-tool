import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from 'tracked-built-ins';

import type DocumentService from 'validation-monitoring-tool/services/document';

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

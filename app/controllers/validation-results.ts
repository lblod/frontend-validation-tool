import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from 'tracked-built-ins';
import type DocumentService from 'frontend-validation-tool/services/document';
import { STATUS_PILL_TYPES } from 'frontend-validation-tool/constants/status-pills';

export default class ValidationResultsController extends Controller {
  @service declare document: DocumentService;
  pillLegend = STATUS_PILL_TYPES;

  @tracked isLoading = false;
}

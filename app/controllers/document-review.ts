import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type DocumentService from 'validation-monitoring-tool/services/document';

export default class DocumentReviewController extends Controller {
  @service declare document: DocumentService;

  @tracked selectOptions = [
    {
      label: 'Besluitenlijst',
      value: 'besluitenlijst',
    },
    {
      label: 'Notulen',
      value: 'notulen',
    },
    {
      label: 'Agenda',
      value: 'agenda',
    },
  ];
}

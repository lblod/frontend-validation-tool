import Controller from '@ember/controller';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type DocumentService from 'frontend-validation-tool/services/document';
import { getDocumentTypes } from '@lblod/lib-decision-validation/dist/queries';
import type { UploadFile } from 'ember-file-upload/upload-file';

export default class DocumentReviewController extends Controller {
  @service declare document: DocumentService;
  @service declare router: RouterService;

  @tracked selectOptions = getDocumentTypes();
  @tracked uploadedFile: File | null = null;

  @action onFinishUpload(uploadedFile: UploadFile) {
    this.uploadedFile = uploadedFile.file;
  }

  @action handleValidation() {
    this.router.transitionTo('validation-results', {
      queryParams: {
        url: this.document.documentURL,
        documentType: this.document.documentType,
      },
    });
  }
}

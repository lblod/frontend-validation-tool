/* eslint-disable @typescript-eslint/no-explicit-any */
import Route from '@ember/routing/route';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { DOCUMENT_TYPES } from 'validation-monitoring-tool/constants/document-types';
import type Transition from '@ember/routing/transition';
import type DocumentService from 'validation-monitoring-tool/services/document';

export default class ValidationResultsRoute extends Route {
  @service declare router: RouterService;
  @service declare toaster: any;
  @service declare document: DocumentService;
  queryParams = {
    url: {
      refreshModel: true,
    },
    documentType: {
      refreshModel: true,
    },
  };

  async model(params: { url: string; documentType: string }) {
    // Check if the URL is valid and if not, redirect to the document upload page
    if (
      this.document.isProcessingFile &&
      this.document.documentType &&
      !params.url
    ) {
      this.document.validateDocument();
      return;
    }
    this.document.isProcessingFile = false;
    if (!params.url) {
      this.router.transitionTo('document-upload');
      return;
    }
    // Check if the document type is valid and if not, redirect to the document upload page
    if (
      !params.documentType &&
      (await this.document.processDocumentURL(params.url))
    ) {
      this.document.validateDocument();
      return;
    } else if (
      !params.documentType ||
      !DOCUMENT_TYPES.find((type) => type.value === params.documentType)
    ) {
      this.toaster.error(
        'Documenttype niet gevonden.',
        'Selecteer een documenttype uit de lijst.',
      );
      this.router.transitionTo('document-upload');
      return;
    } else if (params.documentType && params.url) {
      this.document.documentType = params.documentType;
      this.document.documentURL = params.url;
      this.document.validateDocument();
    }
    return;
  }

  // added logic to route in order to properly reset the document data when navigating to other routes with out having to hard-refresh
  setupController(controller: any, model: any, transition: Transition) {
    super.setupController(controller, model, transition);
    controller.isLoading = true;
    controller.document.validateDocument().then((resp: any) => {
      controller.document.validatedDocument = resp;
      controller.isLoading = false;
    });
  }
}

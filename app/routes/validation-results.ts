/* eslint-disable @typescript-eslint/no-explicit-any */
import Route from '@ember/routing/route';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import type Transition from '@ember/routing/transition';
import type DocumentService from 'frontend-validation-tool/services/document';
import { getDocumentTypes } from '@lblod/lib-decision-validation/dist/queries';

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
    filterInvalid: {
      refreshModel: true,
    },
  };

  async beforeModel(transition: Transition): Promise<void> {
    const params = transition.to?.queryParams;
    if (params) {
      if (
        this.document.isProcessingFile &&
        this.document.documentType &&
        !params['url']
      ) {
        return;
      }
      this.document.isProcessingFile = false;
      if (!params['url']) {
        this.router.transitionTo('document-upload');
        return;
      }
      // Check if the document type is valid and if not, redirect to the document upload page
      if (
        !params['documentType'] &&
        (await this.document.processDocumentURL(params['url']))
      ) {
        return;
      } else if (
        !params['documentType'] ||
        !getDocumentTypes().find(
          (type) => type.label === params['documentType'],
        )
      ) {
        this.toaster.error(
          'Documenttype niet gevonden.',
          'Selecteer een documenttype uit de lijst.',
        );
        this.router.transitionTo('document-upload');
        return;
      } else if (params['documentType'] && params['url']) {
        this.document.documentType = params['documentType'];
        this.document.documentURL = params['url'];
      }
      return;
    }
  }
  async model(params: {
    url: string;
    documentType: string;
    filterInvalid: boolean;
  }): Promise<object | undefined> {
    if (!params.filterInvalid) {
      return {
        validatedPublication: this.document.validateDocument.perform(),
      };
    } else {
      return {
        validatedPublication:
          this.document.getPublicationfilteredByValidity.perform(),
      };
    }
  }
}

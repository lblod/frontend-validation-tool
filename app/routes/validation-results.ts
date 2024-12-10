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
    if (!params) {
      this.router.transitionTo('document-upload');
      return;
    }

    this.document.documentType = params['documentType'] ?? '';
    this.document.documentURL = params['url'] ?? '';

    // Document type needs to be empty or valid
    if (
      this.document.documentType &&
      !getDocumentTypes().find(
        (type) => type.label === this.document.documentType,
      )
    ) {
      this.toaster.error(
        'Documenttype niet gevonden.',
        'Selecteer een documenttype uit de lijst.',
      );
      this.router.transitionTo('document-upload');
      return;
    }

    if (this.document.documentURL) {
      this.document.isProcessingFile = false;

      // Proceed if data is available through URL and document type is present
      if (this.document.documentType) return;

      // Proceed if data is available through URL and custom blueprint is present
      if (this.document.customBlueprint) return;

      // Proceed if data is available through URL and document type can be determined
      if (await this.document.processDocumentURL(this.document.documentURL))
        return;
    }

    if (this.document.isProcessingFile) {
      // Proceed if data is available as file and document type is present
      if (this.document.documentType) return;

      // Proceed if data is available as file and custom blueprint is present
      if (this.document.customBlueprint) return;
    }

    this.router.transitionTo('document-upload');
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

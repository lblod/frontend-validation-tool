import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from 'tracked-built-ins';
import {
  fetchDocument,
  getBlueprintOfDocumentType,
  validatePublication,
  getExampleOfDocumentType,
  enrichValidationResultWithExample,
} from 'app-validation-tool/dist';

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

  @action async validateDocument() {
    const blueprint = await getBlueprintOfDocumentType(
      this.document.documentType,
    );
    const document = await fetchDocument(this.document.documentURL, '');
    const result = await validatePublication(document, blueprint);

    await this.document.getMaturity(result);

    // NEW: get example and enrich results with specific examples
    const example = await getExampleOfDocumentType(this.document.documentType);
    const enrichedResults = await enrichValidationResultWithExample(
      result,
      blueprint,
      example,
    );
    console.log(enrichedResults);

    return enrichedResults;
  }
}

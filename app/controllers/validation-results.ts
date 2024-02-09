import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type { Bindings } from 'rdf-js';
import { tracked } from 'tracked-built-ins';
import {
  fetchDocument,
  getBlueprintOfDocumentType,
  validatePublication,
} from 'validation-monitoring-module/src';
import type DocumentService from 'validation-monitoring-tool/services/document';

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

  @tracked validatedDocument: RDFShape[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(...args: any[]) {
    super(...args);
    this.validateDocument();
  }

  @action async getDocument() {
    return {
      dataType: 'Agenda',
      properties: [
        {
          name: 'Behandelt',
          found: 1,
        },
        {
          name: 'Start',
          found: 1,
        },
        {
          name: 'Einde',
          found: 0,
        },
        {
          name: 'Geplande Start',
          found: 1,
        },
        {
          name: 'Heeft Notulen',
          found: 0,
        },
      ],
    };
  }
  @action async validateDocument() {
    const blueprint = await this.getBlueprint();
    const document = await fetchDocument(
      'https://drogenbos.meetingburger.net/gr/482e87a0-1463-4e55-b5aa-2082feb3dff5/agenda',
    );
    console.log(blueprint);
    await validatePublication(document, blueprint)
      .then((result) => {
        console.log('result', result);
        this.validatedDocument = result;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  @action async getBlueprint(): Promise<Bindings[]> {
    return getBlueprintOfDocumentType(this.document.documentType);
  }
}

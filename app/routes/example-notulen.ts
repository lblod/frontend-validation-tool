import Route from '@ember/routing/route';
import { getHTMLExampleOfDocumentType } from '@lblod/lib-decision-shapes';

export default class ExampleNotulenRoute extends Route<string> {
  model(): string {
    return getHTMLExampleOfDocumentType('Notulen');
  }
}

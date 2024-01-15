/* eslint-disable @typescript-eslint/no-explicit-any */
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import {
  getRelevantPublicationsValue,
  getRelevantPublicationsWithinTimeInterval,
} from '../lib/util';

import ENV from '../config/environment';

export default class ApplicationController extends Controller {
  @tracked resolvedPublication: any = [];
  @tracked publicationURL = '';
  @tracked amountOfRelevantPublications = 0;
  get proxy(): string {
    return ENV.APP['PROXY_URL'] as string;
  }

  @action handleChange(event: Event) {
    this.publicationURL = (event.target as HTMLInputElement).value;
  }

  @action async validatePublication() {
    const publications = [this.publicationURL];
    const start = '2020-01-01T00:00:00';
    const eind = '2020-12-31T00:00:00';
    const relevantPublications = await getRelevantPublicationsValue({
      proxy: this.proxy,
      publications: publications,
    });

    const AmountOfRelevantPublications =
      await getRelevantPublicationsWithinTimeInterval({
        publications: publications,
        proxy: this.proxy,
        start: start,
        eind: eind,
      });

    this.amountOfRelevantPublications = AmountOfRelevantPublications.length;

    relevantPublications.on('data', (data: any) => {
      console.log(data.get('o').value);
      this.resolvedPublication.push(data.get('o').value);
      // return data.toString();
    });
  }
}

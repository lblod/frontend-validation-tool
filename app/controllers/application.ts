/* eslint-disable @typescript-eslint/no-explicit-any */
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import {
  getRelevantPublicationsValue,
  getRelevantPublicationsWithinTimeInterval,
  lmao,
} from '../../validation-monitoring-module/src/index';

export default class ApplicationController extends Controller {
  @tracked resolvedPublication: any = [];
  @tracked publicationURL = '';
  @tracked amountOfRelevantPublications = 0;

  @action handleChange(event: Event) {
    lmao();
    this.publicationURL = (event.target as HTMLInputElement).value;
  }

  @action async validatePublication() {
    const publications = [this.publicationURL];
    const start = '2020-01-01T00:00:00';
    const eind = '2020-12-31T00:00:00';
    const relevantPublications = await getRelevantPublicationsValue({
      publications: publications,
    });

    const AmountOfRelevantPublications =
      await getRelevantPublicationsWithinTimeInterval({
        publications: publications,
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

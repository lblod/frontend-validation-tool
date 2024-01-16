/* eslint-disable @typescript-eslint/no-explicit-any */
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  @tracked resolvedPublication: any = [];
  @tracked amountOfRelevantPublications = 0;

  //toaster
  @service declare toaster: any;
  @tracked currentToast: any = null;

  // input
  @tracked labelError = false;
  @tracked publicationURL = '';
  @action handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.publicationURL = target.value;
    this.validateURL({ url: target.value });
  }

  @action async validateURL({ url }: { url: string }) {
    const validUrl = url.match(/^(ftp|http|https):\/\/[^ "]+$/);
    console.log(validUrl);
    if (validUrl) {
      this.labelError = false;
      console.log('valid');
      return true;
    } else {
      this.labelError = true;
      console.log('invalid');
      return false;
    }
  }

  // button
  @tracked buttonDisabled = true;
  @tracked loading = false;
  @tracked loadingMessage = '';

  @action async handleButton() {
    this.currentToast = null;
    this.loadingMessage = 'Publicatie laden...';
    this.loading = true;
    const valid = await this.validateURL({ url: this.publicationURL });
    if (valid) {
      this.currentToast = this.toaster.success(
        'Correcte URL',
        'Publicatie wordt geladen',
      );
    } else {
      this.currentToast = this.toaster.error(
        'Foute URL',
        'Geef een correcte URL in',
      );
    }
    this.loading = false;
  }
}

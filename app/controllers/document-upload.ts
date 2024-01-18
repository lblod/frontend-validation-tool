/* eslint-disable @typescript-eslint/no-explicit-any */
import Controller from '@ember/controller';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type DocumentService from 'validation-monitoring-tool/services/document';

export default class DocumentUploadController extends Controller {
  @tracked resolvedPublication: any = [];
  @tracked amountOfRelevantPublications = 0;

  //toaster
  @service declare toaster: any;
  @service declare document: DocumentService;
  @service declare router: RouterService;
  @tracked currentToast: any = null;

  // input
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
      console.log('valid');
      return true;
    } else {
      console.log('invalid');
      return false;
    }
  }

  // button
  @tracked buttonDisabled = true;
  @tracked loading = false;
  @tracked loadingMessage = '';

  @action async handleButton() {
    this.toaster.close(this.currentToast);
    this.loadingMessage = 'Publicatie laden...';
    this.loading = true;
    const valid = await this.validateURL({ url: this.publicationURL });
    if (valid) {
      this.currentToast = this.toaster.success(
        'Correcte URL',
        'Publicatie wordt geladen',
      );
      const isPublication = await this.document.processDocumentURL(
        this.publicationURL,
      );

      if (isPublication) {
        this.router.transitionTo('document-review');
      } else {
        this.currentToast = this.toaster.error(
          'Geen publicatie gevonden',
          'Geef een correcte URL in',
        );
      }
    } else {
      this.currentToast = this.toaster.error(
        'Foute URL',
        'Geef een correcte URL in',
      );
    }
    this.loading = false;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { UploadFile } from 'ember-file-upload/upload-file';

export default class ApplicationController extends Controller {
  @tracked resolvedPublication: any = [];
  @tracked amountOfRelevantPublications = 0;

  //toaster
  @service declare toaster: any;
  @tracked currentToast: any = null;

  // input
  @tracked publicationURL = '';
  @action handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.publicationURL = target.value;
    if (this.publicationURL) {
      this.buttonDisabled = false;
    } else {
      this.buttonDisabled = true;
    }
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

  // file upload
  @tracked fileUpload = false;

  @action onFinishUpload(uploadedFile: UploadFile) {
    this.toaster.close(this.currentToast);
    this.loadingMessage = 'Bestand verwerken...';
    this.loading = true;
    const valid = this.validateFile(uploadedFile);
    if (valid) {
      this.currentToast = this.toaster.success(
        'Correct bestand',
        'Publicatie wordt geladen',
      );
    } else {
      this.currentToast = this.toaster.error(
        'Fout bestand',
        'Geef een correcte URL in',
      );
    }
    this.loading = false;
    this.buttonDisabled = false;
  }

  @action validateFile(file: UploadFile) {
    console.log(file);
    return true;
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
    } else {
      this.currentToast = this.toaster.error(
        'Foute URL',
        'Geef een correcte URL in',
      );
    }
    this.loading = false;
  }
}

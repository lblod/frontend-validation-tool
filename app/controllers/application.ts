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

  // file upload
  @tracked fileInputDisabled = false;
  @tracked fileUpload = false;

  @action onFinishUpload(uploadedFile: UploadFile) {
    this.inputDisabled = true;
    this.toaster.close(this.currentToast);
    this.loadingMessage = 'Bestand verwerken...';
    this.loading = true;
    const valid = this.validateFile(uploadedFile);
    if (valid) {
      this.fileUpload = true;
      this.currentToast = this.toaster.success(
        'Correct bestand',
        'Publicatie wordt geladen',
      );
    } else {
      this.fileUpload = false;
      this.currentToast = this.toaster.error(
        'Fout bestand',
        'Geef een correcte URL in',
      );
    }
    this.loading = false;
    this.buttonDisabled = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @action validateFile(file: UploadFile) {
    return true;
  }

  // input
  @tracked inputDisabled = false;
  @tracked publicationURL = '';
  @action handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.publicationURL = target.value;
    if (this.publicationURL) {
      this.fileInputDisabled = true;
      this.buttonDisabled = false;
    } else {
      this.buttonDisabled = true;
      this.fileInputDisabled = false;
    }
    this.validateURL({ url: target.value });
  }

  @action async validateURL({ url }: { url: string }) {
    const validUrl = url.match(/^(ftp|http|https):\/\/[^ "]+$/);
    if (validUrl) {
      return true;
    } else {
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
    if (this.fileUpload) {
      this.currentToast = this.toaster.success(
        'Correct bestand',
        'Publicatie wordt geladen',
      );
    } else {
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
    }
    this.loading = false;
  }
}

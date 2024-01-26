/* eslint-disable @typescript-eslint/no-explicit-any */
import Controller from '@ember/controller';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { UploadFile } from 'ember-file-upload/upload-file';
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
  @tracked fileInputDisabled = false;
  @tracked fileUpload = false;
  @tracked uploadedFile: File | null = null;

  @action onFinishUpload(uploadedFile: UploadFile) {
    this.inputDisabled = true;
    this.toaster.close(this.currentToast);
    this.loadingMessage = 'Bestand verwerken...';
    this.loading = true;
    this.uploadedFile = uploadedFile.file;
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
    if (this.fileUpload) {
      await this.document.processDocumentFile(this.uploadedFile as File);
      this.router.transitionTo('document-review');
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
        const isPublication = await this.document.processDocumentURL(
          this.publicationURL,
        );

        if (isPublication) {
          this.document.processDocumentURL(this.publicationURL);
          this.router.transitionTo('document-review');
        } else {
          this.currentToast = this.toaster.error(
            'Geen publicatie gevonden',
            'Geef een correcte URL in',
          );
        }
      }
    }
    this.loading = false;
  }
}

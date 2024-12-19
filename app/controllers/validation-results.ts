import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from 'tracked-built-ins';
import type DocumentService from 'frontend-validation-tool/services/document';
import { STATUS_PILL_TYPES } from 'frontend-validation-tool/constants/status-pills';
import { action } from '@ember/object';

export default class ValidationResultsController extends Controller {
  @service declare document: DocumentService;
  pillLegend = STATUS_PILL_TYPES;

  @tracked declare model: {
    validatedPublication: {
      isRunning: boolean;
      isFinished: boolean;
      value: unknown;
    };
  };

  get isLoading() {
    return this.model?.validatedPublication.isRunning;
  }

  get validatedPublication() {
    return this.model?.validatedPublication.isFinished
      ? this.model?.validatedPublication.value
      : [];
  }

  @action
  scrollToTarget() {
    const fragment = window.location.hash.slice(1);
    if (!fragment) {
      return;
    }
    console.log(fragment);
    const offset = 50;
    const observer = new MutationObserver(() => {
      const childElement = document.getElementById(fragment);
      if (childElement) {
        const rect = childElement.getBoundingClientRect();
        window.scrollTo({
          top: window.scrollY + rect.top - offset,
          behavior: 'auto',
        });
        observer.disconnect();
      } else {
        console.log('Element not found. ' + fragment);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
}

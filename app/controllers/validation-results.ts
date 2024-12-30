import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from 'tracked-built-ins';
import type DocumentService from 'frontend-validation-tool/services/document';
import { STATUS_PILL_TYPES } from 'frontend-validation-tool/constants/status-pills';
import { action, set } from '@ember/object';
import type {
  ValidatedPublication,
  ValidationErrors,
} from '@lblod/lib-decision-validation/dist/types';
import type RouterService from '@ember/routing/router-service';

export default class ValidationResultsController extends Controller {
  @service declare document: DocumentService;
  @service declare router: RouterService;
  pillLegend = STATUS_PILL_TYPES;

  @tracked declare model: {
    validatedPublication: {
      isRunning: boolean;
      isFinished: boolean;
      value: { res?: ValidatedPublication; errors?: ValidationErrors[] };
    };
  };
  @tracked errors = [
    {
      title: 'Fout',
      description:
        'Er is een fout opgetreden bij het valideren van het document.',
    },
  ];

  get isLoading() {
    return this.model?.validatedPublication.isRunning;
  }

  get validatedPublication() {
    return this.model?.validatedPublication.isFinished
      ? this.model?.validatedPublication.value.res
      : [];
  }
  get validatedPublicationErrors() {
    return this.model?.validatedPublication.isFinished
      ? this.model?.validatedPublication.value.errors
      : [];
  }

  @action
  reloadPage() {
    window.location.reload();
  }

  @action
  scrollToTarget(id: string) {
    let fragment = id;
    if (typeof id === 'object') {
      fragment = window.location.hash.slice(1);
    }
    if (!fragment) {
      return;
    }
    if (typeof id === 'string' && this.model?.validatedPublication) {
      this.document.loadingStatus = 'Aan het laden...';
      set(this.model.validatedPublication, 'isRunning', true);
      window.location.hash = fragment;
      setTimeout(() => {
        set(this.model.validatedPublication, 'isRunning', false);
      }, 1);
    }
    const element = document.getElementById(fragment);
    if (element) {
      this._scrollToPosition(element);
    } else {
      const observer = new MutationObserver(() => {
        const element = document.getElementById(fragment);
        if (element) {
          this._scrollToPosition(element);
          observer.disconnect();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  _scrollToPosition(element: HTMLElement) {
    const offset = 50;
    const rect = element.getBoundingClientRect();
    window.scrollTo({
      top: window.scrollY + rect.top - offset,
      behavior: 'smooth',
    });
  }
}

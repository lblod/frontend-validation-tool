/* eslint-disable @typescript-eslint/no-explicit-any */
import Route from '@ember/routing/route';

export default class ValidationResultsRoute extends Route {
  // added logic to route in order to properly reset the document data when navigating to other routes with out having to hard-refresh
  setupController(controller: any, model: any, transition: any) {
    super.setupController(controller, model, transition);
    controller.isLoading = true;
    controller.document.validateDocument().then((resp: any) => {
      controller.document.validatedDocument = resp;
      controller.isLoading = false;
    });
  }
}

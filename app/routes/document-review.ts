import Route from '@ember/routing/route';

export default class DocumentReviewRoute extends Route {
  queryParams = {
    url: {
      refreshModel: true,
    },
  };

  model(params: { url: string }) {
    // Decode the URL component
    return decodeURIComponent(params.url);
  }
}

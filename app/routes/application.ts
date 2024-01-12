import Route from '@ember/routing/route';

export default class ApplicationRoute extends Route {
  model() {
    return ['Marie Curie', 'Mae Jemison', 'Albert Hofmann'];
  }
}

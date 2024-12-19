import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ScrollToTopButtonComponent extends Component {
  @tracked showButton: boolean = false; // Tracks whether the button is visible

  constructor(owner: unknown, args: unknown) {
    super(owner, args);
    this._setupScrollListener();
  }

  willDestroy(): void {
    super.willDestroy();
    this._removeScrollListener();
  }

  /**
   * Set up the scroll event listener to track the scroll position.
   */
  private _setupScrollListener(): void {
    window.addEventListener('scroll', this.handleScroll);
  }

  /**
   * Remove the scroll event listener to prevent memory leaks.
   */
  private _removeScrollListener(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }

  /**
   * Handle the scroll event and update the `showButton` property.
   */
  @action
  handleScroll(): void {
    this.showButton = window.scrollY > 100;
  }

  /**
   * Scroll the page smoothly to the top.
   */
  @action
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}

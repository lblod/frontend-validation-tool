import { visit, currentRouteName, waitUntil } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'frontend-validation-tool/tests/helpers';
import 'qunit-dom';

module('Acceptance | validation results', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /example-notulen returns HTML with Notulen mentioned', async function (assert) {
    const res = await fetch('http://localhost:4200/example-notulen.html');
    const text = await res.text();
    assert.ok(text.includes('<!DOCTYPE html>'));
    assert.ok(text.includes('Notulen'));
  });

  test('visiting /validation-results without query params should lead to document-upload route', async function (assert) {
    try {
      await visit('/validation-results');
    } catch (e) {
      // A transition happens when visiting /validation-results without query params
      // This needs to be catched here
      console.error(e);
    }
    assert.strictEqual(currentRouteName(), 'document-upload');
  });

  test('visiting /validation-results with query params defined should return validation results route', async function (assert) {
    const url = `/validation-results?documentType=Notulen&url=${encodeURIComponent('http://localhost:4200/example-notulen.html')}`;
    await visit(url);
    assert.strictEqual(currentRouteName(), 'validation-results');
  });

  test('visiting /validation-results to validate example-notulen.html should return 2 Class Collection components and 7 Root Subject components', async function (assert) {
    const url = `/validation-results?documentType=Notulen&url=${encodeURIComponent('http://localhost:4200/example-notulen.html')}`;
    await visit(url);

    const controller = this.owner.lookup('controller:validation-results');
    // Wait until the publication has been loaded
    await waitUntil(
      () => {
        return !controller.isLoading;
      },
      { timeout: 15000 },
    ); // optional timeout in milliseconds

    assert
      .dom('[data-test-class-collection]')
      .exists('The Class Collection component is added to the page');
    assert
      .dom('[data-test-class-collection]')
      .exists({ count: 2 }, 'The Class Collection component is rendered twice');
    assert
      .dom('[data-test-root-subject]')
      .exists('The Root Subject component is added to the page');
    assert
      .dom('[data-test-root-subject]')
      .exists(
        { count: 7 },
        'The Root Subject component is rendered seven times',
      );
  });
});

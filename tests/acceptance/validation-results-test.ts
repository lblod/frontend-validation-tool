import { module, test } from 'qunit';
import { visit, pauseTest, currentRouteName, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'frontend-validation-tool/tests/helpers';
import 'qunit-dom';

module('Acceptance | validation results', function (hooks) {
  setupApplicationTest(hooks);

  test('Mirage server is available', function (assert) {
    assert.ok(this.server, 'Mirage server should be initialized');
  });

  test('visiting /example-notulen returns HTML', async function (assert) {
    await visit('/example-notulen');

    const element = find('.ember-view');
    assert.ok(element, 'The element is present');
  });

  test('the response of /example-notulen contains the word Notulen', async function (assert) {
    await visit('/example-notulen');
    const body = document.querySelector('body')!.innerHTML;
    assert.ok(
      body.includes('Notulen'),
      'The body contains the expected word Notulen.',
    );
  });

  test('visiting /validation-results without query params should lead to document-upload route', async function (assert) {
    try {
      await visit('/validation-results');
    } catch (e) {
      console.error(e);
    }
    assert.strictEqual(currentRouteName(), 'document-upload');
  });

  // Note: Comunica is not able to dereference relative URL
  // Note: further testing is not on this local HTML example-notulen: Uncaught TypeError: Cannot read properties of undefined (reading 'getReader')
  // TODO check with lib-validation-tool on http://localhost:4200/example-notulen
  test('visiting /validation-results with query params defined should return validation results route', async function (assert) {
    try {
      const url = `/validation-results?documentType=Notulen&url=${encodeURIComponent('http://localhost:4200/example-notulen')}`;
      await visit(url);
    } catch (e) {
      console.error(e);
    }
    assert.strictEqual(currentRouteName(), 'validation-results');
  });
});

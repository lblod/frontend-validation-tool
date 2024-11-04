import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'frontend-validation-tool/tests/helpers';

module('Acceptance | validation results', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /validation-results', async function (assert) {
    try {
      await visit('/validation-results', { accept: 'text/html' });
    } catch (e) {
      console.error(e);
    }

    assert.strictEqual(currentURL(), '/');
  });
});

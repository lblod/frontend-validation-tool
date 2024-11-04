import { module, test } from 'qunit';
import { visit, pauseTest, currentRouteName } from '@ember/test-helpers';
import { setupApplicationTest } from 'frontend-validation-tool/tests/helpers';

module('Acceptance | validation results', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /validation-results without query params should lead to document-upload route', async function (assert) {
    try {
      await visit('/validation-results');
    } catch (e) {
      console.error(e);
    }
    assert.strictEqual(currentRouteName(), 'document-upload');
  });
});

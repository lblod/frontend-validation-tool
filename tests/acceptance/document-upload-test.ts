import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'frontend-validation-tool/tests/helpers';

module('Acceptance | document upload', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /document-upload', async function (assert) {
    await visit('/');

    assert.strictEqual(currentURL(), '/');
  });
});

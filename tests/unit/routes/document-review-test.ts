import { module, test } from 'qunit';
import { setupTest } from 'frontend-validation-tool/tests/helpers';

module('Unit | Route | document-review', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:document-review');
    assert.ok(route);
  });
});

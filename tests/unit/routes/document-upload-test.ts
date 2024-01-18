import { module, test } from 'qunit';
import { setupTest } from 'validation-monitoring-tool/tests/helpers';

module('Unit | Route | document-upload', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:document-upload');
    assert.ok(route);
  });
});

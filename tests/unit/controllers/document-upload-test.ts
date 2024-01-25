import { module, test } from 'qunit';
import { setupTest } from 'validation-monitoring-tool/tests/helpers';

module('Unit | Controller | document-upload', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    const controller = this.owner.lookup('controller:document-upload');
    assert.ok(controller);
  });
});

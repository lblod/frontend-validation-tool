import { module, test } from 'qunit';
import { setupTest } from 'validation-monitoring-tool/tests/helpers';

module('Unit | Controller | document-review', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    const controller = this.owner.lookup('controller:document-review');
    assert.ok(controller);
  });
});

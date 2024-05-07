import { module, test } from 'qunit';
import { setupTest } from 'frontend-validation-tool/tests/helpers';

module('Unit | Service | document', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    const service = this.owner.lookup('service:document');
    assert.ok(service);
  });
});

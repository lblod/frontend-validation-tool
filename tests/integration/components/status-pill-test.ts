import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend-validation-tool/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | status-pill', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<StatusPill />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <StatusPill>
        template block text
      </StatusPill>
    `);

    assert.dom().hasText('template block text');
  });
});

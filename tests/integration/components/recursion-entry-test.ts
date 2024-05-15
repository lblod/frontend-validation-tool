import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend-validation-tool/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | recursion-entry', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<RecursionEntry />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <RecursionEntry>
        template block text
      </RecursionEntry>
    `);

    assert.dom().hasText('template block text');
  });
});

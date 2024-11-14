import {
  visit,
  currentRouteName,
  currentURL,
  waitUntil,
  fillIn,
  click,
  waitFor,
} from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'frontend-validation-tool/tests/helpers';
import 'qunit-dom';

module('Acceptance | validation results', function (hooks) {
  setupApplicationTest(hooks);

  const EXAMPLE_URL = 'http://localhost:4200/example-notulen.html';

  test('visiting /example-notulen returns HTML with Notulen mentioned', async function (assert) {
    const res = await fetch(EXAMPLE_URL);
    const text = await res.text();
    assert.ok(text.includes('<!DOCTYPE html>'));
    assert.ok(text.includes('Notulen'));
  });

  test('visiting /validation-results without query params should lead to document-upload route', async function (assert) {
    try {
      await visit('/validation-results');
    } catch (e) {
      // A transition happens when visiting /validation-results without query params
      // This needs to be catched here
      console.error(e);
    }
    assert.strictEqual(currentRouteName(), 'document-upload');
  });

  test('visiting /validation-results with query params defined should return validation results route', async function (assert) {
    const url = `/validation-results?documentType=Notulen&url=${encodeURIComponent(EXAMPLE_URL)}`;
    await visit(url);
    assert.strictEqual(currentRouteName(), 'validation-results');
  });

  test('visiting /validation-results to validate example-notulen.html should return 2 Class Collection components and 7 Root Subject components', async function (assert) {
    const url = `/validation-results?documentType=Notulen&url=${encodeURIComponent(EXAMPLE_URL)}`;
    await visit(url);

    const controller = this.owner.lookup('controller:validation-results');
    // Wait until the publication has been loaded
    await waitUntil(
      () => {
        return !controller.isLoading;
      },
      { timeout: 15000 },
    ); // optional timeout in milliseconds

    assert
      .dom('[data-test-class-collection]')
      .exists('The Class Collection component is added to the page');
    assert
      .dom('[data-test-class-collection]')
      .exists({ count: 2 }, 'The Class Collection component is rendered twice');
    assert
      .dom('[data-test-root-subject]')
      .exists('The Root Subject component is added to the page');
    assert
      .dom('[data-test-root-subject]')
      .exists(
        { count: 7 },
        'The Root Subject component is rendered seven times',
      );
  });

  test('transition between document-upload, document-review, and validation-results', async function (assert) {
    // Step 1: Visit the document-upload route
    await visit('/');
    assert.strictEqual(
      currentURL(),
      '/',
      'We are on the document-upload route',
    );
    assert
      .dom('[data-test-document-upload]')
      .exists('Document-upload page is displayed');

    // Fill in example URL
    await fillIn('[data-test-field="publication-link"]', EXAMPLE_URL);

    // Simulate transition to document-review by clicking "Volgende" button to proceed
    await click('[data-test-button="volgende"]');

    await waitFor('[data-test-document-review]', { timeout: 15000 }); // Wait for an element in the document-review route

    // Step 2: Transition to document-review route
    assert.strictEqual(
      currentRouteName(),
      'document-review',
      'We transitioned to the document-review route',
    );
    assert
      .dom('[data-test-document-review]')
      .exists('Document-review page is displayed');

    assert
      .dom('[data-test-field="documentTypeSelect"] option:checked')
      .hasText('Notulen', 'The selected option is "Notulen"');

    // Simulate transition to validation-results by clicking "Validatie starten" button
    await click('[data-test-button="validatieStarten"]');

    // Step 3: Transition to validation-results route
    assert.strictEqual(
      currentRouteName(),
      'validation-results',
      'We transitioned to the validation-results route',
    );
    assert
      .dom('[data-test-validation-results]')
      .exists('Validation-results page is displayed');

    // Assert that the publication link contains the correct href and text
    assert
      .dom('[data-test-field="publication-link"]')
      .hasAttribute('href', EXAMPLE_URL, 'Link has correct href');
  });
});

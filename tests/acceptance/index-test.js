import { module, test } from 'qunit';
import { currentURL, visit } from '@ember/test-helpers';
import { find } from 'ember-native-dom-helpers';
import { setupApplicationTest } from 'ember-qunit';

const styleString = 'touch-action: manipulation; -ms-touch-action: manipulation; cursor: pointer;';

module('Acceptance | index', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /index, ensures we hooked everything up appropriately', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/');

    let linkComponent = find('#indexLink').getAttribute('style');
    let clickComponent = find('#clickComponent').getAttribute('style');
    let nativeLink = find('#nativeLink').getAttribute('style');
    let onClickElement = find('#actionOnClick').getAttribute('style');
    let actionElement = find('#actionElement').getAttribute('style');

    assert.equal(linkComponent, styleString, `Actual Link Style: ${linkComponent}`);
    assert.equal(clickComponent, styleString, `Actual Click Component Style: ${clickComponent}`);
    assert.equal(nativeLink, styleString, `Actual Anchor Style: ${nativeLink}`);
    assert.equal(onClickElement, styleString, `Actual onClick Element Style: ${onClickElement}`);
    assert.equal(actionElement, styleString, `Actual action Element Style: ${actionElement}`);
  });
});

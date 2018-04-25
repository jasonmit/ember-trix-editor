import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render, clearRender } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import jQuery from 'jquery';

module('Integration | Component | trix-editor', function(hooks) {
  setupRenderingTest(hooks);

  test('renders', async function (assert) {
    await render(hbs`{{trix-editor}}`);

    assert.dom('input').exists();
    assert.dom('trix-editor').exists();
  });

  module('the `autofocus` attribute', function() {
    test('the input is not focused by default', async function(assert) {
      await render(hbs`{{trix-editor}}`);

      assert.dom('trix-editor').isNotFocused();
    });

    module('focusing on initial render', function() {
      test('is not focused with `autofocus=false`', async function(assert) {
        await render(hbs`
          {{trix-editor autofocus=false}}
        `);

        assert.dom('trix-editor').isNotFocused();
      });

      test('is focused with `autofocus=true`', async function(assert) {
        await render(hbs`
          {{trix-editor autofocus=true}}
        `);

        assert.dom('trix-editor').isFocused();
      });
    });
  });

  module('placeholder', function() {
    test('does not set a placeholder by default', async function(assert) {
      await render(hbs`
        {{trix-editor}}
      `);

      assert.dom('trix-editor').doesNotHaveAttribute('placeholder');
    });

    test('passes the property down to the editor', async function(assert) {
      await render(hbs`
        {{trix-editor placeholder='test placeholder'}}
      `);

      assert.dom('trix-editor').hasAttribute('placeholder', 'test placeholder');
    });
  });

  module('editorClass', function() {
    test('does not set a class on the editor by default', async function(assert) {
      await render(hbs`
        {{trix-editor}}
      `);

      assert.dom('trix-editor').doesNotHaveAttribute('class');
    });

    test('can pass a class to the editor', async function(assert) {
      await render(hbs`
        {{trix-editor editorClass="one"}}
      `);

      assert.dom('trix-editor').hasClass('one');
    });
  });

  module('event listeners', function() {
    test('adds event listeners on insertion', async function(assert) {
      await render(hbs`
        {{trix-editor}}
      `);

      const $editor = await find('trix-editor');
      const events = jQuery._data($editor, 'events');

      assert.ok(events['trix-blur']);
      assert.ok(events['trix-change']);
      assert.ok(events['trix-file-accept']);
      assert.ok(events['trix-focus']);
      assert.ok(events['trix-initialize']);
      assert.ok(events['trix-selection-change']);
      assert.ok(events['trix-attachment-add']);
      assert.ok(events['trix-attachment-remove']);
    });

    test('removes event listeners on destruction', async function(assert) {
      await render(hbs`
        {{trix-editor}}
      `);

      const $editor = await find('trix-editor');

      await clearRender();

      const events = jQuery._data($editor, 'events');
      assert.equal(events, undefined, 'Event listeners removed');
    });
  });
});

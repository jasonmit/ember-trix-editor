import Ember from 'ember';
import layout from '../templates/components/trix-editor';

const { run, computed } = Ember;
export default Ember.Component.extend({
  layout,
  attachmentsDisabled: false,
  value: '',
  autofocus: false,

  _focused: false,
  _value: null,

  _inputId: computed('elementId',function() {
    return `trix-editor-${this.get('elementId')}`;
  }).readOnly(),

  autofocusOn: computed('autofocus', function () {
    return !!this.autofocus ? true : null;
  }).readOnly(),

  'trix-blur'() {},
  'trix-change'() {},
  'trix-file-accept'() {},
  'trix-focus'() {},
  'trix-initialize'() {},
  'trix-selection-change'() {},
  'trix-attachment-add'() {},
  'trix-attachment-remove'() {},

  didInsertElement() {
    this._super();

    let $editor = this._getEditor();

    $editor.on('trix-change', run.bind(this, 'trix-change'))
      .on('trix-initialize', run.bind(this, 'trix-initialize'))
      .on('trix-attachment-add', run.bind(this, 'trix-attachment-add'))
      .on('trix-attachment-remove', run.bind(this, 'trix-attachment-remove'))
      .on('trix-selection-change', run.bind(this, 'trix-selection-change'));

    $editor.on('trix-blur', e => {
      console.log('blur');
      this._focused = false;
      run(this, 'trix-blur', e);
    });

    $editor.on('trix-focus', e => {
      console.log('focus in');
      this._focused = true;
      run(this, 'trix-focus', e);
    });

    $editor.on('trix-file-accept', e => {
      run(this, function() {
        if (this.attachmentsDisabled) {
          e.preventDefault();
        }

        this['trix-file-accept'](e);
      })
    });
  },

  didReceiveAttrs() {
    this._super(...arguments);
    let newValue = this.get('value');

    if (this._value !== newValue && !this._focused) {
      run.cancel(this._timer);
      this._timer = run.schedule('afterRender', this, this._rehydrate);
      this._value = newValue;
    }
  },

  willDestroyElement() {
    this._super();
    run.cancel(this._timer);

    let $editor = this._getEditor();
    $editor.off('trix-attachment-add')
      .off('trix-attachment-remove')
      .off('trix-blur')
      .off('trix-change')
      .off('trix-file-accept')
      .off('trix-focus')
      .off('trix-initialize')
      .off('trix-selection-change');
  },

  _getEditor() {
    return this.$().find('trix-editor');
  },

  _rehydrate() {
    if (this._focused) {
      return;
    }

    let element = this._getEditor()[0];
    let pos = element.editor.getPosition();
    console.log('updating value', this.value);
    element.editor.loadHTML(this.value);
    element.editor.setSelectedRange(pos);
  }
});

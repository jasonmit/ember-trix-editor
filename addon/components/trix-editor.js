import Ember from 'ember';
import layout from '../templates/components/trix-editor';

const { set, run, computed } = Ember;

export default Ember.Component.extend({
  layout,
  attachmentsDisabled: false,
  value: '',
  autofocus: false,

  _value: '',
  _focused: false,
  _initialized: false,
  _inputId: computed('elementId', function() {
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

  init() {
    this._super();
    this._timers = [];
  },

  didInsertElement() {
    this._super();

    let $editor = this._getEditor();

    $editor
      .on('trix-change', run.bind(this, 'trix-change'))
      .on('trix-attachment-add', run.bind(this, 'trix-attachment-add'))
      .on('trix-attachment-remove', run.bind(this, 'trix-attachment-remove'))
      .on('trix-selection-change', run.bind(this, 'trix-selection-change'));

    $editor.on('trix-focus', e => {
      this._focused = true;
      run(this, 'trix-focus', e);
    });

    $editor.on('trix-blur', e => {
      this._focused = false;
      run(this, 'trix-blur', e);
    });

    $editor.on('trix-initialize', e => {
      run(this, 'trix-initialize', e);
      this._timers.push(
        run.scheduleOnce('afterRender', this, () => {
          /* prevents doing work before it's been fully setup */
          set(this, '_initialized', true);
        })
      );
    });

    $editor.on('trix-file-accept', e => {
      run(this, function() {
        if (this.attachmentsDisabled) {
          e.preventDefault();
        }

        this['trix-file-accept'](e);
      });
    });
  },

  didReceiveAttrs() {
    this._super(...arguments);
    let newValue = this.get('value');

    if (
      this._initialized &&
      this.element &&
      this._value !== newValue &&
      !this._focused
    ) {
      this._timers.push(run.scheduleOnce('afterRender', this, this._rehydrate));
      this._value = newValue;
    }
  },

  willDestroyElement() {
    this._super();
    this._timers.forEach(timer => run.cancel(timer));

    let $editor = this._getEditor();
    $editor
      .off('trix-attachment-add')
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
    element.editor.loadHTML(this.value);
  }
});

import EmberObject from '@ember/object';
import { A } from '@ember/array';
import { on } from '@ember/object/evented';
import Controller from '@ember/controller';

export default Controller.extend({
  events: null,

  _initializeEvents: on('init', function () {
    this.set('events', A());
  }),

  actions: {
    handleTrixAction(jqEvent) {
      this.get('events').unshiftObject(EmberObject.create({
        type: jqEvent.type
      }));
    }
  }
});

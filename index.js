'use strict';

module.exports = {
  name: 'ember-trix-editor',

  included(app) {
    this._super.included(app);

    app.import('vendor/trix.js');
    app.import('vendor/trix.css');
  }
};

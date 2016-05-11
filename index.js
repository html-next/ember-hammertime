/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-hammertime',

  included: function (app) {
    this._super.included.apply(this, arguments);

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    while (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    if (typeof app.import !== 'function') {
      throw new Error('Ember-Hammertime is being used within another addon or engine ' +
        'and is having trouble registering itself to the parent application.');
    }

    if (!process.env.EMBER_CLI_FASTBOOT) {
      app.import(app.bowerDirectory + '/hammer-time/hammer-time.js');
    }
  },

  isDevelopingAddon: function() {
    return false;
  },

  setupPreprocessorRegistry: function(type, registry) {
    var TouchAction = require('./htmlbars-plugins/touch-action');

    registry.add('htmlbars-ast-plugin', {
      name: "touch-action",
      plugin: TouchAction
    });

  }

};

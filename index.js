/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-hammertime',

  included: function (app) {
    this._super.included.apply(this, arguments);

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    if (!process.env.EMBER_CLI_FASTBOOT) {
      app.import(app.bowerDirectory + '/hammer-time/hammer-time.js');
    }
  },

  isDevelopingAddon: function() {
    return true;
  },

  setupPreprocessorRegistry: function(type, registry) {
    var TouchAction = require('./htmlbars-plugins/touch-action');

    registry.add('htmlbars-ast-plugin', {
      name: "touch-action",
      plugin: TouchAction
    });

  }

};

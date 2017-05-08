/* eslint-env node */
'use strict';

var path = require('path');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');

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
      app.import('vendor/hammer-time.js');
    }
  },

  treeForVendor(vendorTree) {
    var trees = [];
    var hammertimeTree = new Funnel(path.dirname(require.resolve('hammer-timejs/hammer-time.js')), {
      files: ['hammer-time.js'],
    });

    if (vendorTree !== undefined) {
      trees.push(vendorTree);
    }
    
    trees.push(hammertimeTree);
    
    return new MergeTrees(trees);
  },

  isDevelopingAddon: function() {
    return false;
  },

  projectConfig: function () {
    return this.project.config(process.env.EMBER_ENV);
  },

  setupPreprocessorRegistry: function(type, registry) {
    var TouchAction = require('./htmlbars-plugins/touch-action');
    var config = this.projectConfig()['EmberHammertime'];

    registry.add('htmlbars-ast-plugin', {
      name: "touch-action",
      plugin: TouchAction.getBoundPlugin(config),
      baseDir: function() {
        return __dirname;
      }
    });

  }

};

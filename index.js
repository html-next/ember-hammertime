/* eslint-env node */
'use strict';

const path = require('path');
const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');
const map = require('broccoli-stew').map;

module.exports = {
  name: 'ember-hammertime',

  included(app) {
    this._super.included.apply(this, arguments);

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    while (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    if (typeof app.import !== 'function') {
      throw new Error('Ember-Hammertime is being used within another addon or engine ' +
        'and is having trouble registering itself to the parent application.');
    }

    app.import('vendor/hammer-time.js');
  },

  treeForVendor(vendorTree) {
    let trees = [];
    let hammertimeTree = new Funnel(path.dirname(require.resolve('hammer-timejs/hammer-time.js')), {
      files: ['hammer-time.js']
    });
    hammertimeTree = map(hammertimeTree, (content) => `if (typeof FastBoot === 'undefined') { ${content} }`);

    if (vendorTree !== undefined) {
      trees.push(vendorTree);
    }

    trees.push(hammertimeTree);

    return new MergeTrees(trees);
  },

  isDevelopingAddon() {
    return false;
  },

  projectConfig() {
    return this.project.config(process.env.EMBER_ENV);
  },

  setupPreprocessorRegistry(type, registry) {
    let { TouchActionSupport, setConfigValues } = require('./htmlbars-plugins/touch-action');
    let config = this.projectConfig()['EmberHammertime'];
    setConfigValues(config);

    registry.add('htmlbars-ast-plugin', {
      name: 'touch-action',
      plugin: TouchActionSupport,
      baseDir() {
        return __dirname;
      }
    });
  }
};

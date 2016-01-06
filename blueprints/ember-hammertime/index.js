// jshint node:true

module.exports = {

  name: 'ember-hammertime',

  normalizeEntityName: function() {},

  afterInstall: function() {
    var bowerPackages = [
      { name: 'hammer-time', target: '1.0.0'}
    ];
    return this.addBowerPackagesToProject(bowerPackages);
  }

};

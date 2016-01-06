// jshint node:true

// For details on each option run `ember help release`
module.exports = {

  // if true, utilizes the Github API for comparing commits
  // which compares REMOTE branches and Tags
  // but also provides usernames for committers and authors
  // as well as github links within the changelog for PRs,
  // commits, and authors.
  useGithub: true,

  // angular style guide: https://github.com/angular/angular.js/blob/v1.4.8/CONTRIBUTING.md#commit
  // jquery style guide: https://contribute.jquery.org/commits-and-pull-requests/#commit-guidelines
  // ember style guide: https://github.com/emberjs/ember.js/blob/master/CONTRIBUTING.md#commit-tagging
  style: 'angular', // 'ember' 'jquery'

  head: 'master',
  base: '-last', // a branch or tag name, `-last` defaults to the version in package.json

  hooks: {
    /*
      parser: function(commit) { return commit; }
      filter: function(commit) { return true; },
      groupSort: function(commits) { return { commits: commits }; },
      format: function(commit) { return commit.title; },
     */
  }

};

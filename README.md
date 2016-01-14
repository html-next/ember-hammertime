# Ember-hammertime

[![npm version](https://badge.fury.io/js/ember-hammertime.svg)](http://badge.fury.io/js/ember-hammertime)
[![Ember Observer Score](http://emberobserver.com/badges/ember-hammertime.svg)](http://emberobserver.com/addons/ember-hammertime)
[![Build Status](https://travis-ci.org/runspired/ember-hammertime.svg)](https://travis-ci.org/runspired/ember-hammertime)

Ember-hammertime uses an AST Walker to add [touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action)
 styles to DOM Elements that need them to work with the [hammer-time](https://github.com/hammerjs/hammer-time)
 touch-action polyfill.  Hammer-time is a *better* fastclick through polyfill.

## Support, Questions, Collaboration

`ember-hammertime` is the little brother of [ember-gestures](https://github.com/runspired/ember-gestures).  For support, questions,
collaboration or discussion you should join the [addon-ember-gestures](https://embercommunity.slack.com/messages/addon-ember-gestures/) channel on Slack.

[![Slack Status](https://ember-community-slackin.herokuapp.com/badge.svg)](https://ember-community-slackin.herokuapp.com/)


### Status

[Changelog](./CHANGELOG.md)

[![dependencies](https://david-dm.org/runspired/ember-hammertime.svg)](https://david-dm.org/runspired/ember-hammertime)
[![devDependency Status](https://david-dm.org/runspired/ember-hammertime/dev-status.svg)](https://david-dm.org/runspired/ember-hammertime#info=devDependencies)


## Usage

`ember install ember-hammertime`

This will run the default blueprint which additionally installs `hammer-time`.

#### Using Touch-action as a fastclick

`ember-hammertime` uses [hammer-time](https://github.com/hammerjs/hammer-time) as a polyfill for `touch-action` CSS
to enable cross-platform `fastclick`.  This polyfill works based on the presence of `style="touch-action: <foo>;"`
being present on an element.

For most things, you'll want the following `style` attribute to be present on the component or element.

```html
<div style="touch-action: manipulation; -ms-touch-action: manipulation;">
```

The AST Walker automatically adds this style to elements when any of the following rules is matched.

- The element's tagName is `select`, `button`, `a`, or `textarea`.
- The element's tagName is `input` and the element's `type` is `button`, `submit`, `text`, or `file`. 
- The element has an action defined on it (e.g. `<div {{action "foo"}}>`)

All `link-components` (e.g. `{{link-to}}` as well as components with attributes matching the rules utilized
by the AST walker have a bound `style` attribute set to the above as well.

This is done via the touchAction Mixin available in `ember-hammertime/mixins/touch-action`.


## Contributing

 - Open an Issue for discussion first if you're unsure a feature/fix is wanted.
 - Branch off of `develop` (default branch)
 - Use descriptive branch names (e.g. `<type>/<short-description>`)
 - Use [Angular Style Commits](https://github.com/angular/angular.js/blob/v1.4.8/CONTRIBUTING.md#commit)
 - PR against `develop` (default branch).


### Commmits 

Angular Style commit messages have the full form:
 
 ```
 <type>(<scope>): <title>
 
 <body>
 
 <footer>
 ```
 
 But the abbreviated form (below) is acceptable and often preferred.
 
 ```
 <type>(<scope>): <title>
 ```
 
 Examples:
 
 - chore(deps): bump deps in package.json and bower.json
 - docs(component): document the `fast-action` component

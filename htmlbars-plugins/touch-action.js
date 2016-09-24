/* global module */
/**
 An HTMLBars AST transformation that makes all instances of

 ```handlebars
 <HTMLElement {{action "foo"}}>
 ```

 include

 ```handlebars
 <HTMLElement {{action "foo"}} style="touch-action: manipulation; -ms-touch-action: manipulation; cursor: pointer;">
 ```
 */

function TouchActionSupport(config) {
  var touchActionSelectors = ['button', 'input', 'a', 'textarea'];
  var touchActionProperties = 'touch-action: manipulation; -ms-touch-action: manipulation; cursor: pointer;';
  config = config || {};

  this.touchActionSelectors = config.touchActionSelectors || touchActionSelectors;
  this.touchActionProperties = config.touchActionProperties || touchActionProperties;
  this.syntax = null;
}

TouchActionSupport.prototype.transform = function TouchActionSupport_transform(ast) {
  var pluginContext = this;
  var walker = new pluginContext.syntax.Walker();

  walker.visit(ast, function(node) {
    if (pluginContext.validate(node)) {
      var style = elementAttribute(node, 'style');
      if (!style) {
        style = {
          type: 'AttrNode',
          name: 'style',
          value: { type: 'TextNode', chars: '' }
        };
        node.attributes.push(style);
      }
      style.value.chars += pluginContext.touchActionProperties;
    }
  });

  return ast;
};

TouchActionSupport.prototype.validate = function TouchActionSupport_validate(node) {
  var modifier;
  var onValue;
  var hasAction;
  var hasClick;
  var isFocusable;

  if (node.type === 'ElementNode') {
    modifier = elementModifierForPath(node, 'action');
    onValue = modifier ? hashPairForKey(modifier.hash, 'on') : false;

    hasAction = modifier && (!onValue || onValue === 'click');
    isFocusable = this.touchActionSelectors.indexOf(node.tag) !== -1;

    hasClick = elementAttribute(node, 'onclick');

    if (isFocusable) {
      if (node.tag === 'input') {
        var type = elementAttribute(node, 'type');
        isFocusable = ['button', 'submit', 'text', 'file'].indexOf(type) !== -1;
      }
    }

    return hasClick || hasAction || isFocusable;
  }

  return false;
};

function elementAttribute(node, path) {
  var attributes = node.attributes;
  for (var i = 0, l = attributes.length; i < l; i++) {
    if (attributes[i].name === path) {
      return attributes[i];
    }
  }
  return false;
}

function elementModifierForPath(node, path) {
  // 1.11+ uses node.modifiers, and 1.10 uses node.helpers
  var modifiers = node.modifiers || node.helpers;
  for (var i = 0, l = modifiers.length; i < l; i++) {
    var modifier = sexpr(modifiers[i]);

    if (modifier.path.original === path) {
      return modifier;
    }
  }

  return false;
}

function hashPairForKey(hash, key) {
  for (var i = 0, l = hash.pairs.length; i < l; i++) {
    var pair = hash.pairs[i];
    if (pair.key === key) {
      return pair;
    }
  }

  return false;
}

// For compatibility with pre- and post-glimmer
function sexpr(node) {
  if (node.sexpr) {
    return node.sexpr;
  } else {
    return node;
  }
}

module.exports = {
  TouchActionSupport,
  getBoundPlugin: function(config) {
    return TouchActionSupport.bind(TouchActionSupport, config);
  }
};

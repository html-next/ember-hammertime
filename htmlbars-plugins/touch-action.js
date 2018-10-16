/* eslint-disable camelcase */
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

// Set this to `false` to not apply the styles automatically to elements with an `action`
let touchActionOnAction = true;
// Remove 'onclick' if you do not want the styles automatically applied to elements with an `onclick`
let touchActionAttributes = ['onclick'];
// Remove whichever element types you do not want automatically getting styles applied to them
let touchActionSelectors = ['button', 'input', 'a', 'textarea'];
// The actual style string that is applied to the elements. You can tweak this if you want something different.
let touchActionProperties = 'touch-action: manipulation; -ms-touch-action: manipulation; cursor: pointer;';

function TouchActionSupport() {
  this.syntax = null;
}

TouchActionSupport.prototype.transform = function TouchActionSupport_transform(ast) {
  let pluginContext = this;
  let walker = new pluginContext.syntax.Walker();

  walker.visit(ast, function(node) {
    if (pluginContext.validate(node)) {
      let style = elementAttribute(node, 'style');
      if (!style) {
        style = {
          type: 'AttrNode',
          name: 'style',
          value: { type: 'TextNode', chars: '' }
        };
        node.attributes.push(style);
      }
      style.value.chars += touchActionProperties;
    }
  });

  return ast;
};

TouchActionSupport.prototype.validate = function TouchActionSupport_validate(node) {
  let isFocusable;

  if (node.type === 'ElementNode') {
    isFocusable = touchActionSelectors.indexOf(node.tag) !== -1;

    if (isFocusable) {
      if (node.tag === 'input') {
        let type = elementAttribute(node, 'type');
        isFocusable = ['button', 'submit', 'text', 'file'].indexOf(type) !== -1;
      }
    }

    return hasClick(node) || hasAction(node) || isFocusable;
  }

  return false;
};

/**
 * Get the element at the given path from the element
 * @param node The element
 * @param path The attribute to look for i.e. 'onclick'
 * @returns {*} The value of the attribute on the element
 */
function elementAttribute(node, path) {
  let { attributes } = node;
  for (let i = 0, l = attributes.length; i < l; i++) {
    if (attributes[i].name === path) {
      return attributes[i];
    }
  }
  return false;
}

function elementModifierForPath(node, path) {
  // 1.11+ uses node.modifiers, and 1.10 uses node.helpers
  let modifiers = node.modifiers || node.helpers;
  for (let i = 0, l = modifiers.length; i < l; i++) {
    let modifier = sexpr(modifiers[i]);

    if (modifier.path.original === path) {
      return modifier;
    }
  }

  return false;
}

/**
 * Checks if the element has an `action` and if we have touchActionOnAction enabled
 * @param node The element to check
 * @returns {*|boolean} Returns true if the element has an action
 */
function hasAction(node) {
  if (!touchActionOnAction) {
    return false;
  }

  let modifier = elementModifierForPath(node, 'action');
  let onValue = modifier ? hashPairForKey(modifier.hash, 'on') : false;

  return modifier && (!onValue || onValue === 'click');
}

/**
 * Check if the element has an `onclick` attribute and that we have configured `onclick` in touchActionAttributes
 * @param node The element to check for `onclick`
 * @returns {boolean|*} Returns `true` is `onclick` is enabled in the config and exists on the element
 */
function hasClick(node) {
  return touchActionAttributes.indexOf('onclick') !== -1 && elementAttribute(node, 'onclick');
}

function hashPairForKey(hash, key) {
  for (let i = 0, l = hash.pairs.length; i < l; i++) {
    let pair = hash.pairs[i];
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

function setConfigValues(config) {
  config = config || {};

  touchActionOnAction = config.touchActionOnAction || touchActionOnAction;
  touchActionAttributes = config.touchActionAttributes || touchActionAttributes;
  touchActionSelectors = config.touchActionSelectors || touchActionSelectors;
  touchActionProperties = config.touchActionProperties || touchActionProperties;
}

module.exports = { TouchActionSupport, setConfigValues };

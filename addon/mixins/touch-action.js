import { get, defineProperty, computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
import { isHTMLSafe, htmlSafe } from '@ember/string';

const FocusableInputTypes = ['button', 'submit', 'text', 'file'];
// Set this to `false` to not apply the styles automatically to elements with an `action`
const TouchActionOnAction = true;
// Remove 'onclick' if you do not want the styles automatically applied to elements with an `onclick`
const TouchActionAttributes = ['onclick'];
// Remove whichever element types you do not want automatically getting styles applied to them
const TouchActionSelectors = ['button', 'input', 'a', 'textarea'];
// The actual style string that is applied to the elements. You can tweak this if you want something different.
const TouchActionProperties = 'touch-action: manipulation; -ms-touch-action: manipulation; cursor: pointer;';

function touchActionStyle() {
  let style = get(this, 'touchActionProperties');
  let otherStyleKey = get(this, 'otherStyleKey');

  if (otherStyleKey) {
    let otherStyle = get(this, otherStyleKey);

    if (otherStyle) {
      if (isHTMLSafe(otherStyle)) {
        otherStyle = otherStyle.string;
      }
      style += otherStyle;
    }
  }

  return htmlSafe(style);
}

export default Mixin.create({
  touchActionOnAction: TouchActionOnAction,
  touchActionAttributes: TouchActionAttributes,
  touchActionSelectors: TouchActionSelectors,
  touchActionProperties: TouchActionProperties,
  ignoreTouchAction: false,

  init() {
    this._super();

    const {
      tagName,
      ignoreTouchAction,
      click
    } = this;

    const hasClick = click && click.apply;
    const hasTag = tagName !== '' || (tagName === null && hasClick);
    if (!hasTag) {
      return;
    }

    let maybeApplyStyle = ignoreTouchAction === false;
    let hasClickHandler = ignoreTouchAction === false && hasClick;
    let shouldApplyStyle = false;

    if (maybeApplyStyle) {
      let isFocusable = this.touchActionSelectors.indexOf(tagName) !== -1;

      if (isFocusable && tagName === 'input') {
        isFocusable = FocusableInputTypes.indexOf(this.type) !== -1;
      }

      shouldApplyStyle = isFocusable;
    }

    if (hasClickHandler || shouldApplyStyle) {
      let newAttributeBindings = [];
      const bindings = get(this, 'attributeBindings');

      // don't override other style bindings if present
      if (Array.isArray(bindings)) {
        bindings.forEach((binding) => {
          if (binding === 'style') {
            this.otherStyleKey = binding;
          } else {
            let end = binding.length - 6;

            if (end > 0 && ':style' === binding.substring(end)) {
              this.otherStyleKey = binding.substring(0, end);
            }
          }
        });
        newAttributeBindings = newAttributeBindings.concat(bindings);
      }

      newAttributeBindings.push('touchActionStyle:style');
      this.set('attributeBindings', newAttributeBindings);

      let desc = this.otherStyleKey ? computed(this.otherStyleKey, touchActionStyle) : computed(touchActionStyle);
      defineProperty(this, 'touchActionStyle', desc);
    }
  }
});

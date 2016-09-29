import Ember from "ember";

const {
  computed,
  defineProperty,
  K,
  get,
  Mixin,
  String: {htmlSafe, isHTMLSafe}
} = Ember;

const FocusableInputTypes = ['button', 'submit', 'text', 'file'];
const TouchActionSelectors = ['button', 'input', 'a', 'textarea'];
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

    const hasClick = click !== K;
    const hasTag = (typeof tagName === 'string' && tagName.length > 0) || (tagName === null && hasClick);
    if (!hasTag) { return; }

    let maybeApplyStyle = ignoreTouchAction === false && hasTag;
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
  },
});

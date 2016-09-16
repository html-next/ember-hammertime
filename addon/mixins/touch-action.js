import Ember from "ember";

const {
  computed,
  defineProperty,
  K,
  get,
  Mixin,
  set,
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

  init() {
    this._super(...arguments);

    const tagName = get(this, 'tagName');

    let applyStyle = tagName !== '' && this.click !== K;
    if (applyStyle) {
      let isFocusable = this.touchActionSelectors.indexOf(tagName) !== -1;
      if (isFocusable && tagName === 'input') {
        const type = get(this, 'type');
        isFocusable = FocusableInputTypes.indexOf(type) !== -1;
      }
      applyStyle = isFocusable;
    }

    if (applyStyle) {
      let newAttributeBindings = [];
      const bindings = get(this, 'attributeBindings');
      if (Array.isArray(bindings)) {
        bindings.forEach((binding) => {
          if (binding === 'style') {
            this.otherStyleKey = binding;
          } else {
            // endsWith is es6
            let end = binding.length - 6;
            if (end > 0 && ':style' === binding.substring(end)) {
              this.otherStyleKey = binding.substring(0, end);
            }
          }
        });
        newAttributeBindings = newAttributeBindings.concat(bindings);
      }
      newAttributeBindings.push('touchActionStyle:style');
      set(this, 'attributeBindings', newAttributeBindings);

      let desc = this.otherStyleKey ? computed(this.otherStyleKey, touchActionStyle) : computed(touchActionStyle);
      defineProperty(this, 'touchActionStyle', desc);
    }
  },
});

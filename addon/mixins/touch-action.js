import Ember from 'ember';

const {
  computed,
  K,
  get,
  Mixin,
  set,
  String: { htmlSafe }
} = Ember;

const SafeTouchAction = htmlSafe('touch-action: manipulation; -ms-touch-action: manipulation; cursor: pointer;');
const SafeEmptyString = htmlSafe('');
const FocusableInputTypes = ['button', 'submit', 'text', 'file'];
const TouchActionSelectors = ['button', 'input', 'a', 'textarea'];

export default Mixin.create({
  touchActionSelectors: TouchActionSelectors,
  touchActionProperties: SafeTouchAction,

  init() {
    this._super(...arguments);

    if (this.touchActionProperties !== SafeTouchAction) {
      this.touchActionProperties = htmlSafe(this.touchActionProperties);
    }

    if (this.tagName !== '' && this.click !== K) {
      let newAttributeBindings = [];
      const bindings = get(this, 'attributeBindings');

      if (Array.isArray(bindings)) {
        newAttributeBindings = newAttributeBindings.concat(bindings);
      }

      newAttributeBindings.push('touchActionStyle:style');
      set(this, 'attributeBindings', newAttributeBindings);
    }
  },

  touchActionStyle: computed(function() {
    const type = get(this, 'type');
    const tagName = get(this, 'tagName');

    // we apply if click is present and tagName is present
    let applyStyle = tagName !== '' && this.click !== K;

    if (applyStyle) {
      let isFocusable = this.touchActionSelectors.indexOf(tagName) !== -1;

      if (isFocusable && tagName === 'input') {
        isFocusable = FocusableInputTypes.indexOf(type) !== -1;
      }

      applyStyle = isFocusable;
    }

    return applyStyle ? this.touchActionProperties : SafeEmptyString;
  })
});

import Ember from 'ember';

const { computed, get, set, String: { htmlSafe } } = Ember;

const SafeTouchAction = htmlSafe('touch-action: manipulation; -ms-touch-action: manipulation; cursor: pointer;');
const SafeEmptyString = htmlSafe('');

export default Ember.Mixin.create({
  init() {
    this._super(...arguments);

    if (this.tagName || this.elementId) {
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
    const click = get(this, 'click');
    const tagName = get(this, 'tagName');
    
    // we apply if click is present and tagName is present
    let applyStyle = tagName && click;

    if (tagName && click) {
      let isFocusable = ['button', 'input', 'a', 'textarea'].indexOf(tagName) !== -1;

      if (isFocusable && tagName === 'input') {
        isFocusable = ['button', 'submit', 'text', 'file'].indexOf(type) !== -1;
      }

      applyStyle = isFocusable;
    }

    return applyStyle ? SafeTouchAction : SafeEmptyString;
  })
});

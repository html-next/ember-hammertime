import Ember from 'ember';

const {
  computed,
  Mixin,
  get,
  set,
  String: { htmlSafe }
} = Ember;

export default Mixin.create({
  init() {
    this._super(...arguments);
    
    if (this.tagName || this.elementId) {
      let newAttributeBindings = [];
      let bindings = get(this, 'attributeBindings');

      if (Array.isArray(bindings)) {
        newAttributeBindings = newAttributeBindings.concat(bindings);
      }

      newAttributeBindings.push('touchActionStyle:style');
      set(this, 'attributeBindings', newAttributeBindings);
    }
  },

  touchActionStyle: computed(function() {
    // we apply if click is present and tagName is present
    let applyStyle = this.applyStyle && this.click;

    if (!applyStyle) {
      // we apply if tagName
      const tagName = this.get('tagName');
      const type = this.get('type');

      let isFocusable = ['button', 'input', 'a', 'textarea'].indexOf(tagName) !== -1;

      if (isFocusable) {
        if (tagName === 'input') {
          isFocusable = ['button', 'submit', 'text', 'file'].indexOf(type) !== -1;
        }
      }

      applyStyle = isFocusable;
    }

    return htmlSafe(applyStyle ? 'touch-action: manipulation; -ms-touch-action: manipulation; cursor: pointer;' : '');
  })
});

import Ember from 'ember';

const {
  computed,
  Mixin,
  String: { htmlSafe }
} = Ember;

export default Mixin.create({
  init() {
    this._super(...arguments);
    if (this.tagName) {
      this.attributeBindings = ['touchActionStyle:style'];
      this.applyStyle = true;
    } else {
      this.applyStyle = false;
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

import Ember from 'ember';
import TouchActionMixin from '../mixins/touch-action';

let LinkComponent = Ember.LinkComponent;

export default LinkComponent.reopen(TouchActionMixin);

import Ember from 'ember';
import TouchActionMixin from '../mixins/touch-action';

let LinkComponent = Ember.LinkComponent || Ember.LinkView;

export default LinkComponent.reopen(TouchActionMixin);

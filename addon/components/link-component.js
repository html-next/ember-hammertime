import LinkComponent from '@ember/routing/link-component';
import TouchActionMixin from '../mixins/touch-action';

export default LinkComponent.reopen(TouchActionMixin);

import { selectInShadow } from '@/publisher/utils';
import { selectComponent } from './shared';

export function initializeMethodsForNavigation(publisher) {
  publisher.provide('selectComponent', (selector) => {
    const element = selectInShadow(selector);
    selectComponent(publisher, element);
  });
}

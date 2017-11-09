import { isCustomElement, getShadowSelector, selectInShadow } from '@/publisher/utils';

export function initializeMethodsForNode(publisher) {
  publisher.provide('getNodeInfo', (selector, callback) => {
    const node = selectInShadow(selector);
    callback({
      name: node.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? '#shadow-root' : node.nodeName.toLowerCase(),
      isComponent: isCustomElement(node),
      selector: getShadowSelector(node),
    });
  });
}

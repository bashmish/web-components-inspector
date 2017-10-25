import { isCustomElement } from '@/publisher/utils';

export const serializer = {

  getComposedDOMString(element) {
    if (Array.isArray(element)) {
      return element.map(el => this.getElementString(el)).join();
    }
    return this.getElementString(element);
  },

  getElementString(element) {
    const elementOrShadowRoot = element.shadowRoot ? element.shadowRoot : element;

    // optimization
    if (elementOrShadowRoot.tagName === 'svg') {
      // we don't need svg dom for now
      return this.convertElementToString(element);
    } else if (elementOrShadowRoot.children.length === 0) {
      // we don't need style content for now
      if (elementOrShadowRoot.tagName === 'STYLE') {
        return this.convertElementToString(element);
      }
      return this.convertElementToString(element, element.innerHTML);
    }

    const strings = [];

    for (let i = 0; i < elementOrShadowRoot.childNodes.length; i += 1) {
      const node = elementOrShadowRoot.childNodes[i];
      strings.push(this.getNodeString(node));
    }

    return this.convertElementToString(element, strings.join(''));
  },

  getNodeString(node) {
    if (node.nodeName === 'SLOT') {
      const slotNodes = node.assignedNodes({ flatten: true });
      return slotNodes.map(n => this.getNodeString(n)).join('');
    } else if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    } else if (node.nodeType === Node.COMMENT_NODE) {
      return `<!--${node.textContent}-->`;
    } else if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      // TODO: check if it can pop up here
      return '';
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (isCustomElement(node)) {
        // we don't need custom element internals, because it will become a link to internal view
        return this.convertElementToString(node);
      }
      return this.getElementString(node);
    }
    return '';
  },

  convertElementToString(element, innerString = '') {
    const attrs = [];
    for (let i = 0; i < element.attributes.length; i += 1) {
      const attr = element.attributes[i];
      attrs.push(`${attr.name}="${attr.value}"`);
    }
    return `<${element.tagName.toLowerCase()} ${attrs.join(' ')}>${innerString}</${element.tagName.toLowerCase()}>`;
  },

};

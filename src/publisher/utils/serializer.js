import { isCustomElement, getClosestParentCustomElement } from './custom-element';
import { getShadowSelector } from './shadow-dom';

const VOID_ELEMENTS = 'area base br col embed hr img input keygen link meta param source track wbr'.split(' ');

export function serializeElement(element) {
  const elementOrShadowRoot = element.shadowRoot ? element.shadowRoot : element;

  if (elementOrShadowRoot.tagName === 'svg') {
    // we don't need svg dom for now
    return createElementNode(element);
  }

  const children = [];

  for (let i = 0; i < elementOrShadowRoot.childNodes.length; i += 1) {
    const node = elementOrShadowRoot.childNodes[i];

    if (node.nodeName === 'CONTENT') {
      const contentNodes = node.getDistributedNodes();
      contentNodes.forEach((contentNode) => {
        children.push(serializeNode(contentNode));
      });
    } else if (node.nodeName === 'SLOT') {
      const slotNodes = node.assignedNodes({ flatten: true });
      slotNodes.forEach((slotNode) => {
        children.push(serializeNode(slotNode));
      });
    } else {
      children.push(serializeNode(node));
    }
  }

  return createElementNode(element, children);
}

function serializeNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return createTextNode(node.textContent);
  } else if (node.nodeType === Node.COMMENT_NODE) {
    return createCommentNode(node.textContent);
  } else if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    // TODO: check if it can pop up here
    return createTextNode('');
  }

  // else (node.nodeType === Node.ELEMENT_NODE)
  if (isCustomElement(node)) {
    // we don't need custom element internals, because it will become a link to internal view
    return createElementNode(node);
  }
  return serializeElement(node, false);
}

function createElementNode(element, children = []) {
  const name = element.tagName.toLowerCase();
  const attributes = [];
  for (let i = 0; i < element.attributes.length; i += 1) {
    const attribute = element.attributes[i];
    attributes.push({
      name: attribute.name,
      value: attribute.value,
    });
  }
  const parentCustomElement = getClosestParentCustomElement(element);
  return {
    type: 'element',
    name,
    isComponent: isCustomElement(element),
    isVoid: VOID_ELEMENTS.includes(name),
    selector: getShadowSelector(element),
    parentComponentSelector: parentCustomElement ? getShadowSelector(parentCustomElement) : null,
    attributes,
    children,
  };
}

function createTextNode(value) {
  return {
    type: 'text',
    value,
  };
}

function createCommentNode(value) {
  return {
    type: 'comment',
    value,
  };
}

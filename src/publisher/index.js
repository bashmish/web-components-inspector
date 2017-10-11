/* global rempl */
/* eslint no-use-before-define: 0 */

const publisher = rempl.createPublisher('Web Components',
  (settings, callback) => callback(null, 'url', 'http://localhost:8080'));

publisher.provide('startInspecting', () => {
  document.addEventListener('mousemove', onMousemove);
  document.addEventListener('click', onClick);
});

publisher.provide('stopInspecting', () => {
  document.removeEventListener('mousemove', onMousemove);
  document.removeEventListener('click', onClick);
});

function getComposedDOMString(element) {
  if (Array.isArray(element)) {
    return element.map(el => getElementString(el)).join();
  }
  return getElementString(element);
}

function getElementString(element) {
  const elementOrShadowRoot = element.shadowRoot ? element.shadowRoot : element;

  // optimization
  if (elementOrShadowRoot.tagName === 'svg') {
    // we don't need svg dom for now
    return convertElementToString(element);
  } else if (elementOrShadowRoot.children.length === 0) {
    // we don't need style content for now
    if (elementOrShadowRoot.tagName === 'STYLE') {
      return convertElementToString(element);
    }
    return convertElementToString(element, element.innerHTML);
  }

  const strings = [];

  for (let i = 0; i < elementOrShadowRoot.childNodes.length; i += 1) {
    const node = elementOrShadowRoot.childNodes[i];
    strings.push(getNodeString(node));
  }

  return convertElementToString(element, strings.join(''));
}

function getNodeString(node) {
  if (node.nodeName === 'SLOT') {
    const slotNodes = node.assignedNodes({ flatten: true });
    return slotNodes.map(n => getNodeString(n)).join('');
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
      return convertElementToString(node);
    }
    return getElementString(node);
  }
  return '';
}

function convertElementToString(element, innerString = '') {
  const attrs = [];
  for (let i = 0; i < element.attributes.length; i += 1) {
    const attr = element.attributes[i];
    attrs.push(`${attr.name}="${attr.value}"`);
  }
  return `<${element.tagName.toLowerCase()} ${attrs.join(' ')}>${innerString}</${element.tagName.toLowerCase()}>`;
}

let prevComponentName = '';
function onMousemove(event) {
  const element = getCustomElementFromEvent(event);
  const componentName = element ? element.tagName : '';
  if (componentName !== prevComponentName) {
    publisher.callRemote('lookAtElement', componentName);
    prevComponentName = componentName;
  }
}

function onClick(event) {
  const element = getCustomElementFromEvent(event);
  if (element) {
    const domString = getComposedDOMString(element);
    publisher.callRemote('inspectElement', element.tagName, domString);
  }
  return false;
}

function getCustomElementFromEvent(event) {
  const elementUnderMouse = getElementFromEventMousePosition(event);
  return getFirstCustomElementInChain(elementUnderMouse);
}

function getElementFromEventMousePosition(event) {
  return getDeepestElementFromPoint(document, event.clientX, event.clientY);
}

function getDeepestElementFromPoint(documentOrShadowRoot, clientX, clientY) {
  // if this feature is not supported by the browser
  if (!documentOrShadowRoot.elementFromPoint) {
    return null;
  }

  const element = documentOrShadowRoot.elementFromPoint(clientX, clientY);
  if (element && element.shadowRoot) {
    return getDeepestElementFromPoint(element.shadowRoot, clientX, clientY) || element;
  }
  return element;
}

function getFirstCustomElementInChain(element) {
  if (isCustomElement(element)) {
    return element;
  } else if (element.getRootNode && element.getRootNode().host) {
    return getFirstCustomElementInChain(element.getRootNode().host);
  }
  return null;
}

function isCustomElement(element) {
  return element instanceof HTMLElement && !!window.customElements.get(element.constructor.is);
}

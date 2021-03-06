import { isPolymerComponent, getPolymerFilePath } from '@/publisher/frameworks/polymer';

export function isCustomElement(element) {
  // TODO: rename to isRegisteredCustomElement
  // so far the most generic check I found for both v0 and v1 specs
  return element instanceof HTMLElement && // indeed an element
    element.nodeName.indexOf('-') !== -1 && // name contains a dash
    element.constructor !== HTMLElement; // not just a dummy unregistered/undefined element
}

export function getDeepestElementAtPoint(clientX, clientY, shadowRoot = document) {
  // if this feature is not supported by the browser
  if (!shadowRoot.elementFromPoint) {
    return null;
  }

  const element = shadowRoot.elementFromPoint(clientX, clientY);
  if (element && element.shadowRoot) {
    return getDeepestElementAtPoint(clientX, clientY, element.shadowRoot) || element;
  }
  return element;
}

export function getClosestParentCustomElement(element, selfCheck = false) {
  if (selfCheck && isCustomElement(element)) {
    return element;
  } else if (element.parentElement) {
    return getClosestParentCustomElement(element.parentElement, true);
  } else if (element.getRootNode && element.getRootNode().host) {
    return getClosestParentCustomElement(element.getRootNode().host, true);
  }
  return null;
}

export function getComponentFilePath(element) {
  if (isPolymerComponent(element)) {
    return getPolymerFilePath(element);
  }
  return null;
}

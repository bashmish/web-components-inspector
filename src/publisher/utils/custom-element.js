export function isCustomElement(element) {
  return element instanceof HTMLElement && !!window.customElements.get(element.constructor.is);
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

export function getClosestParentCustomElement(element) {
  if (isCustomElement(element)) {
    return element;
  } else if (element.parentElement) {
    return getClosestParentCustomElement(element.parentElement);
  } else if (element.getRootNode && element.getRootNode().host) {
    return getClosestParentCustomElement(element.getRootNode().host);
  }
  return null;
}

export function getComponentFilePath(element) {
  if (isPolymerComponent(element)) {
    return getPolymerFilePath(element);
  }
  return null;
}

function isPolymerComponent(element) {
  const chain = getConstructorPrototypeChainTillHTMLElement(element);
  const names = chain.map(prototype => prototype.name);
  return names.includes('PolymerElement');
}

function getPolymerFilePath(element) {
  const dir = element.importPath.replace(window.location.origin, '');
  const filename = `${element.tagName.toLowerCase()}.html`;
  return `${dir}${filename}`;
}

function getConstructorPrototypeChainTillHTMLElement(element) {
  const chain = [];
  let prototype = Object.getPrototypeOf(element.constructor);
  while (prototype) {
    if (prototype === HTMLElement) {
      prototype = null;
    } else {
      chain.push(prototype);
      prototype = Object.getPrototypeOf(prototype);
    }
  }
  return chain;
}

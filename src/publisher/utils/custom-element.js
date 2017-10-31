export function isCustomElement(element) {
  return element instanceof HTMLElement && !!window.customElements.get(element.constructor.is);
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

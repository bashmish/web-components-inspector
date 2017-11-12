export function isPolymerComponent(element) {
  return isPolymer1Component(element) || isPolymer2Component(element);
}

export function getPolymerFilePath(element) {
  if (element.importPath) {
    const dir = element.importPath.replace(window.location.origin, '');
    const filename = `${element.tagName.toLowerCase()}.html`;
    return `${dir}${filename}`;
  }
  return null;
}

function isPolymer1Component(element) {
  // eslint-disable-next-line no-underscore-dangle
  return element.__isPolymerInstance__;
}

function isPolymer2Component(element) {
  if (!window.Polymer || typeof window.Polymer.Element !== 'function') return false;
  return element instanceof window.Polymer.Element;
}

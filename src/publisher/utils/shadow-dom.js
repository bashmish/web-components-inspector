export function getShadowSelector(element, path = []) {
  if (element.parentElement) {
    const parent = element.parentElement;
    const childNumber = Array.from(parent.children).indexOf(element);
    getShadowSelector(parent, path);
    path.push(childNumber);
  } else if (element.parentNode) {
    const parent = element.parentNode;
    const childNumber = Array.from(parent.children).indexOf(element);
    if (parent.nodeType === Node.DOCUMENT_NODE) {
      path.push(childNumber);
      return path;
    }
    const host = parent.host;
    getShadowSelector(host, path);
    path.push('#');
    path.push(childNumber);
  }
  return path;
}

export function selectInShadow(path) {
  return path.reduce((element, k) => {
    if (k === '#') {
      return element.shadowRoot;
    }
    return element.children[k];
  }, document);
}

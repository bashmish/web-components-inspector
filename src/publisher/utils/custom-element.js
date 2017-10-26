export function isCustomElement(element) {
  return element instanceof HTMLElement && !!window.customElements.get(element.constructor.is);
}

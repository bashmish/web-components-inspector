import { getDeepestElementAtPoint, getClosestParentCustomElement } from './custom-element';

export function getDeepestCustomElementUnderMousePointer(event) {
  const elementUnderMouse = getDeepestElementAtPoint(event.clientX, event.clientY);
  return getClosestParentCustomElement(elementUnderMouse, true);
}

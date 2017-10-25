import { serializer } from '@/publisher/serializer';
import { isCustomElement } from '@/publisher/utils';

export function initializeMethodsForMouseSelector(publisher) {
  publisher.provide('startInspecting', () => {
    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('click', onClick);
  });

  publisher.provide('stopInspecting', () => {
    document.removeEventListener('mousemove', onMousemove);
    document.removeEventListener('click', onClick);
  });

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
      const domString = serializer.getComposedDOMString(element);
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
}

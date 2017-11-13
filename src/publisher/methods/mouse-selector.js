import { highlightElement } from '@/publisher/ui';
import { getDeepestCustomElementUnderMousePointer } from '@/publisher/utils';
import { selectComponent } from './shared';

export function initializeMethodsForMouseSelector(publisher) {
  let highlighter;
  let prevCustomElement;

  publisher.provide('startInspecting', () => {
    document.addEventListener('mousemove', onMousemove);
  });

  publisher.provide('stopInspecting', () => {
    document.removeEventListener('mousemove', onMousemove);
    if (highlighter) {
      highlighter.remove();
      highlighter = null;
    }
    prevCustomElement = null;
  });

  function onMousemove(event) {
    const customElement = getCustomElementFromEvent(event);

    if (customElement && customElement !== prevCustomElement) {
      const name = customElement.tagName.toLowerCase();
      publisher.callRemote('hoverComponent', name);

      if (highlighter) { highlighter.remove(); }
      highlighter = highlightElement(customElement, onClick);

      prevCustomElement = customElement;
    }
  }

  function onClick(event) {
    const customElement = getCustomElementFromEvent(event);
    if (customElement) {
      selectComponent(publisher, customElement);
    }
  }

  function getCustomElementFromEvent(event) {
    if (highlighter) {
      highlighter.deactivatePointerEvents();
    }
    const customElement = getDeepestCustomElementUnderMousePointer(event);
    if (highlighter) {
      highlighter.reactivatePointerEvents();
    }
    return customElement;
  }
}

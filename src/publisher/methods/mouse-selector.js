import { highlightElement } from '@/publisher/ui';
import { getDeepestCustomElementUnderMousePointer, listenToClickDisablingOthers } from '@/publisher/utils';
import { selectComponent } from './shared';

export function initializeMethodsForMouseSelector(publisher) {
  let undoListenToClickDisablingOthers;
  let removeHighlighter;

  publisher.provide('startInspecting', () => {
    document.addEventListener('mousemove', onMousemove);
  });

  publisher.provide('stopInspecting', () => {
    document.removeEventListener('mousemove', onMousemove);
    if (undoListenToClickDisablingOthers) {
      undoListenToClickDisablingOthers();
    }
    if (removeHighlighter) {
      removeHighlighter();
    }
  });

  let prevCustomElement;
  function onMousemove(event) {
    const customElement = getDeepestCustomElementUnderMousePointer(event);

    if (customElement && customElement !== prevCustomElement) {
      const name = customElement.tagName.toLowerCase();
      publisher.callRemote('hoverComponent', name);

      if (undoListenToClickDisablingOthers) { undoListenToClickDisablingOthers(); }
      undoListenToClickDisablingOthers = listenToClickDisablingOthers(event.target, onClick);

      if (removeHighlighter) { removeHighlighter(); }
      removeHighlighter = highlightElement(customElement);

      prevCustomElement = customElement;
    }
  }

  function onClick(event) {
    const element = getDeepestCustomElementUnderMousePointer(event);
    if (element) {
      selectComponent(publisher, element);
    }
  }
}

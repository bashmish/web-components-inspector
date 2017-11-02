import { serializer } from '@/publisher/serializer';
import { highlightElement } from '@/publisher/ui';
import { getDeepestCustomElementUnderMousePointer, listenToClickDisablingOthers,
  getOpenInEditorLink } from '@/publisher/utils';

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
      removeHighlighter();
    }
  });

  let prevName = '';
  function onMousemove(event) {
    const customElement = getDeepestCustomElementUnderMousePointer(event);
    const name = customElement ? customElement.tagName.toLowerCase() : '';

    if (customElement) {
      removeHighlighter = highlightElement(customElement);
    }

    if (name !== prevName) {
      publisher.callRemote('hoverComponent', name);
      prevName = name;

      if (undoListenToClickDisablingOthers) {
        undoListenToClickDisablingOthers();
      }
      undoListenToClickDisablingOthers = listenToClickDisablingOthers(event.target, onClick);
    }
  }

  function onClick(event) {
    const customElement = getDeepestCustomElementUnderMousePointer(event);
    if (customElement) {
      const name = customElement.tagName.toLowerCase();
      const composedDOMString = serializer.getComposedDOMString(customElement);
      const openInEditorLink = getOpenInEditorLink(customElement);
      publisher.callRemote('selectComponent', name, composedDOMString, openInEditorLink);
    }
  }
}

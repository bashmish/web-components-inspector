import { getOpenInEditorLink, serializeElement } from '@/publisher/utils';

export function selectComponent(publisher, element) {
  const name = element.tagName.toLowerCase();
  const composedDOM = serializeElement(element);
  const openInEditorLink = getOpenInEditorLink(element);
  publisher.callRemote('selectComponent', name, composedDOM, openInEditorLink);
}

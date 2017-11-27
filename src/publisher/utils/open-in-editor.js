import { getComponentFilePath } from './custom-element';

const DEFAULT_OPEN_IN_EDITOR_PATH = 'http://127.0.0.1:9247/open-in-editor/?file=';

export function getOpenInEditorLink(element) {
  const openInEditorPath = getOpenInEditorPath();
  const componentPath = getComponentFilePath(element);
  if (componentPath) {
    return `${openInEditorPath}${componentPath}`;
  }
  return null;
}

function getOpenInEditorPath() {
  const meta = document.querySelector('meta[name="wci:open-in-editor"]');
  return meta ? meta.content : DEFAULT_OPEN_IN_EDITOR_PATH;
}

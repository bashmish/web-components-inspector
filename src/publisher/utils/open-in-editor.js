import { getComponentFilePath } from './custom-element';

const DEFAULT_OPEN_IN_EDITOR_PATH = 'http://127.0.0.1:9246/?file=';

export function getOpenInEditorLink(element) {
  const openInEditorPath = getOpenInEditorPath();
  const componentPath = getComponentFilePath(element);
  const openLink = `${openInEditorPath}${componentPath}`;
  return openLink;
}

function getOpenInEditorPath() {
  const meta = document.querySelector('meta[name="wci:open-in-editor"]');
  return meta ? meta.content : DEFAULT_OPEN_IN_EDITOR_PATH;
}

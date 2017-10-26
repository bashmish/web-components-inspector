const HIGHLIGHTER_CLASS = 'web-component-inspector__highlighter';

export function highlightElement(element) {
  const rect = element.getBoundingClientRect();
  wipePrevious();
  const div = drawDiv(rect);
  return () => {
    div.remove();
  };
}

function drawDiv(rect) {
  const div = document.createElement('div');
  div.classList.add(HIGHLIGHTER_CLASS);
  div.style.position = 'absolute';
  div.style.zIndex = Number.MAX_SAFE_INTEGER;
  div.style.top = `${rect.top + window.scrollY}px`;
  div.style.left = `${rect.left + window.scrollX}px`;
  div.style.width = `${rect.width}px`;
  div.style.height = `${rect.height}px`;
  div.style.outline = '1px solid red';
  div.style.pointerEvents = 'none';
  document.body.appendChild(div);
  return div;
}

function wipePrevious() {
  const element = document.getElementsByClassName(HIGHLIGHTER_CLASS)[0];
  if (element) { element.remove(); }
}

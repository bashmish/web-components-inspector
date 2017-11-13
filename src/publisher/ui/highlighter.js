import Popper from 'popper.js';

const overlayBgColor = 'rgba(0, 0, 0, 0.1)';
const tooltipBgColor = '#252525';

let highlighter = null;

export function highlightElement(element, onClick) {
  const rect = element.getBoundingClientRect();
  if (highlighter) {
    highlighter.remove();
  }
  highlighter = createHighlighter(rect, element.tagName.toLowerCase(), onClick);
  return highlighter;
}

function createHighlighter(rect, name, onClick) {
  const overlay = createOverlay(rect);
  document.body.appendChild(overlay);
  overlay.addEventListener('click', onClick);

  const tooltip = createTooltip();
  const arrow = createArrow();
  const nameBlock = createNameBlock(name);
  tooltip.appendChild(arrow);
  tooltip.appendChild(nameBlock);
  document.body.appendChild(tooltip);

  const popper = createPopper(overlay, tooltip, arrow);

  return {
    deactivatePointerEvents() {
      overlay.style.pointerEvents = 'none';
    },
    reactivatePointerEvents() {
      overlay.style.pointerEvents = 'auto';
    },
    remove() {
      popper.destroy();
      overlay.remove();
      tooltip.remove();
      highlighter = null;
    },
  };
}

function createOverlay(rect) {
  const div = document.createElement('div');
  resetStyle(div);
  div.style.position = 'absolute';
  div.style.zIndex = Number.MAX_SAFE_INTEGER;
  div.style.top = `${rect.top + window.scrollY}px`;
  div.style.left = `${rect.left + window.scrollX}px`;
  div.style.width = `${rect.width}px`;
  div.style.height = `${rect.height}px`;
  div.style.backgroundColor = overlayBgColor;
  return div;
}

function createTooltip() {
  const div = document.createElement('div');
  resetStyle(div);
  div.style.position = 'relative';
  div.style.zIndex = Number.MAX_SAFE_INTEGER;
  return div;
}

function createArrow() {
  const div = document.createElement('div');
  resetStyle(div);
  div.style.position = 'absolute';
  div.style.width = 0;
  div.style.height = 0;
  return div;
}

function createNameBlock(name) {
  const div = document.createElement('div');
  resetStyle(div);
  div.innerText = `<${name}>`;
  div.style.backgroundColor = tooltipBgColor;
  div.style.borderRadius = '2px';
  div.style.padding = '5px';
  div.style.fontFamily = 'monospace';
  div.style.fontSize = '12px';
  div.style.color = 'white';
  return div;
}

function createPopper(overlay, tooltip, arrow) {
  return new Popper(overlay, tooltip, {
    placement: 'top',
    modifiers: {
      offset: {
        offset: '0, 10',
      },
      preventOverflow: {
        padding: 20,
      },
      flip: {
        behavior: ['top', 'left', 'bottom', 'right'],
        padding: 20,
      },
      arrow: {
        element: arrow,
      },
    },
    onCreate: placeArrow,
    onUpdate: placeArrow,
  });
}

function placeArrow(data) {
  const arrowStyle = data.arrowElement.style;
  if (data.placement === 'top') {
    arrowStyle.bottom = '-4px';
    arrowStyle.top = null;
    arrowStyle.right = null;
    arrowStyle.borderTop = `4px solid ${tooltipBgColor}`;
    arrowStyle.borderLeft = '4px solid transparent';
    arrowStyle.borderRight = '4px solid transparent';
    arrowStyle.borderBottom = null;
  } else if (data.placement === 'right') {
    arrowStyle.left = '-4px';
    arrowStyle.right = null;
    arrowStyle.bottom = null;
    arrowStyle.borderRight = `4px solid ${tooltipBgColor}`;
    arrowStyle.borderTop = '4px solid transparent';
    arrowStyle.borderBottom = '4px solid transparent';
    arrowStyle.borderLeft = null;
  } else if (data.placement === 'bottom') {
    arrowStyle.top = '-4px';
    arrowStyle.right = null;
    arrowStyle.bottom = null;
    arrowStyle.borderBottom = `4px solid ${tooltipBgColor}`;
    arrowStyle.borderLeft = '4px solid transparent';
    arrowStyle.borderRight = '4px solid transparent';
    arrowStyle.borderTop = null;
  } else if (data.placement === 'left') {
    arrowStyle.right = '-4px';
    arrowStyle.bottom = null;
    arrowStyle.left = null;
    arrowStyle.borderLeft = `4px solid ${tooltipBgColor}`;
    arrowStyle.borderTop = '4px solid transparent';
    arrowStyle.borderBottom = '4px solid transparent';
    arrowStyle.borderRight = null;
  }
  arrowStyle.margin = 0; // workaround for popper misusing this property
}

// kinda prevents style leak from page styles
function resetStyle(element) {
  const style = element.style;
  style.background = 'transparent';
  style.fontSize = '1px';
  style.lineHeight = 1;
  style.padding = 0;
  style.border = 0;
  style.margin = 0;
  style.outline = 0;
  style.verticalAlign = 'baseline';
}

export function listenToClickDisablingOthers(element, onClick) {
  const realOnClick = (event) => {
    onClick(event);
    blockOtherEventListeners(event);
  };

  element.addEventListener('touchstart', blockOtherEventListeners);
  element.addEventListener('mousedown', blockOtherEventListeners);
  element.addEventListener('click', realOnClick);

  return () => {
    element.removeEventListener('touchstart', blockOtherEventListeners);
    element.removeEventListener('mousedown', blockOtherEventListeners);
    element.removeEventListener('click', realOnClick);
  };
}

function blockOtherEventListeners(event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
}

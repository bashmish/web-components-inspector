import rempl from 'rempl/dist/rempl';

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.name === 'wci:inpage-host') {
        rempl.getHost().activate();
      }
    });
    mutation.removedNodes.forEach((node) => {
      if (node.name === 'wci:inpage-host') {
        rempl.getHost().deactivate();
      }
    });
  });
});

observer.observe(document.head, { childList: true });

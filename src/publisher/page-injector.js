/* global chrome */
// based on https://stackoverflow.com/a/9517879

function loadScript(path, cb) {
  const script = document.createElement('script');
  script.src = chrome.extension.getURL(path);
  script.onload = () => {
    script.remove();
    if (cb) { cb(); }
  };
  (document.head || document.documentElement).appendChild(script);
}

loadScript('node_modules/rempl/dist/rempl.js', () => loadScript('src/publisher/index.js'));

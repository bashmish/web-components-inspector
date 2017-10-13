/* global chrome */

[
  'node_modules/rempl/dist/rempl.js',
  'src/publisher/index.js',
].forEach((path) => {
  const script = document.createElement('script');
  script.src = chrome.extension.getURL(path);
  script.async = false;
  script.onload = () => {
    script.remove();
  };
  (document.head || document.documentElement).appendChild(script);
});

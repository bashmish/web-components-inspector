/* REMPL_SUBSCRIBER_URL placeholder */

const publisherScript = document.createElement('script');
publisherScript.src = 'http://127.0.0.1:8080/publisher.js';
publisherScript.async = false;
publisherScript.onload = () => {
  publisherScript.remove();
};
(document.head || document.documentElement).appendChild(publisherScript);

/* REMPL_SUBSCRIBER_URL placeholder */

const publisherScript = document.createElement('script');
publisherScript.src = 'http://localhost:8080/publisher.js';
publisherScript.async = false;
publisherScript.onload = () => {
  publisherScript.remove();
};
(document.head || document.documentElement).appendChild(publisherScript);

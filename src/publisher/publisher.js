import rempl from 'rempl/dist/rempl';
import { initializeMethodsForMouseSelector } from '@/publisher/methods/mouse-selector';
import { initializeMethodsForNavigation } from '@/publisher/methods/navigation';
import { initializeMethodsForNode } from '@/publisher/methods/node';

const publisherName = 'Web Components';

const publisher = process.env.NODE_ENV === 'production' ?
  rempl.createPublisher(publisherName, rempl.scriptFromFile(window.REMPL_SUBSCRIBER_URL)) :
  rempl.createPublisher(publisherName, (settings, callback) =>
    callback(null, 'url', 'http://127.0.0.1:8080/?preventInfiniteLoop=true'));

initializeMethodsForMouseSelector(publisher);
initializeMethodsForNavigation(publisher);
initializeMethodsForNode(publisher);

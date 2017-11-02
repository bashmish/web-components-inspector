import rempl from 'rempl/dist/rempl';
import { initializeMethodsForMouseSelector } from '@/publisher/methods/mouse-selector';

const publisherName = 'Web Components';

const publisher = process.env.NODE_ENV === 'production' ?
  rempl.createPublisher(publisherName, rempl.scriptFromFile(window.REMPL_SUBSCRIBER_URL)) :
  rempl.createPublisher(publisherName, (settings, callback) =>
    callback(null, 'url', 'http://localhost:8080/?preventInfiniteLoop=true'));

initializeMethodsForMouseSelector(publisher);

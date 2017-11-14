/* eslint global-require: 0 */

if (window.location.href.indexOf('preventInfiniteLoop=true') === -1) {
  require('./publisher.js');
  require('./meta-tags-api/index.js');
}

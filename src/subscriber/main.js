// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

import App from './App';

Vue.config.productionTip = false;

const style = document.createElement('style');
style.textContent = `
body {
  margin: 0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
`;
document.head.appendChild(style);

const appPlaceholder = document.createElement('div');
document.body.appendChild(appPlaceholder);

/* eslint-disable no-new */
new Vue({
  el: appPlaceholder,
  template: '<App/>',
  components: { App },
});

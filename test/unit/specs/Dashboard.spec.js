import Vue from 'vue';
import Dashboard from '@/components/Dashboard';

describe('Dashboard.vue', () => {
  it('should render', () => {
    const Constructor = Vue.extend(Dashboard);
    const vm = new Constructor().$mount();
    expect(vm.$el.getAttribute('id')).to.be.equal('dashboard');
  });
});

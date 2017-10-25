<template>
  <div id="app">
    <Dashboard v-if="connected" :api="api"/>
  </div>
</template>

<script>
import rempl from 'rempl/dist/rempl';

import Dashboard from '@/subscriber/components/Dashboard';

export default {
  name: 'app',

  data() {
    return {
      connected: false,
    };
  },

  components: {
    Dashboard,
  },

  created() {
    this.api = rempl.getSubscriber();

    this.api.connected.link((connected) => {
      this.connected = connected;
    });
  },
};
</script>

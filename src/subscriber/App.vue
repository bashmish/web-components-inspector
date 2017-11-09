<template>
  <div id="app">
    <dashboard v-if="connected" :api="api"></dashboard>
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

<template>
  <ul id="dom-breadcrumbs">
    <li v-for="(node, index) in nodes" :key="index">
      <span :class="node.isComponent ? 'component' : ''" v-on:click="selectComponent(node)">{{ node.name }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'dom-breadcrumbs',

  props: ['api', 'selector'],

  data() {
    return {
      nodes: [],
    };
  },

  mounted() {
    this.$watch('selector', (selector) => {
      this.nodes = [];
      for (let i = selector.length; i >= 0; i -= 1) {
        const nodeSelector = selector.slice(0, selector.length - i);
        this.api.callRemote('getNodeInfo', nodeSelector, (name) => {
          this.nodes.push(name);
        });
      }
    }, { immediate: true });
  },

  methods: {
    selectComponent(element) {
      if (element.isComponent) {
        this.api.callRemote('selectComponent', element.selector);
      }
    },
  },
};
</script>

<style scoped>
#dom-breadcrumbs {
  margin-top: 0;
  margin-bottom: 0;
  list-style: none;
  padding-left: 0;
}

li {
  display: inline;
}

li::after {
  content: "\a0>\a0";
}

li:last-child::after {
  content: "";
}

.component {
  color: magenta;
  text-decoration: underline;
  cursor: pointer;
}
</style>

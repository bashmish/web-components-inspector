<template>
  <div id="dom-component">
    <button v-if="hasParentComponent()" v-on:click="selectParentComponent()">Go to parent</button>
    <dom-breadcrumbs :api="api" :selector="component.selector"></dom-breadcrumbs>
    <code>
      <dom-node :api="api" :node="component"></dom-node>
    </code>
  </div>
</template>

<script>
import DomBreadcrumbs from '@/subscriber/components/DomBreadcrumbs';
import DomNode from '@/subscriber/components/DomNode';

export default {
  name: 'dom-component',

  props: ['api', 'component'],

  components: {
    DomBreadcrumbs,
    DomNode,
  },

  methods: {

    hasParentComponent() {
      return !!this.component.parentComponentSelector;
    },

    selectParentComponent() {
      this.api.callRemote('selectComponent', this.component.parentComponentSelector);
    },

  },

};
</script>

<style scoped>
code {
  display: block;
}
</style>

<template>
  <div id="dashboard">

    <div class="toolbar">
      <button v-on:click="toggleInspecting()">
        <span v-if="!inspecting">Start</span><span v-if="inspecting">Stop</span>
        inspecting</button>
    </div>

    <div class="lookup-component" v-if="inspecting">
      Lookup component: {{ componentName }}
      <span v-if="!componentName">Hover over component and click if interested...</span>
    </div>

    <div class="inspected-component" v-if="composedDOMString">
      <div>Selected component: {{ componentName }}</div>
      <h2>Composed DOM:</h2>
      <pre v-highlightjs="composedDOMString"><code class="html"></code></pre>
    </div>

  </div>
</template>

<script>
import { prettyPrint } from 'html';

export default {
  name: 'dashboard',

  props: ['api'],

  data() {
    return {
      inspecting: false,
      componentName: '',
      composedDOMString: '',
    };
  },

  methods: {

    toggleInspecting() {
      if (this.inspecting) {
        this.api.callRemote('stopInspecting');
        this.revokeInspectorMethods();
      } else {
        this.componentName = '';
        this.composedDOMString = '';
        this.api.callRemote('startInspecting');
        this.provideInspectorMethods();
      }
      this.inspecting = !this.inspecting;
    },

    provideInspectorMethods() {
      const vue = this;

      this.api.provide({

        lookAtElement(componentName) {
          vue.componentName = componentName;
        },

        inspectElement(componentName, composedDOMString) {
          vue.toggleInspecting();
          vue.componentName = componentName;
          vue.composedDOMString = prettyPrint(composedDOMString, { max_char: 500, indent_size: 2 });
        },

      });
    },

    revokeInspectorMethods() {
      this.api.revoke(['lookAtElement', 'inspectElement']);
    },

  },

};
</script>

<style src="highlight.js/styles/vs.css"></style>

<style scoped>
  #dashboard {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .toolbar {
    flex-grow: 0;
  }

  .lookup-component {
    flex-grow: 0;
  }

  .inspected-component {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .inspected-component div,
  .inspected-component h2 {
    flex-grow: 0;
    margin: 0;
    padding: 0;
  }

  .inspected-component pre {
    flex-grow: 1;
    width: 100%;
    margin: 0;
    overflow: scroll;
  }
</style>

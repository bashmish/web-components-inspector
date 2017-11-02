<template>
  <div id="dashboard">

    <div class="toolbar">
      <button v-on:click="toggleInspecting()">
        <span v-if="!inspecting">Start</span><span v-if="inspecting">Stop</span>
        inspecting</button>
    </div>

    <div class="hovered-component" v-if="inspecting">
      Hovered component: {{ hoveredComponentName }}
      <span v-if="!hoveredComponentName">Hover over component and click if interested...</span>
    </div>

    <div class="selected-component" v-if="!inspecting && selectedComponentName">
      <div>
        Selected component: {{ selectedComponentName }}
        <button v-if="selectedComponentOpenInEditorLink" v-on:click="openInEditor()">Open in editor</button>
      </div>
      <h2>Composed DOM:</h2>
      <pre v-highlightjs="selectedComponentComposedDOMString"><code class="html"></code></pre>
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
      hoveredComponentName: '',
      selectedComponentName: '',
      selectedComponentComposedDOMString: '',
      selectedComponentOpenInEditorLink: '',
    };
  },

  methods: {

    toggleInspecting() {
      if (this.inspecting) {
        this.api.callRemote('stopInspecting');
        this.revokeInspectorMethods();
      } else {
        this.api.callRemote('startInspecting');
        this.provideInspectorMethods();
      }
      this.inspecting = !this.inspecting;
    },

    openInEditor() {
      fetch(this.selectedComponentOpenInEditorLink);
    },

    provideInspectorMethods() {
      const vue = this;

      this.api.provide({

        hoverComponent(name) {
          vue.hoveredComponentName = name;
        },

        selectComponent(name, composedDOMString, openInEditorLink) {
          vue.toggleInspecting();
          vue.selectedComponentName = name;
          vue.selectedComponentComposedDOMString = prettyPrint(composedDOMString, { max_char: 500, indent_size: 2 });
          vue.selectedComponentOpenInEditorLink = openInEditorLink;
        },

      });
    },

    revokeInspectorMethods() {
      this.api.revoke(['hoverComponent', 'selectComponent']);
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

  .hovered-component {
    flex-grow: 0;
  }

  .selected-component {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .selected-component div,
  .selected-component h2 {
    flex-grow: 0;
    margin: 0;
    padding: 0;
  }

  .selected-component pre {
    flex-grow: 1;
    width: 100%;
    margin: 0;
    overflow: scroll;
  }
</style>

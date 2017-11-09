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
      <dom-component :api="api" :component="selectedComponentComposedDOM"></dom-component>
    </div>

  </div>
</template>

<script>
import DomComponent from '@/subscriber/components/DomComponent';

export default {
  name: 'dashboard',

  props: ['api'],

  data() {
    return {
      inspecting: false,
      hoveredComponentName: '',
      selectedComponentName: '',
      selectedComponentComposedDOM: {},
      selectedComponentOpenInEditorLink: '',
    };
  },

  components: {
    DomComponent,
  },

  mounted() {
    this.provideSelectingMethods();
  },

  methods: {

    toggleInspecting() {
      if (this.inspecting) {
        this.stopInspecting();
      } else {
        this.startInspecting();
      }
    },

    startInspecting() {
      this.api.callRemote('startInspecting');
      this.provideInspectingMethods();
      this.inspecting = true;
    },

    stopInspecting() {
      this.api.callRemote('stopInspecting');
      this.revokeInspectingMethods();
      this.inspecting = false;
    },

    openInEditor() {
      fetch(this.selectedComponentOpenInEditorLink);
    },

    selectComponent(component) {
      this.api.callRemote('selectComponent', component.selector);
    },

    provideSelectingMethods() {
      const vue = this;
      this.api.provide({
        selectComponent(name, composedDOM, openInEditorLink) {
          vue.stopInspecting();
          vue.selectedComponentName = name;
          vue.selectedComponentComposedDOM = composedDOM;
          vue.selectedComponentOpenInEditorLink = openInEditorLink;
        },
      });
    },

    provideInspectingMethods() {
      const vue = this;
      this.api.provide({
        hoverComponent(name) {
          vue.hoveredComponentName = name;
        },
      });
    },

    revokeInspectingMethods() {
      this.api.revoke(['hoverComponent']);
    },

  },

};
</script>

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

  .selected-component DomTree {
    flex-grow: 1;
    width: 100%;
    overflow: scroll;
  }
</style>

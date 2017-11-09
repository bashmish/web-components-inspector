<template>
  <div id="dom-node">

    <div class="text-node" v-if="node.type === 'text'">
      <span>{{ node.value }}</span>
    </div>

    <div class="comment-node" v-if="node.type === 'comment'">
      <span>{{ node.value }}</span>
    </div>

    <div class="element-node" v-if="node.type === 'element'">

      <span :class="node.isComponent ? 'tag open component' : 'tag open'" v-on:click="selectComponent(node)">
        <span class="tag-name">{{ node.name }}</span>
        <span class="attribute" v-for="(attribute, index) in node.attributes" :key="index">
          <span class="attribute-name">{{ attribute.name }}</span>
          <span class="attribute-value">{{ attribute.name === 'style' ? '...' : attribute.value }}</span>
        </span>
      </span>

      <ul class="children" v-if="node.children.length">
        <li v-for="(node, index) in node.children" :key="index">
          <dom-node :api="api" :node="node"></dom-node>
        </li>
      </ul>

      <span class="tag close" v-if="!node.isVoid">
        <span class="tag-name">{{ node.name }}</span>
      </span>

    </div>

  </div>
</template>

<script>
export default {
  name: 'dom-node',

  props: ['api', 'node'],

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
ul {
  margin-top: 0;
  margin-bottom: 0;
  list-style: none;
  padding-left: 20px;
}

/* text */

.text-node {
  color: black;
}

/* comment */

.comment-node {
  color: green;
}

.comment-node::before {
  content: "<!--";
}

.comment-node::after {
  content: "-->";
}

/* element */

.tag {
  color: blue;
}

.tag.open::before {
  content: "<";
}

.tag.close::before {
  content: "</";
}

.tag.open::after, .tag.close::after {
  content: ">";
}

.tag.component .tag-name {
  color: magenta;
  text-decoration: underline;
  cursor: pointer;
}

.attribute::before {
  content: " ";
}

.attribute-name {
  color: red;
}

.attribute-name::after {
  content: "=";
  color: blue;
}

.attribute-value {
  color: green;
}

.attribute-value::before, .attribute-value::after {
  content: "\"";
  color: green;
}
</style>

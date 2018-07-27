<template>
  <div ref="mdView"></div>
</template>

<script>
import marked from 'marked';
import hljs from 'highlight.js';
// import 'highlight.js/styles/default.css';
import 'highlight.js/styles/tomorrow.css';
export default {
  name: 'MDView',
  props: {
    mdContent: {
      type: String
    }
  },
  mounted() {
    // console.log(this.$refs);
    this.$refs.mdView.innerHTML = marked(this.mdContent);

    this.hightLightCode();
  },
  methods: {
    hightLightCode() {
      this.$nextTick(() => {
        [].slice.call(this.$refs.mdView.querySelectorAll('pre code')).forEach(item => {
          hljs.highlightBlock(item);
        });
        this.$emit('contentLoaded');
      });
    }
  }
};
</script>

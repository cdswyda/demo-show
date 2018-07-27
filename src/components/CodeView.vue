<template>
  <div class="code-view" :codeUrl="codeUrl">
    <!-- 按钮区域 -->
    <div class="code-actions" v-if="hasCode">
      <!-- 放大、编辑、复制、运行 -->
      <!-- <Icon type="arrow-expand"></Icon> -->
      <span class="code-action-expand" @click="handleScale">
        <Tooltip content="放大">
          <Icon type="qr-scanner" ></Icon>
        </Tooltip>
      </span>
      <span class="code-action-edit" @click="handleEdit">
        <Tooltip content="在线编辑">
          <Icon type="edit" ></Icon>
        </Tooltip>
      </span>
      <span class="code-action-run" @click="handleRun">
        <Tooltip content="运行代码">
          <Icon type="arrow-right-b" ></Icon>
        </Tooltip>
      </span>
      <span class="code-action-copy" @click="handleCopy">
        <Tooltip content="复制代码">
          <Icon type="clipboard" ></Icon>
        </Tooltip>
      </span>
    </div>
    <!-- 代码预览 -->
    <pre class="code-view-show" >
      <code ref="codeview" :class="lang" v-html="codeContent"></code>
    </pre>
    <!-- 代码编辑 -->
    <div class="code-view-editor">
    </div>
  </div>
</template>

<script>
import { Icon, Tooltip, Message } from 'iview';
import axios from 'axios';
import Clipboard from 'clipboard';
import hljs from 'highlight.js';
// import 'highlight.js/styles/default.css';
import 'highlight.js/styles/tomorrow.css';
import htmlEscape from '../filters/html-escape.js';

export default {
  name: 'CodeView',
  components: {
    Icon,
    Tooltip,
    Message
  },
  props: {
    codeUrl: {
      type: String
    }
  },
  data() {
    return {
      codeSource: '',
      codeContent: '',
      lang: 'html'
    };
  },
  computed: {
    hasCode() {
      return this.codeUrl && this.codeContent;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    handleScale() {},
    handleEdit() {},
    handleRun() {},
    handleCopy() {
      let code = this.codeSource;
      let clipboard = new Clipboard('.code-action-copy', {
        text() {
          return code;
        }
      });
      clipboard.on('success', e => {
        e.clearSelection();
        clipboard.destroy();
        this.copied = true;
        Message.success('代码已复制到剪贴板');
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      });
    },
    removeMultiEmptyLine(str) {
      return str.replace(/(\r\n|\r|\n){2,}/g, '\r\n');
    },
    htmlEscape(str) {
      str = this.removeMultiEmptyLine(str);
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    },
    hightLightCode(code, lang) {
      this.$nextTick(() => {
        this.$refs.codeview && hljs.highlightBlock(this.$refs.codeview);
      });
    },
    init() {
      axios.get(this.codeUrl).then(res => {
        this.codeSource = res.data;
        this.codeContent = this.htmlEscape(res.data);
        this.hightLightCode();
      });
    }
  },
  watch: {
    codeUrl() {
      this.init();
    }
  }
};
</script>

<style lang="scss">
.textarea-invisible {
  position: absolute;
  visibility: hidden;
}
.code-view-show {
  margin: 0;
}
</style>

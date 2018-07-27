<template>
  <div class="code-view" :codeUrl="codeUrl">
    <!-- 按钮区域 -->
    <div class="code-actions" v-if="hasCode">
      <!-- 放大、编辑、复制、运行 -->
      <!-- <Icon type="arrow-expand"></Icon> -->
      <span class="code-action code-action-expand" @click="handleScale" v-show="!inEdit">
        <Tooltip content="放大">
          <Icon type="qr-scanner" size="18" ></Icon>
        </Tooltip>
      </span>
      <span class="code-action code-action-edit" @click="handleEdit" v-show="!inEdit">
        <Tooltip content="在线编辑">
          <Icon type="edit" size="18" ></Icon>
        </Tooltip>
      </span>
      <span class="code-action code-action-run" @click="handleRun" v-show="inEdit">
        <Tooltip content="运行代码">
          <Icon type="arrow-right-b" size="18" ></Icon>
        </Tooltip>
      </span>
      <span class="code-action code-action-copy" @click="handleCopy">
        <Tooltip content="复制代码">
          <Icon type="clipboard" size="18" ></Icon>
        </Tooltip>
      </span>
    </div>
    <!-- 代码预览 -->
    <pre class="code-view-show" >
      <code ref="codeview" :class="lang" v-html="codeContent"></code>
    </pre>

    <Modal class-name="code-scale-modal" :title="title" width="80" v-model="openCodeScale">
      <pre class="code-view-show" >
        <code ref="codeview2" :class="lang" v-html="codeContent"></code>
      </pre>
    </Modal>
    <!-- 代码编辑 -->
    <div class="code-view-editor">
    </div>
  </div>
</template>

<script>
import { Icon, Tooltip, Message, Modal } from 'iview';
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
    Message,
    Modal
  },
  props: {
    codeUrl: {
      type: String
    },
    title:{
      type:String,
      default:'代码展示'
    }
  },
  data() {
    return {
      codeSource: '',
      codeContent: '',
      lang: 'html',
      openCodeScale:false,
      inEdit: false,
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
    handleScale() {
      this.openCodeScale = true;
    },
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
        this.$refs.codeview2 && hljs.highlightBlock(this.$refs.codeview2);
        this.$emit('contentLoaded');
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
.code-view {
  position: relative;
}
.code-actions {
  position: absolute;
  right: 20px;
  top: 16px;
}
.code-view-show {
  margin: 0;
  overflow: auto;
  padding-top: 20px;
}
.code-action {
  color:#ccc;
  transition: all .2s ease-out;
  display: inline-block;
  vertical-align: top;
  width:20px;
  margin: 0 4px;
  cursor: pointer;
  &:hover {
    color:#000;
  }
}
</style>

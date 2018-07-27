<template>
  <div class="code-view" :codeUrl="codeUrl">
    <!-- 按钮区域 -->
    <div class="code-actions" v-if="hasCode">
      <!-- 放大、编辑、复制、运行 -->
      <!-- <Icon type="arrow-expand"></Icon> -->
      <span class="code-action code-action-expand" @click="handleScale" v-show="!openCodeEditor">
        <Tooltip content="放大">
          <Icon type="qr-scanner" size="18" ></Icon>
        </Tooltip>
      </span>
      <span class="code-action code-action-edit" @click="handleEdit" v-show="!openCodeEditor">
        <Tooltip content="在线编辑">
          <Icon type="edit" size="18" ></Icon>
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
    <Modal class-name="code-editor-modal" :title="title + ' - 在线编辑'" width="90" v-model="openCodeEditor">
      <div class="code-actions-modal" v-show="!editorLoading">
        <span class="code-action code-action-run" @click="handleRun" >
          <Tooltip content="运行代码">
            <Icon type="arrow-right-b" size="18" ></Icon>
          </Tooltip>
        </span>
        <span class="code-action code-action-copy" @click="handleCopy(true)">
          <Tooltip content="复制代码">
            <Icon type="clipboard" size="18" ></Icon>
          </Tooltip>
        </span>
      </div>
      <div class="code-view-editor" :class="{'loading':editorLoading}" ref="codeEditor">
      </div>
    </Modal>
  </div>
</template>

<script>
import { Icon, Tooltip, Message, Modal } from 'iview';
// monaco-editor 直接使用浏览器注入形式进行加载
// import monaco from 'monaco-editor';
// import monaco from 'monaco-editor/min/vs/loader.js';
// import '../../node_modules/monaco-editor/min/vs/editor/editor.main.css';
import axios from 'axios';
import Clipboard from 'clipboard';
import hljs from 'highlight.js';
// import 'highlight.js/styles/default.css';
import 'highlight.js/styles/tomorrow.css';
import htmlEscape from '../filters/html-escape.js';

const MONACO_PATH = './static/js/monaco-editor/min/vs';

// 处理 monaco-editor 资源的加载
function loadMonaco() {
  if (window.__MONACO_PROMISE__) {
    return window.__MONACO_PROMISE__;
  }
  const scriptStr = `
    require.config({
        paths: {
            'vs': '${MONACO_PATH}'
        }
    });
    require(['vs/editor/editor.main'], function () {
        window.__monaco_editor__ = monaco;
    });
  `;
  const editorPromise = new Promise((reslove, reject) => {
    // loader 加载
    const loaderScript = document.createElement('script');
    loaderScript.id = 'monaco-editor-loader';
    loaderScript.src = MONACO_PATH + '/loader.js';
    loaderScript.onload = () => {
      loaderScript.onload = null;
      reslove('loader');
    };
    loaderScript.onerror = () => {
      loaderScript.onerror = null;
      reject('monaco-editor资源加载失败');
    };
    document.body.appendChild(loaderScript);
  })
    .then(() => {
      // 依赖资源加载
      return new Promise((reslove, reject) => {
        const editorScript = document.createElement('script');
        editorScript.text = scriptStr;
        editorScript.onerror = () => {
          editorScript.onerror = null;
          reject('monaco-editor资源加载失败');
        };
        document.body.appendChild(editorScript);
        reslove('editor');
      });
    })
    .then(() => {
      // 加载检测
      return new Promise((reslove, reject) => {
        let timer;
        let count = 0;

        function check() {
          // 已经加载则直接成功
          if (window.__monaco_editor__) {
            clearTimeout(timer);
            reslove();
          } else {
            // 否则继续检测 但总次数不超过1000
            if (count++ < 1000) {
              setTimeout(check, 30);
            } else {
              reject('monaco-editor资源加载失败');
            }
          }
        }
        check();
      });
    });
  return (window.__MONACO_PROMISE__ = editorPromise);
}

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
    title: {
      type: String,
      default: '代码展示'
    }
  },
  data() {
    return {
      codeSource: '',
      codeContent: '',
      lang: 'html',
      openCodeScale: false,
      openCodeEditor: false,
      editorInited: false,
      editorLoading: true
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
    handleEdit() {
      if (!this.editorInited) {
        this.initCodeEditor();
      }
      this.openCodeEditor = true;
    },
    handleRun() {
      if (this.editor && this.editor.getValue) {
        const code = this.editor.getValue();
        const blob = new Blob([code], {
          type: 'text/html'
        });
        const url = URL.createObjectURL(blob);
        console.log(url);
        window.open(url);

        // URL.revokeObjectURL(url);

        var winname = window.open('http://fe.epoint.com.cn:8080/miniui_dev/demo/runCode/index.html', '_blank', '');
        winname.document.open('text/html', 'replace');
        winname.document.write(code);
        // winname.document.close();
      }
    },
    handleCopy(isEditor) {
      let code = isEditor === true && this.editor ? this.editor.getValue() : this.codeSource;
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
      return str.replace(/(?:\s+\r\n|\s+\r|\s+\n){2,}/g, '\r\n');
    },
    htmlEscape(str) {
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    },
    hightLightCode(dom, silent) {
      this.$nextTick(() => {
        dom && hljs.highlightBlock(dom);
        !silent && this.$emit('contentLoaded');
      });
    },
    init() {
      axios.get(this.codeUrl).then(res => {
        this.codeSource = this.removeMultiEmptyLine(res.data);
        this.codeContent = this.htmlEscape(this.codeSource);
        // this.hightLightCode();
      });
    },
    initCodeEditor() {
      this.editorLoading = true;
      loadMonaco().then(() => {
        this.editor = __monaco_editor__.editor.create(this.$refs.codeEditor, {
          value: this.codeSource,
          language: 'html',
          theme: 'vs-dark',
          automaticLayout: true,
          autoIndent: true,
          autoClosingBrackets: true,
          acceptSuggestionOnEnter: 'on',
          colorDecorators: true,
          dragAndDrop: true,
          formatOnPaste: true,
          formatOnType: true,
          mouseWheelZoom: true
        });
        this.editorInited = true;
        this.editorLoading = false;
      });
    }
  },
  watch: {
    codeUrl() {
      this.init();
    },
    codeContent() {
      this.hightLightCode(this.$refs.codeview);
    },
    openCodeScale(v) {
      v && this.hightLightCode(this.$refs.codeview, true);
    },
    openCodeEditor(v) {}
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
  color: #ccc;
  transition: all 0.2s ease-out;
  display: inline-block;
  vertical-align: top;
  width: 20px;
  margin: 0 4px;
  cursor: pointer;
  &:hover {
    color: #000;
  }
}
.code-editor-modal {
  .code-actions-modal {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    border-radius: 4px;
    opacity: 0.4;
    padding: 4px 8px;
    z-index: 10000;
    text-align: center;
    &:hover {
      opacity: 1;
    }
  }
  .ivu-modal {
    position: relative;
    top: 50px;
    height: 80%;
  }
  .ivu-modal-content {
    height: 100%;
  }
  .ivu-modal-body {
    position: absolute;
    top: 51px;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0;
  }
  .ivu-modal-footer {
    display: none;
  }
}
.code-view-editor {
  height: 100%;
  width: 100%;
  box-sizing: content-box;
  &.loading {
    :before {
      position: absolute;
      z-index: 1100;
      left: 50%;
      bottom: 50%;
      transform: translate(-50%, -50%);
      content: '';
      display: block;
      border-radius: 50%;
      background-color: #0a8bfc;
      width: 50px;
      height: 50px;
      -webkit-animation: ani-spin-bounce 1s 0s ease-in-out infinite;
      animation: ani-spin-bounce 1s 0s ease-in-out infinite;
    }
  }
}
</style>

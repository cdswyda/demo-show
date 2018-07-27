<style lang="sass">
    @import './demo.scss';
</style>
<template>
  <Row class="example" :class="{'example-vertical': isVertical}" >
    <i-col class="example-demo" ref="demoShow" :class="{'loading': loading}" :span="isVertical ? 24 : 12">
      <header class="example-header">
        <span>
          {{ title }}
        </span>
      </header>
      <div class="example-case" :style="{'height':height}">
        <iframe class="example-ifr" :src="url" height="100%" width="100%" frameborder="0" scrolling="no"></iframe>
      </div>
      <div class="example-desc" v-if="!descriptionAsTab && mdLoaded">
        <MDView :mdContent="md"></MDView>
      </div>
    </i-col>

    <div class="example-split"></div>

    <i-col class="example-code" :span="isVertical ? 24 : 12" :style="desAndCodeStyle">

      <!-- 文档和代码展示 -->
      <Tabs ref="tabs" v-if="descriptionAsTab" :value="'description'">
        <TabPane label="说明" name="description">
          <MDView :mdContent="md"></MDView>
        </TabPane>
        <TabPane label="代码" name="code">
          <CodeView :codeUrl="url"></CodeView>
        </TabPane>
      </Tabs>
      <CodeView ref="codeOnly" v-if="!descriptionAsTab" :codeUrl="url"></CodeView>

      <!-- 查看更多 -->
      <div class="example-view-more" v-if="isOverView" @click="showMore = !showMore">
          <Icon type="ios-arrow-down" v-show="!showMore"></Icon>
          <Icon type="ios-arrow-up" v-show="showMore"></Icon>
          <i-button type="text" v-show="!showMore">
              <template>显示更多</template>
          </i-button>
      </div>

    </i-col>
  </Row>
</template>

<script>
import { Row, Col, Icon, Tabs, TabPane, Button } from 'iview';
import axios from 'axios';
import MDView from './MDView';
import CodeView from './CodeView';

export default {
  components: {
    Row,
    'i-col': Col,
    Icon,
    Tabs,
    TabPane,
    MDView,
    CodeView,
    'i-button': Button
  },
  name: 'Demo',
  props: {
    title: {
      type: String,
      default: ''
    },
    isVertical: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 400
    },
    url: {
      type: String,
      default: ''
    },
    docUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      mdLoaded: false,
      descriptionAsTab: false,
      md: '',
      loading: true,
      showMore: false,
      // 垂直布局下 说明和代码默认展示的高度
      VERTICAL_DES_HEIGHT: 400,
      // 是否需要展示更多
      isOverView: false
    };
  },
  computed: {
    // 描述和代码展示区域的高度
    desAndCodeStyle() {
      let style = {};

      if (this.isVertical) {
        // 通栏展示时 暂时直接固定为400px;
        style.height = `${this.VERTICAL_DES_HEIGHT}px`;
      } else {
        // 否则取左侧高度即可
        if (!this.loading) {
          const height = this.$refs.demoShow.$el.clientHeight;
          style.height = `${height}px`;
        }
      }
      return style;
    }
  },
  mounted() {
    this.init();

  },
  methods: {
    init() {
      // 加载文档内容
      if (this.docUrl) {
        this.true = false;
        axios.get(this.docUrl).then(content => {
          console.log(content);
          this.md = content.data;
          this.mdLoaded = true;
          this.descriptionAsTab = this.md.length > 500 ? true : false;
          this.loading = false;
          // this.updateIsOverView();
        });
      } else {
        this.descriptionAsTab = false;
        this.loading = false;
        // this.updateIsOverView();
      }
      // this.$nextTick(() => {
      // const demo_height = this.$children[0].$children[0].$el.clientHeight;
      // const code_height = this.$children[0].$children[1].$el.clientHeight + 20;
      // this.code_height = code_height;
      // if (code_height <= demo_height && !this.isCodeHide) {
      //   this.showMore = false;
      // }
      // this.demo_height = this.isCodeHide ? 30 : demo_height;
      // this.ready = true;
      // });
    },
    updateIsOverView() {
      this.$nextTick(() => {
        if (this.loading) {
          return (this.isOverView = false);
        }
        console.log(this.$refs);
        const h = this.descriptionAsTab ? this.$refs.tabs.$el.clientHeight : this.$refs.codeOnly.$el.clientHeight;
        // 限制高度取值
        // 垂直情况下为 固定高度值
        // 水平状态下为 左侧demo展示高度值
        const limit_h = this.isVertical ? this.VERTICAL_DES_HEIGHT : this.$refs.demoShow.clientHeight;
        console.log(h, limit_h);

        this.isOverView = h > limit_h;
      });
    }
  },
  watch: {
    // settingCode() {
    //   this.showCode = false;
    //   this.showMore = true;
    //   this.ready = false;
    //   this.init();
    // }
  },
  beforeRouteUpdate(to, from, next) {
    this.$nextTick(() => {
      this.init();
    });
    next();
  }
};
</script>

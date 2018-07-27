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
      <div class="example-case" :style="{'height': height + 'px'}">
        <iframe class="example-ifr" :src="url" height="100%" width="100%" frameborder="0" scrolling="no"></iframe>
      </div>
      <div class="example-desc" v-if="!descriptionAsTab && mdLoaded">
        <MDView :mdContent="md"></MDView>
      </div>
    </i-col>

    <div class="example-split"></div>

    <i-col class="example-code" :span="isVertical ? 24 : 12" :style="desAndCodeStyle">

      <!-- 文档和代码展示 -->
      <Tabs ref="tabs" v-if="descriptionAsTab" v-model="activeTab" @on-click="showMore = false">
        <TabPane label="说明" name="description">
          <MDView :mdContent="md" @contentLoaded="updateHight"></MDView>
        </TabPane>
        <TabPane label="代码" name="code">
          <CodeView :codeUrl="url" :title="title" @contentLoaded="updateHight"></CodeView>
        </TabPane>
      </Tabs>
      <CodeView ref="codeOnly" v-if="!descriptionAsTab" :codeUrl="url" :title="title" @contentLoaded="updateHight"></CodeView>

      <!-- 查看更多 -->
      <div class="example-view-more" ref="viewMore" v-if="isOverView" @click="showMore = !showMore">
          <Icon type="ios-arrow-down" v-show="!showMore"></Icon>
          <Icon type="ios-arrow-up" v-show="showMore"></Icon>
          <i-button type="text">
              <template v-if="!showMore">显示更多</template>
              <template v-if="showMore">收起</template>
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
      isOverView: false,
      activeTab:'description'
    };
  },
  computed: {
    // 显示更多区域高度
    showMoreHeight() {
      if (!this.isOverView) {
        return 0;
      }
      return this.$refs.viewMore.clientHeight;
    },
    tabHeaderHeight(){
      if(!this.$refs.tabs) {
        return 0;
      }else {
        return 36;
      }
    },
    extraHeight() {
      return this.showMoreHeight + this.tabHeaderHeight;
    },
    // 描述和代码展示区域的高度
    desAndCodeStyle() {
      let style = {};

      // 显示更多时
      // // 直接移除高度即可
      if (this.showMore) {
        // 不同tab高度不一 还是需要根据激活的取对应高度
        if (this.$refs.tabs) {
          const activeTabIdx = this.$refs.tabs.getTabIndex(this.$refs.tabs.value);
          const activeTab = this.$refs.tabs.getTabs()[activeTabIdx];
          style.height = `${activeTab.$el.firstElementChild.clientHeight + this.extraHeight}px`;
        } else {
          style.height = `${this.$refs.codeOnly.$el.clientHeight + this.extraHeight}px`;
        }
        return style;
      }

      // 否则取各自状态下的限制高度
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
          // console.log(content);
          this.md = content.data;
          this.descriptionAsTab = this.md.length > 500 ? true : false;
          this.loading = false;
        });
      } else {
        this.descriptionAsTab = false;
        this.loading = false;
      }
    },
    // 更新高度
    updateHight() {
      // md和代码加载完成后更新计算高度
      this.updateIsOverView();
    },
    updateIsOverView() {
      this.$nextTick(() => {
        if (this.loading) {
          return (this.isOverView = false);
        }
        const h = this.descriptionAsTab ? this.$refs.tabs.$el.clientHeight : this.$refs.codeOnly.$el.clientHeight;
        // 限制高度取值
        // 垂直情况下为 固定高度值
        // 水平状态下为 左侧demo展示高度值
        const limit_h = this.isVertical ? this.VERTICAL_DES_HEIGHT : this.$refs.demoShow.$el.clientHeight;

        this.isOverView = h > limit_h;
      });
    }
  },
  watch: {},
  beforeRouteUpdate(to, from, next) {
    this.$nextTick(() => {
      this.init();
    });
    next();
  }
};
</script>

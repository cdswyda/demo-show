<style lang="scss">
.demo-list {
  padding:10px 20px;
}
</style>

<template>
  <div class="demo-list">
    <Demo v-for="item in list" :key="item.id" :title="item.name" :url="item.url" :isVertical="item.isVertical" :docUrl="item.docUrl" :height="item.height"></Demo>
  </div>
</template>

<script>
import Demo from './Demo';

import { getList } from '../mock/index.js';

export default {
  name: 'DemoList',
  components: {
    Demo
  },
  data() {
    return {
      list: []
    };
  },
  created() {
    this.getData(this.$route.params.id);
  },
  mounted() {},
  methods: {
    getData(id) {
      getList(id).then(data => {
        this.$set(this, 'list', data);
      });
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.getData(to.params.id);
    next();
  }
};
</script>


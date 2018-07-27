<template>
  <div class="hello">
    <Menu theme="light" mode="horizontal" @on-select="handleMenuClick" :active-name="activeMenuId">
      <menu-item v-for="(item,idx) in menu" :key="idx" :name="item.id">{{item.name}}</menu-item>
    </Menu>
    <router-view/>
  </div>
</template>

<script>
import { Menu, MenuItem } from 'iview';
import { getMenu } from '../mock/index.js';
window.getMenu = getMenu;
export default {
  name: 'HelloWorld',
  components: {
    Menu,
    MenuItem
  },
  data() {
    return {
      menu: [],
      activeMenuId: ''
    };
  },
  mounted() {
    getMenu().then(menu => {
      this.$set(this, 'menu', menu);

      // 根据路由激活菜单
      this.$nextTick(() => {
        if (this.$route.params.id) {
          this.activeMenuId = this.$route.params.id;
        }
      });
    });
  },
  methods: {
    handleMenuClick(id) {
      this.$router.push({ name: 'DemoList', params: { id: id } });
      this.activeMenuId = id;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
</style>

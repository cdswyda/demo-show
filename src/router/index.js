import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import Demo from '@/components/Demo'
import DemoList from '@/components/DemoList'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld,
    children: [
      {
        path: '/demo/:id',
        name: 'Demo',
        component: Demo
      },
      {
        path: '/demolist/:id',
        name: 'DemoList',
        component: DemoList
      }
    ]
  }]
})

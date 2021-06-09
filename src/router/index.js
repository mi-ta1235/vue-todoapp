import Vue from 'vue'
import Router from 'vue-router'
import Tutorial from '@/components/Tutorial'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Tutorial',
      component: Tutorial
    },
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})

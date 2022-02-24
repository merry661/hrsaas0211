import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// 1.在main.js中完成自定义指令 的全局注册
import * as directives from '@/directives'
// 3. 组件统一全局注册:自定义的通用组件
import component from '@/components'
// 5.引入工具类--过滤器
import * as filters from '@/filters'
// 导入Mixin技术
import checkPermission from '@/mixin/checkPermission'
// 引入国际化语言插件
import i18n from './lang/index'
// set ElementUI lang to EN
// 改变locale的值 就可以改变对应的当前语言
// Vue.use(ElementUI, { locale })

// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// 在main.js中对挂载 i18n的插件，并设置element为当前的语言**
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key)// t方法 会去对应的语言包里寻找对应的内容
})
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// 2.注册自定义指令
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})
// 6.注册全局的过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// 4.注册自定义的通用组件
Vue.use(component)

// 7.全局混入检查对象
Vue.mixin(checkPermission) // 表示所有的组件都拥有了检查的方法
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

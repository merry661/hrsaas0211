// 权限拦截 导航守卫 路由守卫

import router from './router' // 引入路由
import store from './store' // 引入vuex store实例
import NProgress from 'nprogress' // progress bar //引入进度条插件
import 'nprogress/nprogress.css' // progress bar style //引入进度条样式

// 1.定义白名单
const whiteList = ['/login', '/404']
router.beforeEach((to, from, next) => {
  // 2.启动进度条
  NProgress.start()
  // 3.判断token是否存在
  // 1)有token-->path是'/login'->跳转主页
  // 2)有token-->path不是'/login'->跳转
  // 3)没有token-->path在白名单中->跳转
  // 4)没有token-->path不再白名单里->强制跳转到登录页
  if (store.getters.token) {
    if (to.path === '/logn') {
      next('/')
    } else {
      next()// 直接放行
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
  // 手动强制关闭进度条 为了解决 手动切换地址时  进度条的不关闭的问题
  NProgress.done()
})

// 后置守卫
router.afterEach(() => {
  NProgress.done()// 关闭进度条
})

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })

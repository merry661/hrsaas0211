// 权限拦截 导航守卫 路由守卫

import router from './router' // 引入路由
import store from './store' // 引入vuex store实例
import NProgress from 'nprogress' // progress bar //引入进度条插件
import 'nprogress/nprogress.css' // progress bar style //引入进度条样式

// 1.定义白名单
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  NProgress.start()// 2.启动进度条

  if (store.getters.token) { // 3.判断token是否存在
    if (to.path === '/login') { // 1)有token-->path是'/login'->跳转主页
      next('/')// 跳转主页
    } else {
      // 如果当前vuex中有用户的资料的id 表示 已经有资料了 不需要获取了 如果没有id才需要获取
      if (!store.getters.userId) {
        const { roles } = await store.dispatch('user/getUserInforAC') // 调用vuex中的actions中的方法 获取用户资料

        // 在拦截的位置，调用关联action， 获取新增routes，并且**addRoutes**
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)// 获取筛选到的动态路由

        // router.addRoutes(routes)// 添加动态路由到路由表  铺路
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])

        // next()// 添加完动态路由之后,必须 用 next(地址) 不能用next()
        next(to.path)
        // NProgress.done()
      } else {
        // 2)有token-->path不是'/login'->跳转
        next()// 直接放行
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      // 3)没有token-->path在白名单中->跳转
      next()
    } else {
      // 4)没有token-->path不再白名单里->强制跳转到登录页
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

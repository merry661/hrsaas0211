// vuex的权限模块/permission模块: 用来存放当前的 静态路由 + 当前用户的 权限路由
import { asyncRoutes, constantRoutes } from '@/router'

const state = {
  routes: constantRoutes// 所有人默认拥有静态路由
}
const mutations = {
  // 1.修改路由
  // 参数：state,用户登录后，通过权限所得到的动态路由部分
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]// 每次更新 都应该在静态路由的基础上进行追加
  }
}
const actions = {
  // 2.筛选权限路由
  // 参数：context，当前用户的所拥有的菜单权限
  filterRoutes(context, menus) {
    const routesMatch = [] // routesMatch是所有模块中"满足权限要求"的路由数组

    // menus: ["settings","permissions"]
    // asyncRoutes是所有的动态路由
    // asyncRoutes  [{path: 'setting',name: 'setting'},{}]
    // key就是标识
    console.log(menus)
    menus.forEach(key => {
      // 筛选出动态路由和menu匹配的路由
      const matchRouters = asyncRoutes.filter(item => item.name === key)
      routesMatch.push(...matchRouters)
    })
    context.commit('setRoutes', routesMatch) // 将动态路由提交给mutations,用于state数据
    return routesMatch// state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

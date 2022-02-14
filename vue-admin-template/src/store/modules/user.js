// 用户模块
import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserAvatarById, getUserInfo } from '@/api/user'
// 状态
const state = {
  // 设置token的共享状态,初始化vuex时，先从本地缓存中读取，并赋值到初始化的状态上（实现token持久化）
  token: getToken(),
  userInfor: {}// 用户资料
}
// 修改状态
const mutations = {
  /**
   * 1.设置token
   * setToken() 参数1：state对象
   * **/
  setToken(state, tokenNew) {
    // 1)vuex监听到token变化，将新token赋值给state.token
    state.token = tokenNew
    // 2）vuex监听到token变化，将新token存储到缓存中
    setToken(tokenNew)
  },
  // 2.删除缓存
  removeToken(state) {
    // 1)先删除vuex的token
    state.token = null
    // 2）再清除缓存中token
    removeToken()
  },
  // 3.设置用户资料信息
  setUserInfoMu(state, userInfors) {
    // 1)更新state中的userInfor
    state.userInfor = { ...userInfors }
  },
  // 4.删除用户信息
  removeUserInfoMu(state) {
    state.userInfor = {}
  }
}
// 执行异步
const actions = {
  /**
   * 1.封装登录的Action
   * 1）调用登录接口，
   * 2）成功后设置token到vuex，
   * 3）失败则返回失败
   * loginSystem()的参数：context是state
   * **/
  async loginSystem(context, loginData) {
    // 1）调用登录接口
    // 经过响应拦截器的处理之后 这里的result实际上就是 token
    const result = await login(loginData)

    // 2) actions 修改state 必须通过mutations
    context.commit('setToken', result)
  },
  // 2.封装获取用户资料的action
  async getUserInforAC(context) {
    try {
      // 1)调用接口--获取用户基本信息
      const baseInfo = await getUserInfo()
      const avatarInfo = await getUserAvatarById(baseInfo.userId) // 2)调用接口--获取详细基本信息(头像)
      const baseResult = { ...baseInfo, ...avatarInfo }// 将两个接口数据合并
      // 2)通过commit将返回结果设置到state中
      context.commit('setUserInfoMu', baseResult)

      return baseResult
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  },
  // 3.封装获取用户退出登录的action
  logoutSystem(context) {
    console.log('删除了')
    // 1)删除token
    context.commit('removeToken')
    // 2) 删除用户资料
    context.commit('removeUserInfoMu')
    // 3) 重置路由
    // 4)commit 提交mutations中的方法
  }

}
// 导出user模块
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

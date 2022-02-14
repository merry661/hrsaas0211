// 用户模块
import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
// 状态
const state = {
  // 设置token的共享状态,初始化vuex时，先从本地缓存中读取，并赋值到初始化的状态上（实现token持久化）
  token: getToken()
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
  // 删除缓存
  removeToken() {
    // 1)先删除vuex的token
    state.token = null
    // 2）再清除缓存中token
    removeToken()
  }
}
// 执行异步
const actions = {
  /**
   * 1.封装登录的Action
   * 登录action要做的事情：1）调用登录接口，
   * 2）成功后设置token到vuex，
   * 3）失败则返回失败
   * login()的参数：context是state
   * **/
  async loginSystem(context, loginData) {
    // 1）调用登录接口
    // 经过响应拦截器的处理之后 这里的result实际上就是 token
    const result = await login(loginData)

    // 2) actions 修改state 必须通过mutations
    context.commit('setToken', result)
  }
}
// 导出user模块
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

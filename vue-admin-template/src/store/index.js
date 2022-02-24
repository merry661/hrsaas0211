import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
// 引入tab标签模块
import tagsView from './modules/tagsView'

// 在Vuex管理模块中引入permisson模块
import permission from './modules/permission'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    // 子模块   $store.state.app.
    // mapGetters([])
    app,
    settings,
    user,
    permission,
    tagsView
  },
  getters
})

export default store

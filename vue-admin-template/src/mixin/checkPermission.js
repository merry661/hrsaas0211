// 使用Mixin技术将检查方法注入
// 1.导入store对象
import store from '@/store'

// 3.声明“检查权限”方法，参数key:要检查的权限点
// 4）去用户的信息里面找 points中有没有key 如果有key 则认为有权限 如果没有key则认为不能点击

export default {
  // 2.混入 对象是组件的 选项对象
  methods: {
    checkPermission(key) {
      const userInfo = store.state.user
      console.log(userInfo.roles, '000')

      if (userInfo.roles && userInfo.roles.points) {
        return userInfo.roles.points.some(item => item === key)
      } else {
        return false// 对该功能点，没有权限
      }
    }
  }
}

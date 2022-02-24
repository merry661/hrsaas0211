const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // 将token值作为公共的访问属性放出
  // 在根级的getters上 开发子模块的属性给别人看 给别人用
  token: state => state.user.token,
  name: state => state.user.userInfor.username, // 建立用户名称的映射
  userId: state => state.user.userInfor.userId, // 建立用户userId的映射
  userPhoto: state => state.user.userInfor.staffPhoto, // 建立用户头像的映射
  companyId: state => state.user.userInfor.companyId, // 建立companyId的映射
  routes: state => state.permission.routes// 建立权限模块下的快捷访问
}
export default getters

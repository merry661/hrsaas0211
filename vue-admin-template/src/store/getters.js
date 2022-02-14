const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // 将token值作为公共的访问属性放出
  // 在根级的getters上 开发子模块的属性给别人看 给别人用
  token: state => state.user.token
}
export default getters

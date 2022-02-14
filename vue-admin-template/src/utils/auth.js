import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'// 设定一个独一无二的key

// 获得token
export function getToken() {
  return Cookies.get(TokenKey)
}
// 设置token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
// 删除token
export function removeToken() {
  return Cookies.remove(TokenKey)
}

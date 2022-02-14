import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'// token的key
const timeKey = 'hrsaas-timestamp-key'

// 1.获得token
export function getToken() {
  return Cookies.get(TokenKey)
}
// 2.设置token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
// 3.删除token
export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 4. 获取时间戳
export function getTimeStamp() {
  return Cookies.get(timeKey)
}
// 5. 设置时间戳
export function setTimeStamp() {
  // 存储当前时间
  Cookies.set(timeKey, Date.now())
}

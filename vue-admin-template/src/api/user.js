import request from '@/utils/request'

// 1.登录
export function login(data) {
// 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 2.获取用户资料
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

// 3.登出
// export function logout() {

// }
// 4.获取头像数据
// 5.获取某个用户的基本信息
export function getUserAvatarById(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'GET'
  })
}


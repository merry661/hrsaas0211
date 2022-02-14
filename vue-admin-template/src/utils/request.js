// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth'

// 定义token超时时间
const Timeout = 3600
// 1.创建一个axios的实例
const service = axios.create({
  // 1)设置axios请求的基础的基础地址
  baseURL: process.env.VUE_APP_BASE_API,
  // 2)  定义5秒超时
  timeout: 5000

})
// 2.请求拦截器
// 注入token
// config 是请求的配置信息,一定要在最后返回
service.interceptors.request.use(config => {
  // 1)如果有token->配置config的header,拼接token(注入token)
  if (store.getters.token) {
    // 在有token的情况下, 有必要去检查时间戳是否超时
    if (IsCheckTimeout()) { // 已超时
      // 1)调用vuex 的actions的登出方法
      store.dispatch('user/logoutSystem')
      // 2)页面跳转到登录页
      router.push('/login')
      // 3）报错提示token超时
      return Promise.reject(new Error('token超时'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 3.响应拦截器
service.interceptors.response.use(response => {
  const { success, message, data } = response.data// 1)处理 axios默认加了一层data
  if (success) { // 2)接口是否成功
    return data
  } else {
    Message.error(message)// 提示错误消息
    // 3) 业务已经错误了,只能进入到catch,触发promise.reject()
    return Promise.reject(new Error(message))
  }
}, error => {
  // Token失效的被动处理
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logoutSystem')// 1)调用vuex 的actions的登出方法
    router.push('/login')// 2)页面跳转到登录页
  } else { // 其他错误
    Message.error(error.message)// 提示错误消息
  }

  // 4)返回执行错误 让当前的执行链跳出成功 直接进入 catch
  return Promise.reject(error)
})

// 4.超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeout() {
  var currentTime = Date.now()// 当前时间
  var timeStamp = getTimeStamp()
  return (currentTime - timeStamp) / 1000 > Timeout
}
export default service // 4.导出axios实例

// import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

// // create an axios instance
// const service = axios.create({
//   baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
//   // withCredentials: true, // send cookies when cross-domain requests
//   timeout: 5000 // request timeout
// })

// // request interceptor
// service.interceptors.request.use(
//   config => {
//     // do something before request is sent

//     if (store.getters.token) {
//       // let each request carry token
//       // ['X-Token'] is a custom headers key
//       // please modify it according to the actual situation
//       config.headers['X-Token'] = getToken()
//     }
//     return config
//   },
//   error => {
//     // do something with request error
//     console.log(error) // for debug
//     return Promise.reject(error)
//   }
// )

// // response interceptor
// service.interceptors.response.use(
//   /**
//    * If you want to get http information such as headers or status
//    * Please return  response => response
//   */

//   /**
//    * Determine the request status by custom code
//    * Here is just an example
//    * You can also judge the status by HTTP Status Code
//    */
//   response => {
//     const res = response.data

//     // if the custom code is not 20000, it is judged as an error.
//     if (res.code !== 20000) {
//       Message({
//         message: res.message || 'Error',
//         type: 'error',
//         duration: 5 * 1000
//       })

//       // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         // to re-login
//         MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
//           confirmButtonText: 'Re-Login',
//           cancelButtonText: 'Cancel',
//           type: 'warning'
//         }).then(() => {
//           store.dispatch('user/resetToken').then(() => {
//             location.reload()
//           })
//         })
//       }
//       return Promise.reject(new Error(res.message || 'Error'))
//     } else {
//       return res
//     }
//   },
//   error => {
//     console.log('err' + error) // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )

// export default service

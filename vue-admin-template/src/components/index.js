// 该js:提供组件的注册入口,负责所有全局自定义组件的注册

// 1)导入组件
import PageTools from './PageTools'// 页面顶部组件
import UploadExcel from './UploadExcel'// 上传excel
import ImageUpload from './ImageUpload'// 上传图片
import Print from 'vue-print-nb'// "打印“组件
// 2)注册组件
export default {
  install(Vue) {
    // 参数：组件名字，组件对象
    Vue.component('PageTools', PageTools)// 注册全局的 通用栏组件对象
    Vue.component('UploadExcel', UploadExcel)// 注册"导入excel"组件
    Vue.component('ImageUpload', ImageUpload) // 注册导入上传组件
    Vue.use(Print) // 注册打印组件
  }
}

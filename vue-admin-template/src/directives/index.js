// 负责管理 所有的自定义指令

// 1.注册自定义指令
// 2.定义自定义指令
export const imagerror = {
  /**
     * 1. 钩子函数,在"当前的dom元素插入到节点之后"执行,只会执行一次
       * inserted()参数:该指令的作用对象,指令中的变量的解释
       * **/
  inserted(dom, options) {
    // 1)初始化dom的src属性:如src有值 则赋值;如没值 则取默认值,等于options.value
    dom.src = dom.src || options.value
    // 2)当图片出现异常的时,会报错,并触发图片的onerror事件,
    // 将指令配置的默认图片设置为该dom/图片的内容
    dom.onerror = function() {
      dom.src = options.value
    }
  },

  // 2. 钩子函数,在 "该指令作用的组件 更新数据完毕后" 执行
  //   组件初始化 一旦更新就会componentUpdated函数
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}
// 3.在main.js中完成全局注册 自定义指令
// 4.在组件中使用自定义指令

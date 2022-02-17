// 权限管理模块下的路由规则

// 1) 当你的访问地址 是 /permission layout组件会显示 此时 你的二级路由的默认组件  也会显示
import Layout from '@/layout'
// 2) 每个子模块 都位于layout的二级路由里面
// 导出属于员工的路由规则,
export default {
  path: '/permission',
  name: 'permission',
  component: Layout,
  // 配置二级路由的路由表
  children: [{
    path: '', // 当二级路由的path什么都不写的时候 表示该路由为当前二级路由的默认路由
    component: () => import('@/views/permission'),
    meta: {
      // 左侧导航会读取路由里的meta里的title作为显示菜单名称
      title: '权限管理',
      icon: 'lock'
    }
  }]
}

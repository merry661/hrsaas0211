// 员工模块下的路由规则

// 1) 当你的访问地址 是 /employees的时候 layout组件会显示 此时 你的二级路由的默认组件  也会显示
import Layout from '@/layout'
// 2) 每个子模块 都位于layout的二级路由里面

export default { // 导出属于员工的路由规则
  path: '/employees',
  name: 'employees',
  component: Layout,

  // 3)配置二级路由的路由表
  children: [
    {
      path: '', // 当二级路由的path什么都不写的时候 表示该路由为当前二级路由的默认路由
      component: () => import('@/views/employees'),
      meta: {
      // 左侧导航会读取路由里的meta里的title作为显示菜单名称
        title: '员工管理',
        icon: 'people'
      }
    },
    // 4)配置员工管理模块--二级路由，员工详情页
    {
      path: 'detail/:id', // query传参 动态路由传参
      component: () => import('@/views/employees/detail'),
      hidden: true, // 不在左侧菜单显示
      meta: {
        title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
      }
    },
    {
      path: 'print/:id',
      component: () => import('@/views/employees/print'),
      hidden: true,
      meta: {
        title: '员工打印'
      }
    }
  ]
}

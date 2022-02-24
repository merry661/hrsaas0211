// 公司角色信息api
import request from '@/utils/request'

// 1.获取角色列表
// methods默认是‘GET’，params是查询参数，里面需要携带分页信息
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}

// 2.读取公司信息数据
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`,
    method: 'GET'
  })
}
// 3. 删除角色
export function deleteRole(roleId) {
  return request({
    url: `/sys/role/${roleId}`,
    method: 'DELETE'
  })
}
// 4.获取角色详情
export function getRole(roleId) {
  return request({
    url: `/sys/role/${roleId}`,
    method: 'GET'
  })
}
// 5.修改角色信息
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'PUT',
    data
  })
}
// 6.新增角色
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'POST',
    data
  })
}
// 7.给角色分配权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}


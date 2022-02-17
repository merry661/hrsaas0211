// 组织架构API
import request from '@/utils/request'

// 1. 获取组织架构数据
export function getDepartments() {
  return request({
    url: '/company/department',
    method: 'GET'
  })
}
// 2.删除部门
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}
// 3.新增部门
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}
// 4.获取部门信息
export function getDepartmentsDetail(departId) {
  return request({
    url: `/company/department/${departId}`,
    method: 'GET'
  })
}
// 5.编辑部门
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}

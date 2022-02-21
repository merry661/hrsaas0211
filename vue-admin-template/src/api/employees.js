import request from '@/utils/request'

//  1.获取员工简单列表
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple',
    method: 'GET'
  })
}

// 2. 获取员工列表数据
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    method: 'GET',
    params
  })
}
// 3.删除员工
export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

// 4.新增员工
export function addEmployee(data) {
  return request({
    url: '/sys/user',
    method: 'POST',
    data
  })
}
// 5.批量导入员工
export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'POST',
    data
  })
}
// 6.保存员工基本信息
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'PUT',
    data
  })
}

// 7. 保存员工个人信息（基础信息）
export function updatePersonalDetail(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'PUT',
    data
  })
}
// 8. 获取用户的岗位信息
export function getJobDetail(id) {
  return request({
    url: `/employees/g${id}/jobs`,
    method: 'GET'
  })
}
// 9.保存岗位信息
export function updateJob(data) {
  return request({
    url: `/employees/g${data.id}/jobs`,
    method: 'PUT',
    data
  })
}

// 10.读取用户详情的基础信息
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`,
    method: 'GET'
  })
}
/** **
 *
 *  给用户分配角色
 * ******/
/** *
 * 给用户分配角色
 * ***/
export function assignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    data,
    method: 'put'
  })
}

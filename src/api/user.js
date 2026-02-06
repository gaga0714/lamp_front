import request from '@/utils/request'

/** 更新个人资料 */
export function updateProfile(data) {
  return request({
    url: '/user/profile',
    method: 'put',
    data,
  })
}

/** 用户管理列表（管理员） */
export function getUserList(params) {
  return request({
    url: '/admin/users',
    method: 'get',
    params,
  })
}

/** 用户管理：新增/编辑 */
export function saveUser(data) {
  return request({
    url: '/admin/users',
    method: data.id ? 'put' : 'post',
    data,
  })
}

/** 用户管理：删除 */
export function deleteUser(id) {
  return request({
    url: `/admin/users/${id}`,
    method: 'delete',
  })
}

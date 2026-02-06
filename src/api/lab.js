import request from '@/utils/request'

/** 实验室列表 */
export function getLabList(params) {
  return request({
    url: '/lab/list',
    method: 'get',
    params,
  })
}

/** 实验室详情 */
export function getLabDetail(id) {
  return request({
    url: `/lab/${id}`,
    method: 'get',
  })
}

/** 可预约时段 */
export function getLabSlots(id, params) {
  return request({
    url: `/lab/${id}/slots`,
    method: 'get',
    params,
  })
}

/** 提交预约 */
export function createBooking(data) {
  return request({
    url: '/lab/booking',
    method: 'post',
    data,
  })
}

/** 我的预约列表 */
export function getMyBookings(params) {
  return request({
    url: '/lab/booking/my',
    method: 'get',
    params,
  })
}

/** 取消预约 */
export function cancelBooking(id) {
  return request({
    url: `/lab/booking/${id}/cancel`,
    method: 'put',
  })
}

/** 预约审批列表 */
export function getApproveList(params) {
  return request({
    url: '/lab/booking/approve/list',
    method: 'get',
    params,
  })
}

/** 审批预约 */
export function approveBooking(id, data) {
  return request({
    url: `/lab/booking/${id}/approve`,
    method: 'put',
    data,
  })
}

/** 实验室管理：列表 */
export function getLabManageList(params) {
  return request({
    url: '/lab/manage/list',
    method: 'get',
    params,
  })
}

/** 实验室管理：新增/编辑 */
export function saveLab(data) {
  return request({
    url: '/lab/manage',
    method: data.id ? 'put' : 'post',
    data,
  })
}

/** 实验室管理：删除 */
export function deleteLab(id) {
  return request({
    url: `/lab/manage/${id}`,
    method: 'delete',
  })
}

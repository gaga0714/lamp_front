import request from '@/utils/request'

/** 签到/签退 */
export function checkIn(data) {
  return request({
    url: '/attendance/check-in',
    method: 'post',
    data,
  })
}

/** 考勤记录列表 */
export function getAttendanceList(params) {
  return request({
    url: '/attendance/records',
    method: 'get',
    params,
  })
}

/** 请假申请 */
export function applyLeave(data) {
  return request({
    url: '/attendance/leave',
    method: 'post',
    data,
  })
}

/** 我的请假列表 */
export function getLeaveList(params) {
  return request({
    url: '/attendance/leave/list',
    method: 'get',
    params,
  })
}

/** 撤回请假申请 */
export function cancelLeave(id) {
  return request({
    url: `/attendance/leave/${id}/cancel`,
    method: 'put',
  })
}

/** 教师待审批请假列表 */
export function getPendingLeaveList(params) {
  return request({
    url: '/attendance/leave/pending',
    method: 'get',
    params,
  })
}

/** 考勤管理列表（管理员） */
export function getAttendanceManageList(params) {
  return request({
    url: '/attendance/manage',
    method: 'get',
    params,
  })
}

/** 审批请假 */
export function approveLeave(id, data) {
  return request({
    url: `/attendance/leave/${id}/approve`,
    method: 'put',
    data,
  })
}

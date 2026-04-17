import request from '@/utils/request'

export function getStudentSchedule(params) {
  return request({
    url: '/course/student/schedule',
    method: 'get',
    params,
  })
}

export function getTeacherSchedule(params) {
  return request({
    url: '/course/teacher/schedule',
    method: 'get',
    params,
  })
}

export function getStudentCourseOptions(params) {
  return request({
    url: '/course/student/options',
    method: 'get',
    params,
  })
}

export function getStudentLeaveCourseOptions(params) {
  return request({
    url: '/course/student/leave-options',
    method: 'get',
    params,
  })
}

export function getTeacherCourseOptions() {
  return request({
    url: '/course/teacher/options',
    method: 'get',
  })
}

export function getTeacherAttendanceList(params) {
  return request({
    url: '/course/attendance/teacher/list',
    method: 'get',
    params,
  })
}

export function getAdminCourseList(params) {
  return request({
    url: '/course/manage/list',
    method: 'get',
    params,
  })
}

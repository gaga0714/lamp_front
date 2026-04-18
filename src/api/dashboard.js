import request from '@/utils/request'

/** 工作台统计 */
export function getDashboardStats() {
  return request({
    url: '/dashboard/stats',
    method: 'get',
  })
}

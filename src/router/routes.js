export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: { title: '登录', layout: 'blank', noAuth: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/login/RegisterView.vue'),
    meta: { title: '注册', layout: 'blank', noAuth: true },
  },
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: '工作台', icon: 'Odometer' },
      },
      // 考勤
      {
        path: 'course/student/schedule',
        name: 'StudentSchedule',
        component: () => import('@/views/course/StudentScheduleView.vue'),
        meta: { title: '我的课表', icon: 'Memo', roles: ['student'] },
      },
      {
        path: 'course/teacher/schedule',
        name: 'TeacherSchedule',
        component: () => import('@/views/course/TeacherScheduleView.vue'),
        meta: { title: '我的授课', icon: 'Reading', roles: ['teacher'] },
      },
      {
        path: 'attendance/check-in',
        name: 'AttendanceCheckIn',
        component: () => import('@/views/attendance/CheckInView.vue'),
        meta: { title: '课程签到', icon: 'Calendar', roles: ['student'] },
      },
      {
        path: 'attendance/records',
        name: 'AttendanceRecords',
        component: () => import('@/views/attendance/RecordsView.vue'),
        meta: { title: '课程考勤', icon: 'List', roles: ['student'] },
      },
      {
        path: 'attendance/leave/apply',
        name: 'LeaveApply',
        component: () => import('@/views/attendance/LeaveApplyView.vue'),
        meta: { title: '课程请假', icon: 'EditPen', roles: ['student'] },
      },
      {
        path: 'attendance/leave/list',
        name: 'LeaveList',
        component: () => import('@/views/attendance/LeaveListView.vue'),
        meta: { title: '我的请假', icon: 'Document', roles: ['student'] },
      },
      {
        path: 'attendance/leave/approve',
        name: 'LeaveApprove',
        component: () => import('@/views/attendance/LeaveApproveView.vue'),
        meta: { title: '请假审批', icon: 'CircleCheck', roles: ['teacher'] },
      },
      {
        path: 'attendance/course/manage',
        name: 'CourseAttendanceManage',
        component: () => import('@/views/attendance/CourseManageView.vue'),
        meta: { title: '课程考勤管理', icon: 'DataAnalysis', roles: ['teacher'] },
      },
      {
        path: 'attendance/manage',
        name: 'AttendanceManage',
        component: () => import('@/views/attendance/ManageView.vue'),
        meta: { title: '考勤总览', icon: 'Setting', roles: ['admin'] },
      },
      {
        path: 'course/manage',
        name: 'CourseManage',
        component: () => import('@/views/course/CourseManageView.vue'),
        meta: { title: '课表管理', icon: 'Collection', roles: ['admin'] },
      },
      // 实验室预约
      {
        path: 'lab/list',
        name: 'LabList',
        component: () => import('@/views/lab/LabListView.vue'),
        meta: { title: '实验室列表', icon: 'OfficeBuilding' },
      },
      {
        path: 'lab/detail/:id',
        name: 'LabDetail',
        component: () => import('@/views/lab/LabDetailView.vue'),
        meta: { title: '实验室详情', hideMenu: true },
      },
      {
        path: 'lab/book',
        name: 'LabBook',
        component: () => import('@/views/lab/LabBookView.vue'),
        meta: { title: '预约实验室', icon: 'Calendar', hideMenu: true, roles: ['student', 'teacher'] },
      },
      {
        path: 'lab/my-bookings',
        name: 'MyBookings',
        component: () => import('@/views/lab/MyBookingsView.vue'),
        meta: { title: '我的预约', icon: 'Tickets', roles: ['student', 'teacher'] },
      },
      {
        path: 'lab/approve',
        name: 'LabApprove',
        component: () => import('@/views/lab/LabApproveView.vue'),
        meta: { title: '预约审批', icon: 'CircleCheck', roles: ['admin'] },
      },
      {
        path: 'lab/usage-stats',
        name: 'LabUsageStats',
        component: () => import('@/views/lab/LabUsageStatsView.vue'),
        meta: { title: '实验室使用统计', icon: 'DataAnalysis', roles: ['admin'] },
      },
      {
        path: 'lab/manage',
        name: 'LabManage',
        component: () => import('@/views/lab/LabManageView.vue'),
        meta: { title: '实验室管理', icon: 'Setting', roles: ['admin'] },
      },
      // 个人中心
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/ProfileView.vue'),
        meta: { title: '个人资料', icon: 'User' },
      },
      {
        path: 'profile/password',
        name: 'Password',
        component: () => import('@/views/profile/PasswordView.vue'),
        meta: { title: '修改密码', icon: 'Lock', hideMenu: true },
      },
      // 管理后台
      {
        path: 'admin/users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/UsersView.vue'),
        meta: { title: '用户管理', icon: 'UserFilled', roles: ['admin'] },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/NotFoundView.vue'),
    meta: { title: '404', layout: 'blank', noAuth: true },
  },
]

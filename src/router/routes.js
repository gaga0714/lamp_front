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
        path: 'attendance/check-in',
        name: 'AttendanceCheckIn',
        component: () => import('@/views/attendance/CheckInView.vue'),
        meta: { title: '考勤签到', icon: 'Calendar' },
      },
      {
        path: 'attendance/records',
        name: 'AttendanceRecords',
        component: () => import('@/views/attendance/RecordsView.vue'),
        meta: { title: '考勤记录', icon: 'List' },
      },
      {
        path: 'attendance/leave/apply',
        name: 'LeaveApply',
        component: () => import('@/views/attendance/LeaveApplyView.vue'),
        meta: { title: '请假申请', icon: 'EditPen' },
      },
      {
        path: 'attendance/leave/list',
        name: 'LeaveList',
        component: () => import('@/views/attendance/LeaveListView.vue'),
        meta: { title: '我的请假', icon: 'Document' },
      },
      {
        path: 'attendance/manage',
        name: 'AttendanceManage',
        component: () => import('@/views/attendance/ManageView.vue'),
        meta: { title: '考勤管理', icon: 'Setting', roles: ['teacher', 'admin'] },
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
        meta: { title: '预约实验室', icon: 'Calendar', hideMenu: true },
      },
      {
        path: 'lab/my-bookings',
        name: 'MyBookings',
        component: () => import('@/views/lab/MyBookingsView.vue'),
        meta: { title: '我的预约', icon: 'Tickets' },
      },
      {
        path: 'lab/approve',
        name: 'LabApprove',
        component: () => import('@/views/lab/LabApproveView.vue'),
        meta: { title: '预约审批', icon: 'CircleCheck', roles: ['admin'] },
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
      {
        path: 'admin/lab',
        name: 'AdminLab',
        component: () => import('@/views/admin/LabManageView.vue'),
        meta: { title: '实验室管理', icon: 'OfficeBuilding', roles: ['admin'] },
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

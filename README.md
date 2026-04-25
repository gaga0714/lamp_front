# 研究生考勤及实验室预约系统前端

基于 `Vue 3 + Vite + Element Plus + Vue Router + Pinia + Axios` 的前端项目。

当前代码已按 3 个业务角色收敛：
- `student`：研究生
- `teacher`：教师
- `admin`：实验室管理员

## 当前功能

### 通用
- 登录
- 注册
- 工作台
- 个人资料
- 修改密码

### 学生端
- 我的课表
- 课程签到
- 课程考勤
- 课程请假
- 我的请假
- 实验室列表
- 实验室预约
- 我的预约

### 教师端
- 我的授课
- 课程考勤管理
- 请假审批
- 实验室列表
- 实验室预约
- 我的预约

### 实验室管理员端
- 实验室列表
- 预约审批
- 实验室管理
- 实验室使用统计

说明：当前前端已经移除了实验室管理员的 `课表管理`、`考勤总览`、`用户管理` 等入口。

## 项目结构

```text
lamp_front/
├── public/
├── src/
│   ├── api/              # 接口封装
│   ├── assets/           # 样式与静态资源
│   ├── layouts/          # 页面布局
│   ├── router/           # 路由配置与守卫
│   ├── stores/           # Pinia 状态
│   ├── utils/            # 请求封装、认证工具、格式化工具
│   ├── views/
│   │   ├── attendance/   # 课程签到、考勤、请假、教师管理
│   │   ├── course/       # 学生课表、教师授课
│   │   ├── dashboard/    # 工作台
│   │   ├── error/        # 404
│   │   ├── lab/          # 实验室列表、预约、审批、管理、统计
│   │   ├── login/        # 登录、注册
│   │   └── profile/      # 个人资料、修改密码
│   ├── App.vue
│   └── main.js
├── package.json
├── vite.config.js
└── README.md
```

## 关键路由现状

当前实际菜单与权限主要定义在 `src/router/routes.js`：

### `student`
- `/course/student/schedule`
- `/attendance/check-in`
- `/attendance/records`
- `/attendance/leave/apply`
- `/attendance/leave/list`
- `/lab/my-bookings`

### `teacher`
- `/course/teacher/schedule`
- `/attendance/course/manage`
- `/attendance/leave/approve`
- `/lab/my-bookings`

### `admin`
- `/lab/approve`
- `/lab/usage-stats`
- `/lab/manage`

### 所有登录角色可访问
- `/dashboard`
- `/lab/list`
- `/profile`
- `/profile/password`

## 工作台现状

`src/views/dashboard/DashboardView.vue` 会根据角色显示不同快捷入口和统计卡片：

- `student`：课程与个人预约相关
- `teacher`：授课、请假审批、个人预约相关
- `admin`：预约审批、实验室管理、实验室使用统计、实验室列表

其中 `admin` 工作台已经完全改成实验室视角。

## 开发运行

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
npm run dev
```

默认地址：
- 前端：`http://localhost:5173`
- 开发代理：`/api -> http://localhost:8080`

### 生产构建

```bash
npm run build
```

### 本地预览构建结果

```bash
npm run preview
```

## 后端联调说明

当前 `vite.config.js` 中的代理配置为：

```js
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

因此本地开发时需要先启动后端项目，并确保后端提供 `/api` 前缀接口。

## 权限与菜单说明

- 路由通过 `meta.roles` 控制页面可见性和访问权限。
- 左侧菜单会根据当前登录角色自动过滤。
- `lab/my-bookings` 仅对 `student`、`teacher` 开放。
- 当前不存在前端可见的“用户管理”页面入口。

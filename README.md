# 研究生考勤及实验室预约系统 - 前端

基于 B/S 架构的研究生考勤及实验室预约系统前端项目，技术栈：Vue 3 + Vite + Element Plus + Vue Router + Pinia + Axios。

## 项目结构

```
lamp_front/
├── public/                 # 静态资源
│   └── favicon.svg
├── src/
│   ├── api/                # 接口封装
│   │   ├── auth.js
│   │   ├── attendance.js
│   │   ├── lab.js
│   │   └── user.js
│   ├── assets/             # 资源与全局样式
│   │   └── styles/
│   │       └── main.scss
│   ├── layouts/            # 布局
│   │   ├── DefaultLayout.vue   # 主布局（侧栏+顶栏+内容区）
│   │   └── BlankLayout.vue     # 空白布局（登录等）
│   ├── router/
│   │   ├── index.js        # 路由实例与守卫
│   │   └── routes.js       # 路由配置
│   ├── stores/             # Pinia 状态
│   │   └── user.js
│   ├── utils/
│   │   ├── auth.js         # Token/用户本地存储
│   │   └── request.js      # Axios 封装
│   ├── views/              # 页面
│   │   ├── login/          # 登录、注册
│   │   ├── dashboard/      # 工作台
│   │   ├── attendance/     # 考勤（签到、记录、请假、管理）
│   │   ├── lab/            # 实验室（列表、详情、预约、我的预约、审批、管理）
│   │   ├── profile/        # 个人资料、修改密码
│   │   ├── admin/          # 用户管理、实验室管理
│   │   └── error/          # 404
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
├── vite.config.js
├── jsconfig.json
└── README.md
```

## 功能模块

- **通用**：登录、注册、工作台
- **考勤**：考勤签到、考勤记录、请假申请、我的请假、考勤管理（教师/管理员）
- **实验室**：实验室列表、实验室详情、预约申请、我的预约、预约审批、实验室管理
- **个人**：个人资料、修改密码
- **管理**：用户管理、实验室管理（管理员）

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务（默认 http://localhost:5173）
npm run dev

# 构建生产
npm run build

# 预览构建结果
npm run preview
```

## 后端接口

- 开发环境通过 Vite 代理将 `/api` 转发到 `http://localhost:8080`，可在 `vite.config.js` 中修改。
- 生产环境接口基础地址可通过环境变量 `VITE_API_BASE_URL` 配置。

## 角色与菜单

- 路由中通过 `meta.roles` 控制菜单与访问权限（如 `teacher`、`admin`、`labAdmin`）。
- 侧栏菜单根据当前用户角色过滤显示，需后端登录接口返回用户角色字段（如 `role`）。

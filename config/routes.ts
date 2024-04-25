export default [
  { name: '主页', path: '/', component: './Index', icon: 'smile' },
  {
    name: '接口详细信息',
    path: '/interface_info/:id',
    component: './InterfaceInfo',
    icon: 'smile',
    hideInMenu: true,
  },
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './User/Login' },
      { name: '注册', path: '/user/register', component: './User/Register' },
    ],
  },

  // { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/interface',
      },
      {
        name: '接口管理',
        icon: 'table',
        path: '/admin/interface',
        component: './Admin/InterfaceInfo',
      },
    ],
  },
  { path: '*', layout: false, component: './404' },
];

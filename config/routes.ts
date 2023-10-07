// @ts-ignore
import {MenuDataItem} from '@@/plugin-layout/runtime';

export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'myLogin',
            path: '/user/myLogin',
            component: './user/myLogin',
          },
        ],
      },
    ],
  },
  {
    path: '/home',
    name: '首页',
    icon: 'HomeOutlined',
    component: './home',
  }, {
    name: '管理',
    icon: 'CarOutlined',
    path: '/manage',
    routes: [
      {
        name: '个人信息',
        path: 'personalManage',
        component: './manage/personalManage',
      },
      {
        name: '图片展示',
        path: 'picManage',
        component: './manage/picManage',
      }, {
        name: '数据管理',
        path: 'dataManage',
        component: './manage/dataManage',
      },
    ],
  },
  {
    path: '/',
    redirect: './home',
  },
  {
    component: './404',
  },
] as MenuDataItem[];

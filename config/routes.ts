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
  },
  {
    path: '/redux',
    name: 'redux学习',
    component: './redux',
  },
  {
    path: '/reactRedux',
    name: 'react-redux学习',
    component: './reactRedux',
  },
  {
    path: '/sass',
    name: 'sass学习',
    component: './sass',
  },
  {
    name: 'reactHooks学习',
    path: '/hookStudy',
    routes: [{
      name: 'hooksApi',
      path: 'hooksApi',
      component: './hookStudy/hooksApi',
    }]
  },

  {
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

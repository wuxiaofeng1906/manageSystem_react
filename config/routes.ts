﻿import {MenuDataItem} from "@@/plugin-layout/runtime";

export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/login',
          },
        ],
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './ListTableList',
  },
  {
    name: '开发者',
    icon: 'table',
    path: '/users/list',
    component: './dashboard/developer',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
] as MenuDataItem[] ;

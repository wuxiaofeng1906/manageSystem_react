import React from 'react';
import {Settings as LayoutSettings, PageLoading} from '@ant-design/pro-layout';
import {notification, message} from 'antd';
import {history} from 'umi';
import RightContent from '@/components/RightContent';
// import Footer from '@/components/Footer';
import {ResponseError} from 'umi-request';
import {ApolloClient, InMemoryCache} from '@apollo/client';
import {GqlClient} from '@/hooks';
import {queryCurrent} from './services/user';
import defaultSettings from '../config/defaultSettings';

/**
 * 获取用户信息比较慢的时候会展示一个 loading
 */
export const initialStateConfig = {
  loading: <PageLoading/>,
};

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: '/api/graphql',
  // headers: {"Authorization": `Bearer ${localStorage.getItem("accessId")}`},
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

const gqlClient = new GqlClient(apolloClient);

export async function getInitialState(): Promise<{
  settings?: LayoutSettings;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  gqlClient?: GqlClient<any>;
}> {
  const fetchUserInfo = async () => {
    try {
      // const currentUser = await queryCurrent();
      // return currentUser;

      // 读取缓存信息
      const myAuth: any = localStorage.getItem('userLogins');
      return JSON.parse(myAuth);

      //  return {
      //   access: "sys_admin",
      //   authority: "",
      //   avatar: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
      //   group: "superGroup",
      //   name: "444",
      //   userid: "test"
      // };
    } catch (error) {
      // history.push('/user/login');
      history.push('/user/myLogin');
    }
    return undefined;
  };

  // 如果是登录页面，不执行
  // if (history.location.pathname !== '/user/login') {
  if (history.location.pathname !== '/user/myLogin') {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
      gqlClient,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
    gqlClient,
  };
}

message.config({maxCount: 1});
export const layout = ({initialState}: any) => {
  return {
    rightContentRender: () => <RightContent/>,
    disableContentMargin: false,
    // footerRender: () => <Footer />,

    onPageChange: (param: any) => {

      // 当页面切换，或者改变时候触发
      // 这里可以清缓存
      // 清除公告里面的缓存(如果不是公告页面的话，则清除公告页面的缓存)
      const noticePage = ["/onlineSystem/announcementDetail", "/onlineSystem/PopupCard"];
      if (!noticePage.includes(param.pathname)) {
        localStorage.removeItem("first_noticeHeader");
        localStorage.removeItem("second_noticeHeader");
      }

      const {location} = history;
      // 如果没有登录，重定向到 login
      // if (!initialState?.currentUser && location.pathname !== '/user/login') {
      //   history.push('/user/login');
      // }

      if (!initialState?.currentUser && location.pathname !== '/user/myLogin') {
        history.push('/user/myLogin');
        // history.push('/welcomes');
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '请扫码登录!',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const {response} = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const {status, url} = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};

export const request = {
  errorHandler,
};

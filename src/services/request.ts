import type { RequestOptionsInit } from 'umi-request';
import { extend } from 'umi-request';
import { message } from 'antd';
import axios, { AxiosRequestConfig } from 'axios';
import { errorMessage } from '@/publicMethods/showMessages';

const errorHandler = (error: { response: Response; message: any }): Response => {
  // notification.destroy();
  // notification.error({
  //   message: '网络异常',
  //   description: '网络发生异常，请稍后重试',
  // });
  throw error.response || error;
};

const _request = extend({
  errorHandler, // 默认错误处理
  // credentials: 'include', // 默认请求是否带上cookie
});

const requestHeader = (url: string, options: any) => {
  const token = localStorage.getItem('accessId');
  let headers: any = { Accept: 'application/json' };
  if (token) {
    headers = { ...headers, Authorization: 'Bearer ' + token };
  }
  return {
    url,
    options: { ...options, headers: { ...options.headers, ...headers } },
  };
};

_request.interceptors.request.use((url, options) => {
  return requestHeader(url, options);
});

_request.interceptors.response.use((response) => {
  return response;
});

interface IOption extends RequestOptionsInit {
  dealRes?: boolean;
  warn?: string | boolean;
  forceLogin?: boolean;
  msg?: string | boolean; // 请求提示语
  localCache?: boolean; // 本地缓存
  [key: string]: any;
}
interface IAxios extends AxiosRequestConfig {
  msg?: boolean | string;
  warn?: boolean | string;
}

function request(url: string, ioptions: IOption = {}) {
  const { dealRes = true, warn = true, forceLogin = true, msg, localCache, ...options } = ioptions;
  let mRequest;
  if (localCache) mRequest = localCacheWrap(url, options);
  // 统一结构接口
  if (!mRequest) mRequest = _request(url, options);
  if (dealRes) mRequest = dealResWrap(mRequest, warn, forceLogin, msg);
  return mRequest;
}

function localCacheWrap(url: string, options: any) {
  if (typeof localStorage == 'undefined') return null;
  const separator = ':::';
  const exceed = 1000 * 60 * 60 * 24;
  const key = (options?.method || 'get') + '_' + url;
  const time = new Date().getTime();
  const cache = localStorage.getItem(key);
  if (cache) {
    const caches = cache.split(separator);
    if (+caches[0] + exceed > time) {
      return Promise.resolve(JSON.parse(caches[1]));
    } else {
      localStorage.removeItem(key);
    }
  }
  return _request(url, options).then((res: any) => {
    if (res && res?.code == 0) {
      localStorage.setItem(key, time + separator + JSON.stringify(res));
    }
    return res;
  });
}

function dealResWrap(mRequest: Promise<any>, warn: any, forceLogin: boolean, msg?: any) {
  return mRequest
    .then((res) => {
      if (res?.code !== 200) {
        if (warn) {
          if (warn === true) warn = '';
          message.warn(warn || res?.msg || '操作失败');
        }
        return Promise.reject(res);
      }
      if (msg) {
        message.info(msg === true ? res.msg : msg);
      }
      return res?.data;
    })
    .catch((e) => {
      return Promise.reject(e);
    });
}

export default request;

// 非统一结构接口
export const irregularRequest = async (url: string, options: IAxios) => {
  const opt = requestHeader(url, options);
  try {
    const res = await axios({
      url,
      ...options,
      headers: opt.options.headers,
      method: options.method ?? 'get',
    });
    return res.data?.data || res.data?.datas;
  } catch (error: any) {
    const errTip = JSON.parse(error.response.request.response);
    if (errTip.code == 403) {
      message.info('对不起，您无权操作');
    } else if (options.msg || options.warn)
      errorMessage(
        options.msg == true || options.warn == true
          ? errTip.message
          : options.msg || options.warn || '操作失败',
      );
    else if (errTip?.ok == false && errTip.code !== 200)
      errorMessage(
        errTip.message || errTip.msg || errTip?.datas?.[0]?.message || '操作失败，请刷新重试',
      );
    throw errTip;
  }
};

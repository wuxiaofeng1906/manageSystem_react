import type { RequestOptionsInit } from 'umi-request';
import { extend } from 'umi-request';
import { notification, message } from 'antd';

const errorHandler = (error: { response: Response; message: any }): Response => {
  // notification.destroy();
  // notification.error({
  //   message: '网络异常',
  //   description: '网络发生异常，请稍后重试',
  // });
  // eslint-disable-next-line @typescript-eslint/no-throw-literal
  throw error.response || error;
};

const _request = extend({
  errorHandler, // 默认错误处理
  // credentials: 'include', // 默认请求是否带上cookie
});

_request.interceptors.request.use((url, options) => {
  const token = localStorage.getItem('accessId');
  let headers: any = {
    // 'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) {
    headers = { ...headers, Authorization: 'Bearer ' + token };
  }
  return {
    url,
    options: { ...options, headers: { ...options.headers, ...headers } },
  };
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

function request(url: string, ioptions: IOption = {}, hasStandard = true) {
  const { dealRes = true, warn = true, forceLogin = true, msg, localCache, ...options } = ioptions;
  let mRequest;
  const resWrap = hasStandard ? dealResWrap : notStandardResWrap;
  if (localCache) mRequest = localCacheWrap(url, options);
  if (!mRequest) mRequest = _request(url, options);
  if (dealRes) mRequest = resWrap(mRequest, warn, forceLogin, msg);
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
          // eslint-disable-next-line no-param-reassign
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

function notStandardResWrap(mRequest: Promise<any>, warn: any, forceLogin: boolean, msg?: any) {
  return mRequest
    .then((res) => {
      if (res.ok == false) {
        if (warn) {
          // eslint-disable-next-line no-param-reassign
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
      if (e.status == 403) {
        message.info('对不起，您无权操作');
      } else message.info('操作失败');
      return Promise.reject(e);
    });
}

export default request;

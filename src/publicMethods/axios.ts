import axios from 'axios';
import {errorMessage} from "./showMessages";

const sys_accessToken = localStorage.getItem('accessId');
axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;

// axios中常见的get/delete请求，也称作query请求：
// get 请求
const axiosGet = async (url: string, queryData: any = {}) => {
  await axios.get(url, {params: queryData})
    .then((res: any) => {
      return res;
    })
    .catch((error: string) => {
      errorMessage(`异常信息:${error.toString()}`);
      return {};
    });
};

// delete 请求
const axiosDelete = async (url: string, queryData: any = {}) => {
  await axios.delete(url, {params: queryData})
    .then((res: any) => {
      return res;
    })
    .catch((error: string) => {
      errorMessage(`异常信息:${error.toString()}`);
      return {};
    });
};

// post
const axiosPost = async (url: string, bodyData: any = {}, queryData: any = {}) => {
  await axios.post(url, {data: bodyData}, {params: queryData})
    .then((res: any) => {
      return res;

    }).catch((error) => {
      errorMessage(`异常信息:${error.toString()}`);
      return {};
    });
};

// put
const axiosPut = async (url: string, bodyData: any = {}, queryData: any = {}) => {
  await axios.put(url, {data: bodyData}, {params: queryData})
    .then((res: any) => {
      return res;

    }).catch((error) => {
      errorMessage(`异常信息:${error.toString()}`);
      return {};
    });
};

export {axiosGet, axiosDelete, axiosPost, axiosPut}

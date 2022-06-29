import axios from 'axios';
import {errorMessage} from "./showMessages";

const sys_accessToken = localStorage.getItem('accessId');
axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;

// axios中常见的get/delete请求，也称作query请求：
// get 请求
const axiosGet = async (url: string, queryData: any = {}) => {

  let result: any = {};
  await axios.get(url, {params: queryData})
    .then((res: any) => {
      result = res.data.data;
    })
    .catch((error: string) => {
      if (error.toString().includes("403")) {
        errorMessage("您无操作权限！");
      } else {
        errorMessage(`异常信息:${error.toString()}`);
      }
    });

  return result;
};

const axiosGet_TJ = async (url: string, queryData: any = {}) => {

  let result: any = {};
  await axios.get(url, {params: queryData})
    .then((res: any) => {
      result = res.data;
    })
    .catch((error: string) => {
      if (error.toString().includes("403")) {
        errorMessage("您无操作权限！");
      } else {
        errorMessage(`异常信息:${error.toString()}`);
      }
    });

  return result;
};

// delete 请求
const axiosDelete = async (url: string, queryData: any = {}) => {
  // queryData 格式 ： {data: queryData}或者 {params: queryData}

  let result: any = {};
  await axios.delete(url, queryData)
    .then((res: any) => {
      result = res.data;
    })
    .catch((error: string) => {
      if (error.toString().includes("403")) {
        errorMessage("您无操作权限！");
      } else {
        errorMessage(`异常信息:${error.toString()}`);
      }
    });
  return result;
};


// post
const axiosPost = async (url: string, bodyData: any = {}, queryData: any = {}) => {
  let result: any = {};

  await axios.post(url, bodyData, {params: queryData})
    .then((res: any) => {
      result = res.data;
    }).catch((error) => {
      if (error.toString().includes("403")) {
        errorMessage("您无操作权限！");
      } else {
        errorMessage(`异常信息:${error.toString()}`);
      }
    });
  return result;
};

// put
const axiosPut = async (url: string, bodyData: any = {}, queryData: any = {}) => {
  let result: any = {};

  await axios.put(url, bodyData, {params: queryData})
    .then((res: any) => {
      result = res.data;
    }).catch((error) => {
      if (error.toString().includes("403")) {
        errorMessage("您无操作权限！");
      } else {
        errorMessage(`异常信息:${error.toString()}`);
      }
    });
  return result;
};

// patch
const axiosPatch = async (url: string, bodyData: any = {}) => {
  let result: any = {};
  await axios.patch(url, bodyData).then((res: any) => {
    result = res.data;
  }).catch((error) => {
    if (error.toString().includes("403")) {
      errorMessage("您无操作权限！");
    } else {
      errorMessage(`异常信息:${error.toString()}`);
    }
  });
  return result;
};

export {axiosGet, axiosDelete, axiosPost, axiosPut, axiosPatch,axiosGet_TJ}

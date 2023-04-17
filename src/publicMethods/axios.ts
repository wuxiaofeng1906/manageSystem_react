import axios, {Method} from 'axios';
import {errorMessage} from './showMessages';


const sys_accessToken = localStorage.getItem('accessId');
axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;
// 设置get请求头的Content-Type总是失效，后来发现原来是一般get请求不需要设置Content-Type
// 所以axios内部会自动删除掉,解决办法是给get方法添加data（写一个空值都行，不能不要）
interface IParams {
  methods: Method, // GET,POST,PUT,PATCH,DELETE
  url: string
  params: any,
  data: any
}

export const axiosCommon = async ({methods = "GET", url = "", params = {}, data = {}}: IParams) => {
  debugger
  let result: any = {};
  axios.request({
    method: methods,
    url: url,
    params: params,
    data: data,
    headers: {"contentType": "application/x-www-form-urlencoded",}
  }).then((res: any) => {
    debugger
    result = res.data.data;
  }).catch(async (error: any) => {
    debugger
    console.log(await error)
    if (error.toString().includes('403')) {
      errorMessage('您无操作权限！');
    } else {
      errorMessage(`异常信息:${error.toString()}`);
    }
  });

  return result;
};

// axios中常见的get/delete请求，也称作query请求：
// get 请求
const axiosGet = async (url: string, queryData: any = {}) => {
  let result: any = {};
  await axios
    .get(url, {params: queryData})
    .then((res: any) => {
      result = res.data.data;
    })
    .catch((error: string) => {
      if (error.toString().includes('403')) {
        errorMessage('您无操作权限！');
      } else {
        errorMessage(`异常信息:${error.toString()}`);
      }
    });

  return result;
};

const axiosGet_TJ = async (url: string, queryData: any = {}) => {
  let result: any = {};
  await axios
    .get(url, {params: queryData})
    .then((res: any) => {
      result = res.data;
    })
    .catch((error: string) => {
      if (error.toString().includes('403')) {
        errorMessage('您无操作权限！');
      } else {
        errorMessage(`异常信息:${error.toString()}`);
      }
    });

  return result;
};

const axiosGet_77Service = async (url: string, queryData: any = {}) => {
  // axios.defaults.headers.contentType = "application/json";
  let result: any = {};
  await axios.get(url,
    {
      params: queryData, data: {},
      headers: {"contentType": "application/json", "Authorization": ""}  // 备注：77服务的请求一定不能带token,否则会报权限问题
    })
    .then((res: any) => {
      result = res.data;
    }).catch((error: string) => {
      if (error.toString().includes('401')) {
        errorMessage('您无上传图片的权限！');
      } else {
        errorMessage(`异常信息:${error.toString()}`);
      }
    });

  return result;
};


// delete 请求
const axiosDelete = async (url: string, queryData: any = {}) => {
  // queryData 格式 ： {data: queryData}或者 {params: queryData},同时有data和params写：{data:{},params:{}}
  let result: any = {};
  await axios
    .delete(url, queryData)
    .then((res: any) => {
      result = res.data;
    })
    .catch((error: string) => {
      if (error.toString().includes('403')) {
        errorMessage('您无操作权限！');
      } else {
        errorMessage(`异常信息:${error.toString()}`);
      }
    });
  return result;
};

// post
const axiosPost = async (url: string, bodyData: any = {}, queryData: any = {}) => {
  let result: any = {};

  await axios
    .post(url, bodyData, {params: queryData})
    .then((res: any) => {
      result = res.data;
    })
    .catch((error) => {
      if (error.toString().includes('403')) {
        errorMessage('您无操作权限！');
      } else {
        errorMessage(`异常信息:${error.toString()}`);
      }
    });
  return result;
};

export const axiosPostTest = async (url: string) => {
  let result: any = {};

  await axios
    .post(url)
    .then((res: any) => {
      debugger
      result = res.data;
    }).catch(async (error: any) => {
      debugger
      const a = await error;

      console.log(a)
      if (error.toString().includes('403')) {
        errorMessage('您无操作权限！');
      } else {
        errorMessage(`异常信息:${error.toString()}`);
      }
    });
  return result;
};

const axiosPost_77Service = async (url: string, bodyData: any = {}, queryData: any = {}) => {
  let result: any = {};
  await axios
    .post(url, bodyData, {
      params: queryData,
      headers: {
        "contentType": "multipart/form-data; boundary=983285823331796075899474",
        "Content-Type": "multipart/form-data; boundary=983285823331796075899474",
        "Authorization": ""
      }
    })
    .then((res: any) => {
      result = res;
    })
    .catch((error) => {
      if (error.toString().includes('403')) {
        errorMessage('您无操作权限！');
      } else {
        errorMessage(`异常信息:${error.toString()}`);
      }
    });
  return result;
};

// put
const axiosPut = async (url: string, bodyData: any = {}, queryData: any = {}) => {
  let result: any = {};

  await axios
    .put(url, bodyData, {params: queryData})
    .then((res: any) => {
      result = res.data;
    })
    .catch((error) => {
      if (error.toString().includes('403')) {
        errorMessage('您无操作权限！');
      } else {
        errorMessage(`异常信息:${error.toString()}`);
      }
    });
  return result;
};

// patch
const axiosPatch = async (url: string, bodyData: any = {}) => {
  let result: any = {};
  await axios
    .patch(url, bodyData)
    .then((res: any) => {
      result = res.data;
    })
    .catch((error) => {
      if (error.toString().includes('403')) {
        errorMessage('您无操作权限！');
      } else {
        const errTip = JSON.parse(error.response.request.response);
        errorMessage(`异常信息:${errTip.message ?? ''}`);
      }
    });
  return result;
};

export {axiosGet, axiosDelete, axiosPost, axiosPut, axiosPatch, axiosGet_TJ, axiosGet_77Service, axiosPost_77Service};

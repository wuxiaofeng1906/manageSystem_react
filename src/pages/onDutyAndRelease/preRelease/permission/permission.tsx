import axios from "axios";
import dayjs from "dayjs";

const sys_accessToken = localStorage.getItem("accessId");
axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;

// 值班人员权限
const getDutyPersonPermission = async (authData: any) => {

  const data = {
    "dutyOrder": "1",
    "startAt": dayjs().startOf('week').add(1, 'day').format("YYYY-MM-DD"),
    "endAt": dayjs().endOf('week').add(1, 'day').format("YYYY-MM-DD"),
    "method": authData.method, // 请求类型
    "path": authData.path // 请求路径
  };

  const result = {
    flag: false,
    errorMessage: ""
  };
  await axios.post("/api/extra/support/auth/disperse", data)
    .then(function (res) {

      if (res.data.code === 200) {
        if (res.data.ok) {
          result.flag = res.data.ok;
        }
      }
    }).catch(function (error) {
      if (error.toString().indexOf("403") !== -1) {
        result.errorMessage = `您无权${authData.operate}！`;
      } else {
        result.errorMessage = `异常信息:${error.toString()}`;
      }
    });

  return result;

};

// 管理员权限
const getSystemPersonPermission = async (authData: any) => {

  const data = {
    "method": authData.method,
    "path": authData.path
  };
  const result = {
    flag: false,
    errorMessage: ""
  }
  await axios.post("/api/extra/support/auth/consistent", data)
    .then(function (res) {

      if (res.data.code === 200) {
        if (res.data.ok) {
          result.flag = res.data.ok;
        }
      }
    }).catch(function (error: string) {
      if (error.toString().indexOf("403") > -1) {
        result.errorMessage = `您无权${authData.operate}！`;
      } else {
        result.errorMessage = `异常信息:${error.toString()}`;
      }

    });

  return result;
};

export {getDutyPersonPermission, getSystemPersonPermission};

import axios from "axios";
import dayjs from "dayjs";

const sys_accessToken = localStorage.getItem("accessId");
axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;

const userLogins: any = localStorage.getItem("userLogins");
const usersInfo = JSON.parse(userLogins);


const getLockStatus = async (lockedId: string) => {
  const datas = {
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "param": lockedId
  };

  const result = {
    errMessage: "",
    data: {}
  };

  await axios.post("/api/verify/release/release_project", {params: datas})
    .then(function (res) {

      if (res.data.code === 200) {


        result.data = res.data.data;

      } else {
        result.errMessage = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      result.errMessage = `异常信息:${error.toString()}`;
    });

  return result;
};

const deleteLockStatus = async (lockedId: string) => {
  let errorMessage = "";

  const datas = {
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "param": lockedId
  };

  await axios.delete("/api/verify/release/release_branch", {data: datas})
    .then(function (res) {
      if (res.data.code !== 200) {
        errorMessage = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      errorMessage = `异常信息:${error.toString()}`;
    });

  return errorMessage;

};

export {getLockStatus, deleteLockStatus}

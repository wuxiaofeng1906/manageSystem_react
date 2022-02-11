import axios from "axios";

const sys_accessToken = localStorage.getItem("accessId");
axios.defaults.headers['Authorization'] = `Bearer ${sys_accessToken}`;

const updateGridContent = async (datas: object) => {

  let errorMessage = "";

  await axios.put("/api/project/kpi", datas)
    .then(function (res) {
      if (res.data.code !== 200) {
        errorMessage = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      if (error.toString().includes("403")) {
        errorMessage = `您无修改权限！`;
      } else {
        errorMessage = `异常信息:${error.toString()}`;
      }
    });

  return errorMessage;

};


const refreshProject = async (projectId: string) => {
  const returnValue = {
    errorMessage: "",
    flag: false
  };

  await axios.post("/api/project/system/file/pk/sync", {pid: projectId})
    .then(function (res) {

      if (res.data.ok === true) {
        returnValue.flag = true;
      } else {
        returnValue.errorMessage = `错误：${res.data.message}`;
      }
    }).catch(function (error) {
      if (error.toString().includes("403")) {
        returnValue.errorMessage = `您无刷新权限！`;
      } else {
        returnValue.errorMessage = `异常信息:${error.toString()}`;
      }
    });

  return returnValue;

};
export {updateGridContent, refreshProject};

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
      errorMessage = `异常信息:${error.toString()}`;
    });

  return errorMessage;

};

export {updateGridContent};

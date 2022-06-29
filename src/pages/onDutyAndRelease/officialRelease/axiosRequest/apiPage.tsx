import axios from "axios";
import {axiosGet, axiosPost, axiosPut, axiosDelete} from "@/publicMethods/axios";
import dayjs from "dayjs";
import {errorMessage} from "@/publicMethods/showMessages";
import {getCurrentUserInfo} from "@/publicMethods/authorityJudge";

const users = getCurrentUserInfo();

// 获取预发布编号
const getPreReleaseNum = async () => {
  // const result: any = {
  //   message: '',
  //   data: [],
  // };
  // await axios
  //   .get('/api/verify/release/release_num', {})
  //   .then(function (res) {
  //     if (res.data.code === 200) {
  //       result.data = res.data.data;
  //     } else {
  //       result.message = `错误：${res.data.msg}`;
  //     }
  //   })
  //   .catch(function (error) {
  //     result.message = `异常信息:${error.toString()}`;
  //   });
  //
  // return result;
  return axiosGet('/api/verify/release/release_num');
};

// 一键正式发布
const releaseOnline = async (onlineReleaseNum: string, releaseNums: string) => {
  const data = {
    "user_name": users.name,
    "user_id": users.userid,
    "ready_release_num": releaseNums.replaceAll("|", ","),
    "online_release_num": onlineReleaseNum
  };
  debugger;
  const result = await axiosPost("/api/verify/release/online", data);
  return result;

};

// 获取发布详情
const getDetails = async (newReleaseNum: string) => {
  const result = await axiosGet('/api/verify/release/online_detail', {online_release_num: newReleaseNum});
  return result;
};

// 判断有没有正式发布的列表未发布
const getOfficialReleaseDetails = async (releaseNums: string) => {

  // 首先需要先获取预发布编号
  const newReleaseNum = (await getPreReleaseNum())?.ready_release_num;
  if (!newReleaseNum) {
    return;
  }

  // 再调用 “一键正式发布”
  const releaseRt = await releaseOnline(newReleaseNum, releaseNums);
  if (releaseRt.code !== 200) {
    return;
  }

  // 最后再调用正式发布过程详情
  const details = await getDetails(newReleaseNum);
};

// 保存发布结果
const saveReleaseResult = async (onlineReleaseNum: string) => {
  // 取消发布跟其他发布结果所调用接口不是同一个

  const data = {
    "user_name": users.name,
    "user_id": users.userid,
    "online_release_num": onlineReleaseNum
  };
  const result = await axiosDelete("/api/verify/release/online", data);
  return result;
};
// 正式发布界面编辑
const editReleaseForm = async () => {

  const data = {
    "user_name": users.name,
    "user_id": users.userid,
    "ready_release_num": "string",
    "online_release_num": "string",
    "release_result": "unknown",
    "release_env": "string",
    "release_way": "unknown",
    "release_type": "online",
    "plan_release_time": "",
    "duty_num": "",
    "online_environment": "string",
    "online_release_name": "string"
  }

  const result = await axiosPut("/api/verify/release/online", data);
  return result;

};

// 发布结果自动化检查
const runAutoCheck = async () => {

  const data = [
    {
      "user_name": "string",
      "user_id": "string",
      "ignore_check": "yes",
      "check_time": "after",
      "check_type": "api",
      "check_result": "yes",
      "test_env": "string",
      "check_num": "string",
      "ready_release_num": "string"
    }
  ];
  axiosPost("/api/verify/release/automation", data);
};

// 自动化检查结果获取
const getAutoCheckResult = async () => {

  const data = {
    ready_release_num: "",
    release_time: ""
  }
  await axiosGet("/api/verify/release/automation", data)
};

export {getOfficialReleaseDetails, saveReleaseResult, editReleaseForm, runAutoCheck, getAutoCheckResult};

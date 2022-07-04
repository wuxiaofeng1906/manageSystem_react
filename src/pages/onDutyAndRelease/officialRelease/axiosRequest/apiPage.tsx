import {axiosGet, axiosPost, axiosPut, axiosDelete} from "@/publicMethods/axios";
import dayjs from "dayjs";
import {getCurrentUserInfo} from "@/publicMethods/authorityJudge";
import {Select} from "antd";
import React from "react";

const {Option} = Select;
const users = getCurrentUserInfo();

// 获取发布详情
const getDetails = async (newReleaseNum: string = "") => {
  const result = await axiosGet('/api/verify/release/online_detail', {online_release_num: newReleaseNum});
  return result;
};

// 判断有没有正式发布的列表未发布
const getOfficialReleaseDetails = async (releaseNums: string) => {

  // 判断是通过详情过来的还是通过新建过来的。
  if (!releaseNums) {  // 如果没有发布编号，则直接进入详情数据获取，不传入编号
    return await getDetails();
  }

  // 最后再调用正式发布过程详情
  return await getDetails(releaseNums);
};

// 获取上线集群环境
const getOnlineEnv = async () => {

  const envData = await axiosGet("/api/verify/release/environment");
  const nameOptions: any = [];
  if (envData) {
    const datas = envData;
    datas.forEach((envInfo: any) => {
      if (envInfo.online_environment_id !== "cn-northwest-global" && envInfo.online_environment_id !== "cn-northwest-1" && envInfo.online_environment_name !== "集群1-7" ) {  // 不需要展示global 和集群1
        nameOptions.push(
          <Option key={envInfo.online_environment_id} value={`${envInfo.online_environment_id}`}>
            {envInfo.online_environment_name}
          </Option>,
        );
      }
    });
  }
  return nameOptions;
};

// 保存发布结果
const cancleReleaseResult = async (onlineReleaseNum: string) => {

  // 取消发布跟其他发布结果所调用接口不是同一个
  const delData = {
    "user_name": users.name,
    "user_id": users.userid,
    "online_release_num": onlineReleaseNum
  };
  const result = await axiosDelete("/api/verify/release/online", {data: delData});
  return result;
};
// 正式发布界面编辑
const editReleaseForm = async (releaseInfo: any, otherCondition: any) => {
  debugger;

  let {relateDutyName, pulishTime} = releaseInfo;
  if (!relateDutyName) {
    relateDutyName = "";
  }

  if (!pulishTime) {
    pulishTime = "";
  }

  const data = {
    "user_name": users.name,
    "user_id": users.userid,
    "ready_release_num": otherCondition.grayReleaseNums.join(","),
    "online_release_num": otherCondition.onlineReleaseNum,  // 正式发布编号
    "release_result": otherCondition.releaseResult,  // 发布结果
    "release_env": otherCondition.releaseEnv, // 集群
    "release_way": releaseInfo.pulishMethod, // 发布方式
    "release_type": "online", // 发布类型
    "plan_release_time": pulishTime === "" ? "" : dayjs(pulishTime).format("YYYY-MM-DD HH:mm:ss"), // 计划发布时间
    "duty_num": relateDutyName, // 值班名单
    // "online_environment": "string",
    // "online_release_name": "string"  发布名称
  }

  const result = await axiosPut("/api/verify/release/online", data);
  return result;

};

// 发布结果自动化检查
const runAutoCheck = async (formData: any, releaseNum: string) => {

  // 上线前后检查: 打勾是yes，没打勾是no
  let after_ignore_check = 'no';
  if (formData.ignoreAfterCheck && (formData.ignoreAfterCheck).length > 0) {
    after_ignore_check = 'yes'
  }

  const data = [{
    "user_name": users.name,
    "user_id": users.userid,
    "ignore_check": after_ignore_check,
    "check_time": "after",
    "check_type": "ui",
    "check_result": "no",
    "ready_release_num": releaseNum,
    // "test_env": "string",
    // "check_num": "string",
  },
    {
      "user_name": users.name,
      "user_id": users.userid,
      "ignore_check": after_ignore_check,
      "check_time": "after",
      "check_type": "applet",
      "check_result": "no",
      "ready_release_num": releaseNum,
      // "test_env": "string", // 果果说不用传
      // "check_num": "string",
    }];

  if (after_ignore_check === "no" && (formData.checkResult).length > 0) {
    (formData.checkResult).forEach((ele: string) => {
      if (ele === "ui") {
        data[0].check_result = "yes";
      } else if (ele === "applet") {
        data[1].check_result = "yes";
      }
    });
  }

  return axiosPost("/api/verify/release/automation", data);
};

// 自动化检查结果获取
const getAutoCheckResult = async (readyReleaseNum: string) => {

  const data = {
    ready_release_num: readyReleaseNum,
    release_time: "online"
  }
  const result = await axiosGet("/api/verify/release/automation", data);
  return result;
};


const getOnlineAutoResult = async (releaseNum: string) => {

  const newData: any = await getAutoCheckResult(releaseNum);
  //  需要看后端的上线后自动化检查结果
  if (newData && newData.length > 0) {
    let ignore = "";
    let ui_rt = "";
    let ui_color = "";
    let app_rt = "";
    let app_color = "";
    newData.forEach((ele: any) => {
      if (ele.ignore_check === "yes") {
        ignore = "忽略检查"
      } else if (ele.check_type === "ui") {
        ui_rt = ele.check_result === "yes" ? "通过" : "不通过";
        ui_color = ele.check_result === "yes" ? "#2BF541" : "#8B4513";
      } else if (ele.check_type === "applet") {
        app_rt = ele.check_result === "yes" ? "通过" : "不通过";
        app_color = ele.check_result === "yes" ? "#2BF541" : "#8B4513";
      }
    });

    if (ignore === "忽略检查") {
      return <label style={{color: "blue"}}>忽略检查</label>
    }

    return <label>
      UI：<label style={{color: ui_color}}>{ui_rt}</label>；
      小程序：<label style={{color: app_color}}>{app_rt}</label>；
    </label>
  }

  return <label></label>;
};

export {
  getOfficialReleaseDetails,
  cancleReleaseResult,
  editReleaseForm,
  runAutoCheck,
  getOnlineAutoResult,
  getOnlineEnv
};

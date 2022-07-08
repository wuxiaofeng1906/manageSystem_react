import axios from "axios";
import {axiosDelete, axiosGet, axiosPost} from "@/publicMethods/axios";
import {errorMessage} from "@/publicMethods/showMessages";
import {getCurrentUserInfo} from "@/publicMethods/authorityJudge";

// const getGrayscaleListData = async (paramData: any) => {
//   const result: any = {
//     message: "",
//     data: []
//   };
//   await axios.get('/api/verify/release/release_list', {params: paramData})
//     .then(function (res) {
//       if (res.data.code === 200) {
//         result.data = res.data.data;
//       } else {
//         result.message = `错误：${res.data.msg}`;
//       }
//     }).catch(function (error) {
//       result.message = `异常信息:${error.toString()}`;
//     });
//
//   return result;
//
// };

// 灰度发布列表
const getGrayscaleListData = async (releaseMethod: string, startTime: string, endTime: string) => {
  debugger;

  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/gray', {
    params: {
      release_method: releaseMethod,
      release_start_time: startTime,
      release_end_time: endTime
    }
  })
    .then(function (res) {
      if (res.data.code === 200) {
        result.data = res.data.data;
      } else {
        result.message = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      result.message = `异常信息:${error.toString()}`;
    });

  return result;
};

// 正式发布列表
const getFormalListData = async (condition: any) => {
  debugger;

  const result: any = {
    message: "",
    data: []
  };

  const data = {
    release_start_time: condition.start,
    release_end_time: condition.end,
    project_id: condition.project,
    page: condition.page,
    page_size: condition.pageSize
  }
  await axios.get('/api/verify/release/online', {params: data})
    .then(function (res) {
      if (res.data.code === 200) {
        result.data = res.data.data.data;
      } else {
        result.message = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      result.message = `异常信息:${error.toString()}`;
    });

  return result;

};

// 判断有没有正式发布的列表未发布
const vertifyOnlineProjectExit = async (releaseMethod: string) => {
  let exitProjectNotRelease = false;
  await axios.get("/api/verify/release/online_app", {params: {release_type: releaseMethod}})
    .then(function (res) {
      if (res.data.code === 4001) {// 表示有正式发布的列表未发布
        exitProjectNotRelease = true;
      }
    }).catch(function (error) {
      errorMessage(`异常信息:${error.toString()}`);
    });

  return exitProjectNotRelease;
}


// 获取预发布编号
const getPreReleaseNum = async () => {
  return axiosGet('/api/verify/release/release_num');
};

// 一键正式发布
const releaseOnline = async (onlineReleaseNum: string, releaseNums: string, releaseType: string) => {
  const users = getCurrentUserInfo();
  const data = {
    "user_name": users.name,
    "user_id": users.userid,
    "ready_release_num": releaseNums.replaceAll("|", ","),
    "online_release_num": onlineReleaseNum,
    "release_type": releaseType
  };

  const result = await axiosPost("/api/verify/release/online", data);
  return result;
};

// 获取预发布详情，只有获取成功了才跳转页面
const getOnlineProocessDetails = async (releaseNums: any, releaseType: string) => {

  // 首先需要先获取预发布编号
  const newReleaseNum = (await getPreReleaseNum())?.ready_release_num;
  if (!newReleaseNum) {
    return "";
  }

  // 再调用 “一键正式发布”
  const releaseRt = await releaseOnline(newReleaseNum, releaseNums, releaseType);

  if (releaseRt.code !== 200) {
    if (releaseType === "gray") {
      errorMessage(`1级灰度发布生成失败：${releaseRt.msg}`);
    } else if (releaseType === "online") {
      errorMessage(`正式发布生成失败：${releaseRt.msg}`);
    } else {
      errorMessage(`错误：${releaseRt.msg}`);
    }

    return "";
  }

  return newReleaseNum;
};

// 删除预发布tab
const delGrayReleaseHistory = async (releaseNum: string) => {

  const users = getCurrentUserInfo();
  const datas = {
    user_name: users.name,
    user_id: users.userid,
    ready_release_num: releaseNum,
  };

  return await axiosDelete('/api/verify/release/release_detail', {data: datas})
  // await axios
  //   .delete('/api/verify/release/release_detail', { data: datas })
  //   .then(function (res) {
  //     if (res.data.code !== 200) {
  //       errorMessage = `错误：${res.data.msg}`;
  //     }
  //   })
  //   .catch(function (error) {
  //     errorMessage = `异常信息:${error.toString()}`;
  //   });
  //
  // return errorMessage;
};


export {
  getGrayscaleListData,
  getFormalListData,
  vertifyOnlineProjectExit,
  getOnlineProocessDetails,
  delGrayReleaseHistory
};

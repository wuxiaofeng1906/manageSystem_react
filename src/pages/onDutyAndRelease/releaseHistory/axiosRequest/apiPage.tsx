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

// 0级灰度发布列表
const getZeroGrayscaleListData = async () => {

  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/gray', {
    params: {
      // release_method: releaseMethod,
      release_start_time: "",
      release_end_time: ""
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

// 1级灰度发布列表
const getFirstGrayscaleListData = async () => {

  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/gray_one', {
    params: {
      // release_method: releaseMethod,
      release_start_time: "",
      release_end_time: ""
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

  const result: any = {
    message: "",
    data: []
  };

  const data = {
    release_start_time: `${condition.start} 00:00:00`,
    release_end_time: `${condition.end} 23:59:59`,
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
const delGrayReleaseHistory = async (releaseType: string, releaseInfo: any) => {
  // 如果是0级灰度发布，就调用删除接口
  const users = getCurrentUserInfo();
  if (releaseType === "zero") {
    const datas = {
      user_name: users.name,
      user_id: users.userid,
      ready_release_num: releaseInfo.ready_release_num,
    };

    return await axiosDelete('/api/verify/release/release_detail', {data: datas})
  } else {
    // 如果是1级灰度发布，就调用取消发布接口
    const delData = {
      "user_name": users.name,
      "user_id": users.userid,
      "release_gray_num": releaseInfo.release_gray_num
    };
    const result = await axiosDelete("/api/verify/release/gray_one", {data: delData});
    return result;
  }
};


export {
  getZeroGrayscaleListData,
  getFirstGrayscaleListData,
  getFormalListData,
  vertifyOnlineProjectExit,
  getOnlineProocessDetails,
  delGrayReleaseHistory,

};

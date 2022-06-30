import axios from "axios";
import {axiosGet} from "@/publicMethods/axios";
import dayjs from "dayjs";
import {errorMessage} from "@/publicMethods/showMessages";

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
const getGrayscaleListData = async (startTime: string, endTime: string) => {
  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/gray', {params: {release_start_time: startTime, release_end_time: endTime}})
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
    // release_start_time: condition.start,
    // release_end_time: condition.end,
    // project_id: condition.project,
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
const vertifyOnlineProjectExit = async () => {
  let exitProjectNotRelease = false;
  await axios.get("/api/verify/release/online_app")
    .then(function (res) {
      if (res.data.code === 4001) {// 表示有正式发布的列表未发布
        exitProjectNotRelease = true;
      }
    }).catch(function (error) {
      errorMessage(`异常信息:${error.toString()}`);
    });

  return exitProjectNotRelease;
}


export {getGrayscaleListData, getFormalListData, vertifyOnlineProjectExit};

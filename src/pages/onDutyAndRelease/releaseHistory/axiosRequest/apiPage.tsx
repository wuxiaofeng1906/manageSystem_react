import axios from "axios";
import dayjs from "dayjs";

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
    release_start_time: condition.start,
    release_end_time: condition.end,
    project_id: condition.project,
    page: condition.page,
    page_size: condition.pageSize
  }
  await axios.get('/api/verify/release/gray', {params: data})
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

export {getGrayscaleListData, getFormalListData};

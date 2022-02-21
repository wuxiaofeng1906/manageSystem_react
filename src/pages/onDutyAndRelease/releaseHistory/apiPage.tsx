import axios from "axios";

const getGrayscaleListData = async (paramData: any) => {
  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/release_list', {params: paramData})
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

export {getGrayscaleListData};

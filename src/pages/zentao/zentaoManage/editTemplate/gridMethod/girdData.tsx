import axios from "axios";

// 获取模板详情列表
const requestTemplateDetailsApi = async (tempID: string) => {
  let data: any = [];
  await axios.get('/api/verify/zentao/temp_detail', {params: {temp_id: tempID}})
    .then(function (res) {
      if (res.data.code === 200) {
        data = res.data.data;
      }
    })
    .catch(function (error) {
      console.log("模板详情获取失败", error)
    });

  return data;
};


const getTemplateDetails = async (tempId: string) => {
  const tempList = await requestTemplateDetailsApi(tempId);
  return tempList;
};

export {getTemplateDetails}

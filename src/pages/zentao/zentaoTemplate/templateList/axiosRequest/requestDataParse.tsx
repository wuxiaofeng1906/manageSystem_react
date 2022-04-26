import {requestTemplateListApi, requestDelTempleApi} from "./reauestApi";

// 获取模板列表
const getTemplateList = async () => {
  const tempList = await requestTemplateListApi();
  return tempList;

};

// 删除选中的模板
const deleteTemplate = async (tempId: string) => {
  const delData = await requestDelTempleApi(tempId);
  return delData;
};
export {getTemplateList, deleteTemplate}

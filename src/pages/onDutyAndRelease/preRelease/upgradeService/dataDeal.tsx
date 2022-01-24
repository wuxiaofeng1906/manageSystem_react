import {queryReleaseId} from "@/pages/onDutyAndRelease/preRelease/supplementFile/datas/axiosApi";

// 展示已部署ID
const showReleasedId = async (releasedData: any) => {

  const idArray: any = [];
  const idStrArray: any = [];

  // 查询id
  const IDs = (await queryReleaseId()).data;
  releasedData.forEach((ele: any) => {
    if (!idArray.includes(ele.deployment_id)) {
      idArray.push(ele.deployment_id);

      for (let i = 0; i < IDs.length; i += 1) {

        if (ele.deployment_id === (IDs[i].id).toString()) {
          idStrArray.push({
            "deployment_id": ele.deployment_id,
            "automation_check": IDs[i].automation_test,
            "service": IDs[i].service
          });
          break;
        }
      }
    }
  });


  return {idArray, idStrArray};
};

const alaDelteData = (oldIDArray: any, newIDArray: any) => {
   let deletedId = "";// 一次性一般只能删除一个

  // 如果被删完了
  if (oldIDArray.length === 1 && newIDArray.length === 0) {
    return oldIDArray[0].deployment_id;
  }
  for (let o_index = 0; o_index < oldIDArray.length; o_index += 1) {

    const oldID = oldIDArray[o_index];
    let includeFlag = false;
    for (let index = 0; index < newIDArray.length; index += 1) {

      const newID = newIDArray[index];
      if (oldID.deployment_id === newID.key) {
        includeFlag = true;
        break;
      } else {
        includeFlag = false;
      }

    }

    if (!includeFlag) {
      deletedId = oldID.deployment_id;
      break;
    }
  }

  return deletedId;
};
// 解析input框选择的ID，返回查询的id和需要呗删除的id
const alaReleasedChanged = (oldIDArray: any, newIDArray: any) => {

  const deletedData = alaDelteData(oldIDArray, newIDArray);

  // 查询的数据
  const queryArray: any = [];
  if (newIDArray && newIDArray.length > 0) {
    newIDArray.forEach((ele: any) => {
      if (JSON.stringify(ele) !== '{}') {
        queryArray.push({
          "deployment_id": ele.key,
          "automation_check": ele.automation_test,
          "service": (ele.service).split(",")
        });
      }
    });

  }

  return {queryArray, deletedData};
};
export {showReleasedId, alaReleasedChanged}

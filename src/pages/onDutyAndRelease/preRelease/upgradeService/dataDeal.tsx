import {queryReleaseId} from "@/pages/onDutyAndRelease/preRelease/supplementFile/datas/axiosApi";

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

export {showReleasedId}

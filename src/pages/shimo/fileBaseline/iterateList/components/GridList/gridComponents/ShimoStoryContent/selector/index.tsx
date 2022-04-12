import {axiosGet} from "@/publicMethods/axios";

const getTreeSelectData = async (myGuid: string = "", parentId: string = "", fileType: string) => {

  const datas = await axiosGet("/api/verify/shimo/shimo_file", {guid: myGuid, file_type: fileType});
  const treeData: any = [];
  if (datas && datas.length > 0) {
    datas.forEach((ele: any) => {
      treeData.push({
        title: ele.name,
        value: ele.guid,
        id: ele.guid,
        pId: parentId
      });
    });
  }

  return treeData;
};

export {getTreeSelectData};

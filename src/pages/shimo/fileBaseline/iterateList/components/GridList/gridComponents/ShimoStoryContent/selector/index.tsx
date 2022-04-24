import {axiosGet} from "@/publicMethods/axios";


const sortShiMoContent = (datas: any) => {
  if (!datas || datas.length === 0) {
    return [];
  }
  const newData = datas.sort((a: any, b: any) => {
    const rt = b["name"].localeCompare(a["name"]);
    return rt;
  });

  return newData;
}
const getTreeSelectData = async (myGuid: string = "", parentId: string = "", fileType: string) => {

  const datas = await axiosGet("/api/verify/shimo/shimo_file", {guid: myGuid, file_type: fileType});

  // 分数字和非数字
  const newArray = sortShiMoContent(datas);
  const treeData: any = [{
    title: "请选择",
    value: "empty",
    id: "empty",
    pId: -1
  }];
  if (newArray && newArray.length > 0) {
    newArray.forEach((ele: any) => {
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

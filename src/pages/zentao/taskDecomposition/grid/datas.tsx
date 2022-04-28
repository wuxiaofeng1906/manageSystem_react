import {axiosGet, axiosDelete, axiosPost, axiosPut} from "@/publicMethods/axios"

// 获取模板
const getTaskTemplate = async () => {
  const tempData = await axiosGet("/api/verify/sprint/temp_detail");

  const datas: any = [];
  // 默认生成四个模块,新增显示的ID列
  if (tempData && tempData.length) {
    tempData.forEach((ele: any, index: number) => {
      datas.push({
        ...ele,
        No: index + 1
      })
    });
  }

  return datas;
};

// 表格初始化数据展示
const getInitGridData = async () => {
  const tempDatas: any = await getTaskTemplate();
  // 默认显示4大块模块
  let girdData: any = [];
  let index = 1;
  while (index < 5) {
    index += 1;
    girdData = girdData.concat(tempDatas)
  }

  return girdData;
};

// 根据ID获取相关需求
const getStoryByStoryId = (allStoryInfo: any, storyId: any) => {

  const finalStoryInfo: any = [];
  storyId.forEach((ele: any) => {
    for (let i = 0; i < allStoryInfo.length; i += 1) {
      if (ele.toString() === (allStoryInfo[i].id).toString()) {
        finalStoryInfo.push(allStoryInfo[i]);
        break;
      }
    }
  });
  return finalStoryInfo;
};

// 根据选中的需求生成表格数据
const getGridDataByStory = async (storyId: any, queryInfo: any) => {
  const allStoryInfo = await axiosGet("/api/verify/sprint/demand", queryInfo);

  // 获取选中的需求信息
  let finalStoryInfo: any = [];
  if (storyId && storyId.length === 1 && storyId[0] === "全选") {
    //   如果storyInfo是"全部"选项,将全部的需求编号来创建任务。
    finalStoryInfo = [...allStoryInfo];
  } else {
    //   如果storyInfo是具体的id，则直接生成响应数据即可。
    finalStoryInfo = getStoryByStoryId(allStoryInfo, storyId);
  }

  // 获取模板
  const tempDatas: any = await getTaskTemplate();

  // 将需求信息替换到模板。
  let storyGridData: any = [];
  if (finalStoryInfo && finalStoryInfo.length > 0 && tempDatas && tempDatas.length > 0) {
    finalStoryInfo.forEach((story: any) => {
      tempDatas.forEach((template: any) => {

        let taskName = "";
        if (template.add_type === "add") {
          taskName = `【${story.name}】`;
        } else {
          const nameHead = (template.task_name).split("】")[0].toString();
          taskName = `${nameHead}】${story.name}`;
        }

        storyGridData.push({
          ...template,
          task_name: taskName,
          subtask_dev_id: story.id,
          subtask_dev_needs: story.name
        })
      });
    });
  }

// 看原本查询了多少个，如果少于4个，则需要拼接成4个块展示。
  let index = finalStoryInfo.length;
  while (index < 5) {
    index += 1;
    storyGridData = storyGridData.concat(tempDatas);
  }
  return storyGridData;
}
export {getInitGridData, getGridDataByStory};

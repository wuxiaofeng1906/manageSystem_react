import {axiosGet} from "@/publicMethods/axios";
import dayjs from "dayjs";

const userLogins: any = localStorage.getItem('userLogins');
const usersLoginInfo = JSON.parse(userLogins);

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
          subtask_dev_needs: story.name,
          assigned_person: usersLoginInfo.userid === "test" ? "ChenHuan" : usersLoginInfo.userid,
          plan_start: dayjs().format("YYYY-MM-DD"),
          plan_end: dayjs().format("YYYY-MM-DD"),
        })
      });
    });
  }

// 看原本查询了多少个，如果少于4个，则需要拼接成4个块展示。
  let index = finalStoryInfo.length;
  while (index < 4) {
    index += 1;
    storyGridData = storyGridData.concat(tempDatas);
  }
  return storyGridData;
}

// 获取父任务的id和值【这个方法跟禅道任务生成有一点不一样，所以不能用同一个】
const getParentEstimate = (tableData: any, currentRow: any) => {

  let parentIndex = -1;
  //  因为表格中有空白行，也占用了rowindex，所以需要减去对应的空白行
  const currentIndex = currentRow.rowIndex - Math.floor(currentRow.rowIndex / 5);

  // 往上找寻父任务并且相加子任务的值
  for (let index = currentIndex; index >= 0; index -= 1) {
    const rows = tableData[index];
    if (rows.add_type_name === "新增") {  // 确定父任务ID
      parentIndex = index;
      break;
    }
  }

  let parentValue = 0;
  // 相加所有子任务的值
  for (let index = parentIndex + 1; index < tableData.length; index += 1) {
    const rows = tableData[index];
    //  寻找到下一个下一个父任务时，就跳出循环，停止值的相加。
    if (rows.add_type_name === "新增") { //
      break;
    } else {
      parentValue = Number(rows.estimate) + parentValue;
    }
  }


  // 还要获取
  return {parentIndex, parentValue}

};


export {getInitGridData, getGridDataByStory, getParentEstimate};

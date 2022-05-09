import {axiosGet} from "@/publicMethods/axios";
import dayjs from "dayjs";

const userLogins: any = localStorage.getItem('userLogins');
const usersLoginInfo = JSON.parse(userLogins);

// 获取模板
const getTaskTemplate = async () => {
  const tempData = await axiosGet("/api/verify/sprint/temp_detail");
  return tempData;
};

// 要生成count个初始化块
const getEmptyRow = async (count: any) => {

  const tempDatas: any = await getTaskTemplate();
  // 默认显示4大块模块
  const girdData: any = [];
  let index = 0;
  while (index < count) {
    index += 1;
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    tempDatas.forEach((ele: any, num: number) => {
      girdData.push({
        ...ele,
        No: num + 1, // 固定的12345
        ids: `${index}${num}`// 用于区分初始化中相同行
      });
    });
  }

  return girdData;
};

const insertEmptyRows = (oraData: any) => {
  const result: any = [];
  if (oraData && oraData.length > 0) {
    oraData.forEach((ele: any, index: number) => {
      result.push({...ele});
      if (index % 5 === 4 && index !== oraData.length - 1) {
        result.push({
          No: 6,
          ids: `6_${index}`
        });
      }
    });
  }

  return result;
}
// 表格初始化数据展示
const getInitGridData = async () => {
  const datas = await getEmptyRow(4);
  // 默认显示4块
  return insertEmptyRows(datas);
};

// 根据ID获取相关需求
const getStoryByStoryId = async (queryInfo: any, storyId: any, perValueArray: any) => {
  const allStoryInfo = await axiosGet("/api/verify/sprint/demand", queryInfo);

  let finalStoryInfo: any = [];
  // 如果选择的是全选，则需要获取具体的ID
  if (storyId === "全选") {
    if (!perValueArray || perValueArray.length === 0) {
      finalStoryInfo = [...allStoryInfo];      //   如果storyInfo是"全部"选项,将全部的需求编号来创建任务。
    } else {
      //  如果之前的选择框有数据，则不再对之前的数据进行操作。获取新的需求ID即可
      allStoryInfo.forEach((story: any) => {
        if (perValueArray.indexOf(story.id) === -1) {
          finalStoryInfo.push(story);
        }
      });
    }

  } else {
    //   如果storyInfo是具体的id，则直接生成响应数据即可。
    for (let i = 0; i < allStoryInfo.length; i += 1) {
      if (storyId.toString() === (allStoryInfo[i].id).toString()) {
        finalStoryInfo.push(allStoryInfo[i]);
        break;
      }
    }
  }

  return finalStoryInfo;
};


// 根据选中的需求生成表格数据
const getGridDataByStory = async (storyId: any, perValueArray: any, queryInfo: any) => {
  // 获取选中的需求信息
  const finalStoryInfo = await getStoryByStoryId(queryInfo, storyId, perValueArray);
  // 获取模板
  const tempDatas: any = await getTaskTemplate();
  // 将需求信息替换到模板。
  const storyGridData: any = [];
  if (finalStoryInfo && finalStoryInfo.length > 0 && tempDatas && tempDatas.length > 0) {
    finalStoryInfo.forEach((story: any, index: number) => {
      tempDatas.forEach((template: any, num: number) => {
        let taskName = "";
        if (template.add_type === "add") {
          taskName = story.name;
        } else {
          const nameHead = (template.task_name).split("】")[0].toString();
          taskName = `${nameHead}】${story.name}`;
        }

        storyGridData.push({
          ...template,
          module: story.module === "" ? "/" : `/${story.module}`,
          task_name: taskName,
          subtask_dev_id: story.id,
          subtask_dev_needs: story.name,
          assigned_person: usersLoginInfo.userid === "test" ? "ChenHuan" : usersLoginInfo.userid,
          plan_start: dayjs().format("YYYY-MM-DD"),
          plan_end: dayjs().format("YYYY-MM-DD"),
          No: num + 1, // 固定的12345
          ids: `${index}${num}`// 用于区分初始化中相同行
        });
      });
    });
  }

  return storyGridData;
}

// 获取父任务的id和值【这个方法跟禅道任务生成有一点不一样，所以不能用同一个】
const getParentEstimate = (tableData: any, currentRow: any) => {

  let parentIndex = -1;
  const currentIndex = currentRow.rowIndex;
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
    } else if (rows.estimate || Number(rows.estimate) === 0) {
      parentValue = Number(rows.estimate) + parentValue;
    }
  }


  // 还要获取
  return {parentIndex, parentValue}

};

// 判断输入的任务名称是否符合规则 >【所属端】需求标题
const judgeTaskName = (params: any) => {
  const {oldValue, newValue} = params
  // 如果是父任务，则判断是不是【需求标题】
  if (params.data?.add_type === "add") {
    if (newValue.indexOf("【") === -1 || newValue.indexOf("】") === -1) {
      return "任务名称输入格式错误，正确格式为【XXXX】！";
    }
    return "";
  }
  // 如果是子任务，则也要判断所属端是否存在
  const taskHead = `${(oldValue.split("】"))[0]}】`;
  if (newValue.indexOf(taskHead) === -1) {
    return `任务名称输入格式错误，正确格式为${taskHead}XXX`;
  }
  return "";
}
export {getInitGridData, getGridDataByStory, getParentEstimate, getEmptyRow, insertEmptyRows, judgeTaskName};

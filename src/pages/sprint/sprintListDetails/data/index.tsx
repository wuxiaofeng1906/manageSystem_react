import type { GqlClient } from '@/hooks';
import { useQuery } from '@/hooks';
import React from 'react';
import { Select } from 'antd';
import { sortBy } from 'lodash';

const { Option } = Select;

// 计算不同类型的个数
const calTypeCount = (data: any) => {
  // 统计类型
  let bug = 0;
  let task = 0;
  let story = 0;
  let B_story = 0;

  // 统计阶段
  let wait = 0;
  let devloping = 0;
  let dev_finished = 0;
  let testing = 0;
  let test_finished = 0;
  let onlined = 0;

  // 测试是否确认
  let testConfirm_yes = 0;
  let testConfirm_no = 0;

  data.forEach((ele: any) => {
    const { category, stage, testConfirmed } = ele;
    // 获取统计类型的个数
    if (category === '1') {
      bug += 1;
    } else if (category === '2') {
      task += 1;
    } else if (category === '-3') {
      B_story += 1;
    } else if (category === '3') {
      story += 1;
    }

    // 获取统计阶段的个数
    switch (stage.toString()) {
      case '1': // stage = "未开始";
        wait += 1;
        break;
      case '2': // stage = "开发中";
        devloping += 1;
        break;
      case '3': // stage = "开发完";
        dev_finished += 1;
        break;
      case '5': // stage = "测试中";
        testing += 1;
        break;
      case '6': // stage = "TE测试环境已验过";  测试完
        test_finished += 1;
        break;
      case '7': // stage = "UED测试环境已验过"; 测试完
        test_finished += 1;
        break;
      case '12': // stage = "线上已验过"; 已上线
        onlined += 1;
        break;
      default:
        break;
    }

    //   测试确认
    if (testConfirmed === '1') {
      testConfirm_yes += 1;
    } else {
      testConfirm_no += 1;
    }
    // if (testConfirme === "0" || testConfirme === null || testConfirme === undefined) {
    //   return "否";
    // }
    // return "是";
  });
  return {
    bug,
    task,
    story,
    B_story,
    wait,
    devloping,
    dev_finished,
    testing,
    test_finished,
    onlined,
    testConfirm_yes,
    testConfirm_no,
  };
};

// 将是相关需求或者相关任务的编号显示刀所属需求或者所属任务对应列。
const showBelongItem = (data: any) => {
  const re_data: any = [];
  for (let index = 0; index < data.length; index += 1) {
    const details = data[index];
    // 对标题中有转义字符进行替换。
    if (details.title.includes('&quot;')) {
      details.title = details.title.replace(/&quot;/g, '"');
    }

    if (details.belongStory) {
      details.relatedStories = details.belongStory;
    }

    if (details.belongTask) {
      details.relatedTasks = details.belongTask;
    }
    re_data.push(details);
  }
  return re_data;
};

const addPositionData = (inStoryAndTask: any, oraData: any) => {
  inStoryAndTask.forEach((ele: any) => {
    const be_story = ele.belongStory;
    const be_task = ele.belongTask;

    for (let index = 0; index < oraData.length; index += 1) {
      const details = oraData[index];

      // 如果只是 需求 有值，并且禅道类型和禅道编号能对应，则添加到原始data上一个位置，然后break，否则会造成死循环
      if (be_story !== null && be_task === null) {
        if (
          ele.belongStory === details.ztNo &&
          (details.category === '3' || details.category === '-3')
        ) {
          // 如果对应的是需求
          oraData.splice(index + 1, 0, ele);
          break;
        }
      }

      // 如果只是 任务 有值，并且禅道类型和禅道编号能对应，则添加到原始data上一个位置，然后break，否则会造成死循环
      if (be_story === null && be_task !== null) {
        if (ele.belongTask === details.ztNo && details.category === '2') {
          // 如果对应的是任务
          oraData.splice(index + 1, 0, ele);
          break;
        }
      }

      // 如果 需求和任务 都有值，那么不需要判断禅道类型，只需要禅道编号能对应，则添加到原始data上一个位置，然后break，否则会造成死循环
      if (be_story !== null && be_task !== null) {
        if (ele.belongStory === details.ztNo) {
          // 如果对应的是需求
          oraData.splice(index + 1, 0, ele);
          break;
        }
      }
    }
  });

  return oraData;
};

const changeRowPosition = (data: any) => {
  const arrays: any = [];
  const inStoryAndTask = [];

  // 如果所属需求或者任务不为空，则添加到新的数组里面
  for (let index = 0; index < data.length; index += 1) {
    if (data[index].belongStory || data[index].belongTask) {
      inStoryAndTask.push(data[index]);
    }

    // if (data[index].belongTask) {  // 如果所属任务不为空，则寻找相关任务bug
    //   inStoryAndTask.push(data[index]);
    // }

    // 上面两种情况都不满足时,直接添加数据
    if (!data[index].belongTask && !data[index].belongStory) {
      arrays.push(data[index]);
    }
  }

  return addPositionData(inStoryAndTask, arrays);
};

// 将未基线的数据放到最前面显示
const changeBaseLinePosition = (data: any) => {
  // const baseLineArray: any = [];
  // const noBaseLineArray: any = [];
  // data.forEach((ele: any) => {
  //   if (ele.baseline === '0') {
  //     noBaseLineArray.push(ele);
  //   } else {
  //     baseLineArray.push(ele);
  //   }
  // });

  // return noBaseLineArray.concat(baseLineArray);
  const result = sortBy(data, ['baseline', 'ztUnlinkedAt']); // 顺序:  超范围-> 禅道需求移除 -> 未超范围
  return result;
};

// bug转需求字段
const changeTypeColumns = (oraData: any) => {
  const changedArray: any = [];
  if (oraData && oraData.length > 0) {
    oraData.forEach((ele: any) => {
      const rows: any = { ...ele };
      if (ele.category === '3' && ele.fromBug !== 0) {
        rows.category = '-3'; // 表示为bug转需求
      }
      changedArray.push(rows);
    });
  }
  return changedArray;
};

// 过滤测试验证为是的数据
const filterTestConfirmed = (oraData: any) => {
  const changedArray: any = [];
  if (oraData && oraData.length > 0) {
    oraData.forEach((ele: any) => {
      if (ele.testConfirmed !== '1') {
        changedArray.push(ele);
      }
    });
  }
  return changedArray;
};

// 查询数据
const queryDevelopViews = async (
  client: GqlClient<object>,
  prjID: any,
  prjType: any,
  syncQuery: boolean = false,
  showTestConfirmFlag: boolean,
) => {
  // baseline: 0 超范围 1 未超 ztUnlinkedAt： 禅道需求移除时间 null 未移除
  const { data } = await client.query(`
      {
        proDetaiWithUser(project:${prjID},category:"${prjType}",order:ASC,doSync:${syncQuery}){
            planName
            id
            stage
            tester{
              id
              name
              tech
              dept{
                id
                name
              }
            }
            category
            ztNo
            title
            severity
            priority
            moduleName
            ztStatus
            assignedTo{
              id
              tech
              name
              dept{
                id
                name
              }
            }
            finishedBy{
              id
              tech
              name
              dept{
                id
                name
              }
            }
            closedBy
            hotUpdate
            dataUpdate
            interUpdate
            presetData
            testCheck
            scopeLimit
            publishEnv
            proposedTest
            uedName
            uedEnvCheck
            uedOnlineCheck
            memo
            source
            feedback
            expectTest
            submitTest
            activeDuration
            solveDuration
            verifyDuration
            closedDuration
            relatedBugs
            relatedTasks
            relatedStories
            createAt
            deadline
            baseline
            belongStory
            resolvedAt
            fromBug
            openedAt
            pageAdjust
            stageManual
            testConfirmed
            clearCache
            isDelay
            ztUnlinkedAt
            pushCode
            codeRevert
            notrevertMemo
          }
      }
  `);

  let oraData: any = data?.proDetaiWithUser;
  if (prjType === '') {
    const changedRow = changeRowPosition(data?.proDetaiWithUser); // 对数据进行想要的顺序排序(将需求相关的bug放到相关需求后面)
    oraData = changeBaseLinePosition(changedRow); //  将基线值为0的数据统一起来，放到页面最前面
  }

  // 需要对B_Story直接显示在类型中，而不是渲染看见
  oraData = changeTypeColumns(oraData);

  if (showTestConfirmFlag) {
    // 过滤掉测试验证为是数据
    oraData = filterTestConfirmed(oraData);
  }

  return { result: showBelongItem(oraData), resCount: calTypeCount(oraData) };
};

// 查询是否有重复数据
const queryRepeats = async (client: GqlClient<object>, prjName: string) => {
  const { data } = await client.query(`
      {
        proExist(name:"${prjName}"){
          ok
          data{
            id
            name
            type
            startAt
            testEnd
            testFinish
            expStage
            expOnline
            creator
            status
            createAt
            ztId
          }
          code
          message
        }
      }
  `);

  return data?.proExist;
};

// 获取部门数据
const getDeptMemner = async (client: GqlClient<object>, params: any) => {
  let deptMember = '';

  if (params === 'all') {
    deptMember = `
          {
            WxDeptUsers{
               id
              userName
            }
          }
      `;
  }
  if (params === 'UED') {
    deptMember = `
          {
            WxDeptUsers(deptNames:["UED"]){
               id
              userName
            }
          }
      `;
  }

  if (params === '测试') {
    deptMember = `
          {
            WxDeptUsers(deptNames:["测试","业务"], techs:[TEST]){
                id
                userName
              }
          }
      `;
  }
  // 全部的测试人员
  if (params === 'TEST') {
    deptMember = `{
            WxDeptUsers(techs:[TEST]){
                id
                userName
                ztName
              }
          }`;
  }

  const { data } = await client.query(deptMember);

  return data?.WxDeptUsers;
};

// 获取UED和所有人员，生成下拉框
const LoadCombobox = (params: any) => {
  const deptMan = [];
  let deptMember = '';

  if (params === 'all') {
    deptMember = `
          {
            WxDeptUsers{
               id
              userName
            }
          }
      `;
  }
  if (params === 'UED') {
    deptMember = `
          {
            WxDeptUsers(deptNames:["UED"]){
               id
              userName
            }
          }
      `;
  }

  if (params === '测试') {
    deptMember = `
          {
            WxDeptUsers(deptNames:["测试","业务"], techs:[TEST]){
                id
                userName
              }
          }
      `;
  }

  const { data: { WxDeptUsers = [] } = {} } = useQuery(deptMember);

  if (WxDeptUsers && WxDeptUsers.length > 0) {
    for (let index = 0; index < WxDeptUsers.length; index += 1) {
      deptMan.push(<Option value={WxDeptUsers[index].id}> {WxDeptUsers[index].userName}</Option>);
    }
  }

  return deptMan;
};

const LoadTesterCombobox = () => {
  const deptMan = [<Option value="NA">NA</Option>];
  const { data: { WxDeptUsers = [] } = {} } = useQuery(`
          {
            WxDeptUsers(deptNames:["测试","业务"], techs:[TEST]){
                id
                userName
              }
          }
      `);

  if (WxDeptUsers && WxDeptUsers.length > 0) {
    for (let index = 0; index < WxDeptUsers.length; index += 1) {
      deptMan.push(<Option value={WxDeptUsers[index].id}> {WxDeptUsers[index].userName}</Option>);
    }
  }

  return deptMan;
};

// 获取项目名称
const GetSprintProject = () => {
  const projectArray = [];

  const { data: { project = [] } = {} } = useQuery(`{
        project(range:{start:"", end:""},order:DESC,doSync:true){
        id
        name
      }
    }`);

  if (project && project.length > 0) {
    for (let index = 0; index < project.length; index += 1) {
      projectArray.push(
        <Option value={project[index].id.toString()}> {project[index].name}</Option>,
      );
    }
  }

  return projectArray;
};

export {
  queryDevelopViews,
  queryRepeats,
  getDeptMemner,
  LoadCombobox,
  LoadTesterCombobox,
  GetSprintProject,
  calTypeCount,
};

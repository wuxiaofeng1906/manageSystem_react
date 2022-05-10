import {GqlClient, useQuery} from "@/hooks";
import React from "react";
import {Select} from "antd";

const {Option} = Select;

// 计算不同类型的个数
const calTypeCount = (data: any) => {
  let bug = 0;
  let task = 0;
  let story = 0;
  let B_story = 0;

  data.forEach((ele: any) => {
    if (ele.category === "1") {
      bug += 1;
    } else if (ele.category === "2") {
      task += 1;
    } else if (ele.category === "3" && ele.fromBug) {
      B_story += 1;
    } else {
      story += 1;
    }

  });
  return {bug, task, story, B_story};
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
        if (ele.belongStory === details.ztNo && details.category === "3") { // 如果对应的是需求
          oraData.splice(index + 1, 0, ele);
          break;
        }
      }

      // 如果只是 任务 有值，并且禅道类型和禅道编号能对应，则添加到原始data上一个位置，然后break，否则会造成死循环
      if (be_story === null && be_task !== null) {
        if (ele.belongTask === details.ztNo && details.category === "2") { // 如果对应的是任务
          oraData.splice(index + 1, 0, ele);
          break;
        }
      }

      // 如果 需求和任务 都有值，那么不需要判断禅道类型，只需要禅道编号能对应，则添加到原始data上一个位置，然后break，否则会造成死循环
      if (be_story !== null && be_task !== null) {
        if (ele.belongStory === details.ztNo) { // 如果对应的是需求
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

  const baseLineArray: any = [];
  const noBaseLineArray: any = [];
  data.forEach((ele: any) => {
    if (ele.baseline === '0') {
      noBaseLineArray.push(ele);
    } else {
      baseLineArray.push(ele);
    }

  });

  return noBaseLineArray.concat(baseLineArray);

};

// 查询数据
const queryDevelopViews = async (client: GqlClient<object>, prjID: any, prjType: any, syncQuery: boolean = false) => {
debugger;
  // baseline
  const {data} = await client.query(`
      {
         proDetail(project:${prjID},category:"${prjType}",order:ASC,doSync:${syncQuery}){
            id
            stage
            tester
            category
            ztNo
            title
            severity
            planName
            priority
            moduleName
            ztStatus
            assignedTo
            finishedBy
            closedBy
            pageAdjust
            hotUpdate
            dataUpdate
            interUpdate
            presetData
            testCheck
            scopeLimit
            proposedTest
            publishEnv
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
            deadline
            belongStory
            belongTask
            baseline
            resolvedAt
            fromBug
            openedAt
          }
      }
  `);

  let oraData: any = data?.proDetail;
  if (prjType === "") {
    const changedRow = changeRowPosition(data?.proDetail); // 对数据进行想要的顺序排序(将需求相关的bug放到相关需求后面)
    oraData = changeBaseLinePosition(changedRow); //  将基线值为0的数据统一起来，放到页面最前面

  }

  return {result: showBelongItem(oraData), resCount: calTypeCount(oraData)};
};

// 查询是否有重复数据
const queryRepeats = async (client: GqlClient<object>, prjName: string) => {
  const {data} = await client.query(`
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
  let deptMember = "";

  if (params === "all") {

    deptMember = `
          {
            WxDeptUsers{
               id
              userName
            }
          }
      `;
  }
  if (params === "UED") {

    deptMember = `
          {
            WxDeptUsers(deptNames:["UED"]){
               id
              userName
            }
          }
      `;
  }

  if (params === "测试") {

    deptMember = `
          {
            WxDeptUsers(deptNames:["测试","业务"], techs:[TEST]){
                id
                userName
              }
          }
      `;
  }

  const {data} = await client.query(deptMember);

  return data?.WxDeptUsers;
};

// 获取UED和所有人员，生成下拉框
const LoadCombobox = (params: any) => {
  const deptMan = [];
  let deptMember = "";

  if (params === "all") {

    deptMember = `
          {
            WxDeptUsers{
               id
              userName
            }
          }
      `;
  }
  if (params === "UED") {

    deptMember = `
          {
            WxDeptUsers(deptNames:["UED"]){
               id
              userName
            }
          }
      `;
  }

  if (params === "测试") {

    deptMember = `
          {
            WxDeptUsers(deptNames:["测试","业务"], techs:[TEST]){
                id
                userName
              }
          }
      `;
  }

  const {data: {WxDeptUsers = []} = {}} = useQuery(deptMember);

  for (let index = 0; index < WxDeptUsers.length; index += 1) {
    deptMan.push(
      <Option value={WxDeptUsers[index].id}> {WxDeptUsers[index].userName}</Option>,
    );
  }
  return deptMan;

};

const LoadTesterCombobox = () => {
  const deptMan = [<Option value="NA">NA</Option>];
  const {data: {WxDeptUsers = []} = {}} = useQuery(`
          {
            WxDeptUsers(deptNames:["测试","业务"], techs:[TEST]){
                id
                userName
              }
          }
      `);

  for (let index = 0; index < WxDeptUsers.length; index += 1) {
    deptMan.push(
      <Option value={WxDeptUsers[index].id}> {WxDeptUsers[index].userName}</Option>,
    );
  }
  return deptMan;

};

// 获取项目名称
const GetSprintProject = () => {
  const projectArray = [];

  const {data: {project = []} = {}} = useQuery(`{
        project(range:{start:"", end:""},order:DESC,doSync:true){
        id
        name
      }
    }`);

  for (let index = 0; index < project.length; index += 1) {
    projectArray.push(
      <Option value={project[index].id.toString()}> {project[index].name}</Option>,
    );
  }
  return projectArray;
};


export {queryDevelopViews,queryRepeats,getDeptMemner,LoadCombobox,LoadTesterCombobox,GetSprintProject}

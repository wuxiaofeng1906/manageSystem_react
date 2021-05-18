import React, {useState, useEffect} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {Row, Col, Select, Card, Button} from 'antd';
import {Link} from 'umi';
import {SearchOutlined} from "@ant-design/icons";
import {history} from "@@/core/history";
import {GqlClient, useGqlClient} from "@/hooks";
import {useRequest} from "ahooks";
import {bugResultDeals, sp_hotResultDeals} from "./dataProcess";

const {Option} = Select;

// 全局变量
const sprintPrjInfo = {
  prjID: "",
  prjName: ""
};
const hotfixPrjInfo = {
  prjID: "",
  prjName: ""
};
const emergencyPrjInfo = {
  prjID: "",
  prjName: ""
};

const queryDashboardViews = async (client: GqlClient<object>) => {
  const {data} = await client.query(`
      {
        dashboardAll(endDay:"2021-05-13"){
          name,
          category,
          data{
            name
            data{
              name
              data{
                item
                value
              }
            }
          }
        }
      }
  `);
  return data?.dashboardAll;
  // return analyzeResult(data?.dashboardAll);
};

// 查询未关闭的项目，显示到下拉框中

const ProjectClassificate = (source: any) => {
  const data: any = {
    hotfix: [],
    sprint: [],
    emergency: []
  };

  source.forEach(function (project: any) {

    if (project.name.includes("hotfix")) {
      data.hotfix.push({
        "id": project.id,
        "name": project.name
      });

    } else if (project.name.includes("sprint")) {
      data.sprint.push({
        "id": project.id,
        "name": project.name
      });
    } else {
      data.emergency.push({
        "id": project.id,
        "name": project.name
      });
    }
  });

  return data;

};
const queryProjectViews = async (client: GqlClient<object>) => {
  const {data} = await client.query(`
      {
          project(name:null,category:null, range:{start:"", end:""},status:[wait,doing,suspended]){
          id
          name
        }
      }
  `);

  return ProjectClassificate(data?.project);
};
const projectLoad = (params: any) => {
  const project = [];
  for (let index = 0; index < params.length; index += 1) {
    project.push(
      <Option key={params[index].id} value={params[index].id}> {params[index].name}</Option>,
    );
  }
  return project;
};


const DashBoard: React.FC<any> = () => {
  const gqlClient = useGqlClient();

  const {data} = useRequest(() => queryDashboardViews(gqlClient));
  let sp_data = Object();
  let ho_data = Object();
  let em_data = Object();
  if (data !== undefined) {

    for (let index = 0; index < data.length; index += 1) {
      const details = data[index];
      if (details.category === "sprint") {
        sprintPrjInfo.prjName = details.name;
        sp_data = sp_hotResultDeals(details.data);

      } else if (details.category === "hotfix") {
        hotfixPrjInfo.prjName = details.name;
        ho_data = sp_hotResultDeals(details.data);

      } else {

        emergencyPrjInfo.prjName = details.name;
        em_data = bugResultDeals(details.data);

      }
    }

  }
  const [emergency, setEmergency] = useState({
    noAssign: -1,
    noDeadline: -1,
    prj_error: -1,
    over_area: -1,
    actived: -1,
    resolved: -1,
    vertified: -1,
    closed: -1,
    ac24: -1,
    ac1624: -1,
    ac0816: -1,
    ac08: -1,
    ve24: -1,
    ve1624: -1,
    ve0816: -1,
    ve08: -1
  });
  const [hotfix, setHotfix] = useState({
    // region 需求

    // 状态
    story_status_draft: -1,
    story_status_noTask: -1,
    story_status_lackTask: -1,
    story_status_noDeadline: -1,
    story_status_noAssign: -1,
    story_status_noBug: -1,
    story_status_noModify: -1,
    story_status_prj_error: -1,
    story_status_over_area: -1,

    story_status_delay: -1,
    story_status_wait: -1,
    story_status_doing: -1,
    story_status_done: -1,

    story_status_raseTestDelay: -1,
    story_status_raseTestWait: -1,
    story_status_raseTestDone: -1,

    story_status_testDelay: -1,
    story_status_testWait: -1,
    story_status_testDoing: -1,
    story_status_testDone: -1,

    // bug
    story_bug_noAssign: -1,
    story_bug_noDeadline: -1,
    story_bug_prj_error: -1,
    story_bug_over_area: -1,
    story_bug_actived: -1,
    story_bug_resolved: -1,
    story_bug_vertified: -1,
    story_bug_closed: -1,
    story_bug_ac24: -1,
    story_bug_ac1624: -1,
    story_bug_ac0816: -1,
    story_bug_ac08: -1,
    story_bug_ve24: -1,
    story_bug_ve1624: -1,
    story_bug_ve0816: -1,
    story_bug_ve08: -1,

    // endregion

    // region 任务

    // 状态
    task_status_noTask: -1,
    task_status_noDeadline: -1,
    task_status_noAssign: -1,
    task_status_noBug: -1,
    task_status_noModify: -1,
    task_status_prj_error: -1,
    task_status_over_area: -1,

    task_status_taskDelay: -1,
    task_status_wait: -1,
    task_status_doing: -1,
    task_status_done: -1,

    task_status_raseTestDelay: -1,
    task_status_raseTestWait: -1,
    task_status_raseTestDone: -1,

    task_status_testDelay: -1,
    task_status_testWait: -1,
    task_status_testDoing: -1,
    task_status_testDone: -1,

    // bug
    task_bug_noAssign: -1,
    task_bug_noDeadline: -1,
    task_bug_prj_error: -1,
    task_bug_over_area: -1,

    task_bug_actived: -1,
    task_bug_resolved: -1,
    task_bug_vertified: -1,
    task_bug_closed: -1,

    task_bug_ac24: -1,
    task_bug_ac1624: -1,
    task_bug_ac0816: -1,
    task_bug_ac08: -1,

    task_bug_ve24: -1,
    task_bug_ve1624: -1,
    task_bug_ve0816: -1,
    task_bug_ve08: -1,

    // endregion

    // region bug

    bug_noAssign: -1,
    bug_noDeadline: -1,
    bug_prj_error: -1,
    bug_over_area: -1,

    bug_actived: -1,
    bug_resolved: -1,
    bug_vertified: -1,
    bug_closed: -1,

    bug_ac24: -1,
    bug_ac1624: -1,
    bug_ac0816: -1,
    bug_ac08: -1,

    bug_ve24: -1,
    bug_ve1624: -1,
    bug_ve0816: -1,
    bug_ve08: -1
    // endregion
  });
  const [sprint, setsprint] = useState({
    // region 需求

    // 状态
    story_status_draft: -1,
    story_status_noTask: -1,
    story_status_lackTask: -1,
    story_status_noDeadline: -1,
    story_status_noAssign: -1,
    story_status_noBug: -1,
    story_status_noModify: -1,
    story_status_prj_error: -1,
    story_status_over_area: -1,

    story_status_delay: -1,
    story_status_wait: -1,
    story_status_doing: -1,
    story_status_done: -1,

    story_status_raseTestDelay: -1,
    story_status_raseTestWait: -1,
    story_status_raseTestDone: -1,

    story_status_testDelay: -1,
    story_status_testWait: -1,
    story_status_testDoing: -1,
    story_status_testDone: -1,

    // bug
    story_bug_noAssign: -1,
    story_bug_noDeadline: -1,
    story_bug_prj_error: -1,
    story_bug_over_area: -1,
    story_bug_actived: -1,
    story_bug_resolved: -1,
    story_bug_vertified: -1,
    story_bug_closed: -1,
    story_bug_ac24: -1,
    story_bug_ac1624: -1,
    story_bug_ac0816: -1,
    story_bug_ac08: -1,
    story_bug_ve24: -1,
    story_bug_ve1624: -1,
    story_bug_ve0816: -1,
    story_bug_ve08: -1,

    // endregion

    // region 任务

    // 状态
    task_status_noTask: -1,
    task_status_noDeadline: -1,
    task_status_noAssign: -1,
    task_status_noBug: -1,
    task_status_noModify: -1,
    task_status_prj_error: -1,
    task_status_over_area: -1,

    task_status_taskDelay: -1,
    task_status_wait: -1,
    task_status_doing: -1,
    task_status_done: -1,

    task_status_raseTestDelay: -1,
    task_status_raseTestWait: -1,
    task_status_raseTestDone: -1,

    task_status_testDelay: -1,
    task_status_testWait: -1,
    task_status_testDoing: -1,
    task_status_testDone: -1,

    // bug
    task_bug_noAssign: -1,
    task_bug_noDeadline: -1,
    task_bug_prj_error: -1,
    task_bug_over_area: -1,

    task_bug_actived: -1,
    task_bug_resolved: -1,
    task_bug_vertified: -1,
    task_bug_closed: -1,

    task_bug_ac24: -1,
    task_bug_ac1624: -1,
    task_bug_ac0816: -1,
    task_bug_ac08: -1,

    task_bug_ve24: -1,
    task_bug_ve1624: -1,
    task_bug_ve0816: -1,
    task_bug_ve08: -1,

    // endregion

    // region bug

    bug_noAssign: -1,
    bug_noDeadline: -1,
    bug_prj_error: -1,
    bug_over_area: -1,

    bug_actived: -1,
    bug_resolved: -1,
    bug_vertified: -1,
    bug_closed: -1,

    bug_ac24: -1,
    bug_ac1624: -1,
    bug_ac0816: -1,
    bug_ac08: -1,

    bug_ve24: -1,
    bug_ve1624: -1,
    bug_ve0816: -1,
    bug_ve08: -1
    // endregion
  });


  const project: any = useRequest(() => queryProjectViews(gqlClient)).data;
  let emergencySelect = Array();
  let hotfixSelect = Array();
  let sprintSelect = Array();
  if (project !== undefined) {
    hotfixSelect = projectLoad(project.hotfix);
    emergencySelect = projectLoad(project.emergency);
    sprintSelect = projectLoad(project.sprint);

  }
  // emergency赋值和下拉框事件
  const emergencyChanged = (value: string, other: any) => {
    emergencyPrjInfo.prjID = value;
    emergencyPrjInfo.prjName = other.key;
    setEmergency({
      noAssign: 1,
      noDeadline: 2,
      prj_error: 3,
      over_area: 4,
      actived: 5,
      resolved: 6,
      vertified: 7,
      closed: 8,
      ac24: 9,
      ac1624: 10,
      ac0816: 11,
      ac08: 12,
      ve24: 13,
      ve1624: 14,
      ve0816: 15,
      ve08: 16
    });
  };

  // hotfix赋值和下拉框事件
  const hotfixChanged = (value: string, other: any) => {
    hotfixPrjInfo.prjID = value;
    hotfixPrjInfo.prjName = other.key;
    setHotfix({

      // region 需求

      // 状态
      story_status_draft: 0,
      story_status_noTask: 0,
      story_status_lackTask: 0,
      story_status_noDeadline: 0,
      story_status_noAssign: 0,
      story_status_noBug: 0,
      story_status_noModify: 0,
      story_status_prj_error: 0,
      story_status_over_area: 0,

      story_status_delay: 0,
      story_status_wait: 0,
      story_status_doing: 0,
      story_status_done: 0,

      story_status_raseTestDelay: 0,
      story_status_raseTestWait: 0,
      story_status_raseTestDone: 0,

      story_status_testDelay: 0,
      story_status_testWait: 0,
      story_status_testDoing: 0,
      story_status_testDone: 0,

      // bug
      story_bug_noAssign: 0,
      story_bug_noDeadline: 0,
      story_bug_prj_error: 0,
      story_bug_over_area: 0,
      story_bug_actived: 0,
      story_bug_resolved: 0,
      story_bug_vertified: 0,
      story_bug_closed: 0,
      story_bug_ac24: 0,
      story_bug_ac1624: 0,
      story_bug_ac0816: 0,
      story_bug_ac08: 0,
      story_bug_ve24: 0,
      story_bug_ve1624: 0,
      story_bug_ve0816: 0,
      story_bug_ve08: 0,

      // endregion

      // region 任务

      // 状态
      task_status_noTask: 0,
      task_status_noDeadline: 0,
      task_status_noAssign: 0,
      task_status_noBug: 0,
      task_status_noModify: 0,
      task_status_prj_error: 0,
      task_status_over_area: 0,

      task_status_taskDelay: 0,
      task_status_wait: 0,
      task_status_doing: 0,
      task_status_done: 0,

      task_status_raseTestDelay: 0,
      task_status_raseTestWait: 0,
      task_status_raseTestDone: 0,

      task_status_testDelay: 0,
      task_status_testWait: 0,
      task_status_testDoing: 0,
      task_status_testDone: 0,

      // bug
      task_bug_noAssign: 0,
      task_bug_noDeadline: 0,
      task_bug_prj_error: 0,
      task_bug_over_area: 0,

      task_bug_actived: 0,
      task_bug_resolved: 0,
      task_bug_vertified: 0,
      task_bug_closed: 0,

      task_bug_ac24: 0,
      task_bug_ac1624: 0,
      task_bug_ac0816: 0,
      task_bug_ac08: 0,

      task_bug_ve24: 0,
      task_bug_ve1624: 0,
      task_bug_ve0816: 0,
      task_bug_ve08: 0,

      // endregion

      // region bug

      bug_noAssign: 0,
      bug_noDeadline: 0,
      bug_prj_error: 0,
      bug_over_area: 0,

      bug_actived: 0,
      bug_resolved: 0,
      bug_vertified: 0,
      bug_closed: 0,

      bug_ac24: 0,
      bug_ac1624: 0,
      bug_ac0816: 0,
      bug_ac08: 0,

      bug_ve24: 0,
      bug_ve1624: 0,
      bug_ve0816: 0,
      bug_ve08: 0
      // endregion
    });
  };

  // sprint赋值和下拉框事件
  const sprintChanged = (value: string, other: any) => {
    sprintPrjInfo.prjID = value;
    sprintPrjInfo.prjName = other.key;
    setsprint({

      // region 需求

      // 状态
      story_status_draft: 1,
      story_status_noTask: 0,
      story_status_lackTask: 0,
      story_status_noDeadline: 0,
      story_status_noAssign: 0,
      story_status_noBug: 0,
      story_status_noModify: 0,
      story_status_prj_error: 0,
      story_status_over_area: 0,

      story_status_delay: 0,
      story_status_wait: 0,
      story_status_doing: 0,
      story_status_done: 0,

      story_status_raseTestDelay: 0,
      story_status_raseTestWait: 0,
      story_status_raseTestDone: 0,

      story_status_testDelay: 0,
      story_status_testWait: 0,
      story_status_testDoing: 0,
      story_status_testDone: 0,

      // bug
      story_bug_noAssign: 0,
      story_bug_noDeadline: 0,
      story_bug_prj_error: 0,
      story_bug_over_area: 0,
      story_bug_actived: 0,
      story_bug_resolved: 0,
      story_bug_vertified: 0,
      story_bug_closed: 0,
      story_bug_ac24: 0,
      story_bug_ac1624: 0,
      story_bug_ac0816: 0,
      story_bug_ac08: 0,
      story_bug_ve24: 0,
      story_bug_ve1624: 0,
      story_bug_ve0816: 0,
      story_bug_ve08: 0,

      // endregion

      // region 任务

      // 状态
      task_status_noTask: 0,
      task_status_noDeadline: 0,
      task_status_noAssign: 0,
      task_status_noBug: 0,
      task_status_noModify: 0,
      task_status_prj_error: 0,
      task_status_over_area: 0,

      task_status_taskDelay: 0,
      task_status_wait: 0,
      task_status_doing: 0,
      task_status_done: 0,

      task_status_raseTestDelay: 0,
      task_status_raseTestWait: 0,
      task_status_raseTestDone: 0,

      task_status_testDelay: 0,
      task_status_testWait: 0,
      task_status_testDoing: 0,
      task_status_testDone: 0,

      // bug
      task_bug_noAssign: 0,
      task_bug_noDeadline: 0,
      task_bug_prj_error: 0,
      task_bug_over_area: 0,

      task_bug_actived: 0,
      task_bug_resolved: 0,
      task_bug_vertified: 0,
      task_bug_closed: 0,

      task_bug_ac24: 0,
      task_bug_ac1624: 0,
      task_bug_ac0816: 0,
      task_bug_ac08: 0,

      task_bug_ve24: 0,
      task_bug_ve1624: 0,
      task_bug_ve0816: 0,
      task_bug_ve08: 0,

      // endregion

      // region bug

      bug_noAssign: 0,
      bug_noDeadline: 0,
      bug_prj_error: 0,
      bug_over_area: 0,

      bug_actived: 0,
      bug_resolved: 0,
      bug_vertified: 0,
      bug_closed: 0,

      bug_ac24: 0,
      bug_ac1624: 0,
      bug_ac0816: 0,
      bug_ac08: 0,

      bug_ve24: 0,
      bug_ve1624: 0,
      bug_ve0816: 0,
      bug_ve08: 0
      // endregion
    });
  };

  const url = `projectid=${emergencyPrjInfo.prjID}&project=${emergencyPrjInfo.prjName}&kind=hotfix`;

  console.log("em_data", em_data, sp_data);

  useEffect(() => {

    // emergency 初始值赋值
    if (JSON.stringify(em_data) !== "{}" && emergency.noAssign === -1) {
      setEmergency({
        noAssign: em_data.Bug_no_assign,
        noDeadline: em_data.Bug_no_deadline,
        prj_error: 0,
        over_area: 0,
        actived: em_data.Bug_actived,
        resolved: em_data.Bug_resolved,
        vertified: em_data.Bug_verified,
        closed: em_data.Bug_closed,
        ac24: em_data.Bug_ac_24,
        ac1624: em_data.Bug_ac_1624,
        ac0816: em_data.Bug_ac_0816,
        ac08: em_data.Bug_ac_08,
        ve24: em_data.Bug_ve_24,
        ve1624: em_data.Bug_ve_1624,
        ve0816: em_data.Bug_ve_0816,
        ve08: em_data.Bug_ve_08
      });
    }

    // hotfix 初始值赋值
    if (JSON.stringify(ho_data) !== "{}" && hotfix.story_status_draft === -1) {

      // setHotfix({
      //   // region 需求
      //
      //   // 状态
      //   story_status_draft: ho_data.story.status.status_draft,
      //   story_status_noTask: ho_data.story.status.status_no_task,
      //   story_status_lackTask: ho_data.story.status.status_lack_task,
      //   story_status_noDeadline: ho_data.story.status.status_no_deadline,
      //   story_status_noAssign: ho_data.story.status.status_no_assign,
      //   story_status_noBug: ho_data.story.status.status_no_bug,
      //   story_status_noModify: ho_data.story.status.status_un_modify,
      //   story_status_prj_error: ho_data.story.status.status_proj_error,
      //   story_status_over_area: ho_data.story.status.status_over_area,
      //
      //   story_status_delay: ho_data.story.status.status_devtask_delay,
      //   story_status_wait: ho_data.story.status.status_dev_wait,
      //   story_status_doing: ho_data.story.status.status_developing,
      //   story_status_done: ho_data.story.status.status_dev_done,
      //
      //   story_status_raseTestDelay: ho_data.story.status.status_raisetest_delay,
      //   story_status_raseTestWait: ho_data.story.status.status_un_raisetest,
      //   story_status_raseTestDone: ho_data.story.status.status_raisetest_done,
      //
      //   story_status_testDelay: ho_data.story.status.status_testtask_delay,
      //   story_status_testWait: ho_data.story.status.status_test_wait,
      //   story_status_testDoing: ho_data.story.status.status_testing,
      //   story_status_testDone: ho_data.story.status.status_test_done,
      //
      //   // bug
      //   story_bug_noAssign: 0,
      //   story_bug_noDeadline: 0,
      //   story_bug_prj_error: 0,
      //   story_bug_over_area: 0,
      //   story_bug_actived: 0,
      //   story_bug_resolved: 0,
      //   story_bug_vertified: 0,
      //   story_bug_closed: 0,
      //   story_bug_ac24: 0,
      //   story_bug_ac1624: 0,
      //   story_bug_ac0816: 0,
      //   story_bug_ac08: 0,
      //   story_bug_ve24: 0,
      //   story_bug_ve1624: 0,
      //   story_bug_ve0816: 0,
      //   story_bug_ve08: 0,
      //
      //   // endregion
      //
      //   // region 任务
      //
      //   // 状态
      //   task_status_noTask: ho_data.task.status.status_no_task,
      //   task_status_noDeadline: ho_data.task.status.status_no_deadline,
      //   task_status_noAssign: ho_data.task.status.status_no_assign,
      //   task_status_noBug: ho_data.task.status.status_no_bug,
      //   task_status_noModify: ho_data.task.status.status_un_modify,
      //   task_status_prj_error: ho_data.task.status.status_proj_error,
      //   task_status_over_area: ho_data.task.status.status_over_area,
      //
      //   task_status_taskDelay: ho_data.task.status.status_devtask_delay,
      //   task_status_wait: ho_data.task.status.status_dev_wait,
      //   task_status_doing: ho_data.task.status.status_developing,
      //   task_status_done: ho_data.task.status.status_dev_done,
      //
      //   task_status_raseTestDelay: ho_data.task.status.status_raisetest_delay,
      //   task_status_raseTestWait: 0,
      //   task_status_raseTestDone: 0,
      //
      //   task_status_testDelay: ho_data.task.status.status_testtask_delay,
      //   task_status_testWait: ho_data.task.status.status_test_wait,
      //   task_status_testDoing: ho_data.task.status.status_testing,
      //   task_status_testDone: ho_data.task.status.status_test_done,
      //
      //   // bug
      //   task_bug_noAssign: ho_data.task.bug.Bug_no_assign,
      //   task_bug_noDeadline: ho_data.task.bug.Bug_no_deadline,
      //   task_bug_prj_error: ho_data.task.bug.Bug_proj_error,
      //   task_bug_over_area: ho_data.task.bug.Bug_over_area,
      //
      //   task_bug_actived: ho_data.task.bug.Bug_actived,
      //   task_bug_resolved: ho_data.task.bug.Bug_resolved,
      //   task_bug_vertified: ho_data.task.bug.Bug_verified,
      //   task_bug_closed: ho_data.task.bug.Bug_closed,
      //
      //   task_bug_ac24: 0,
      //   task_bug_ac1624: 0,
      //   task_bug_ac0816: 0,
      //   task_bug_ac08: 0,
      //
      //   task_bug_ve24: 0,
      //   task_bug_ve1624: 0,
      //   task_bug_ve0816: 0,
      //   task_bug_ve08: 0,
      //
      //   // endregion
      //
      //   // region bug
      //
      //   bug_noAssign: ho_data.bug.Bug_no_assign,
      //   bug_noDeadline: ho_data.bug.Bug_no_deadline,
      //   bug_prj_error: 0,
      //   bug_over_area: 0,
      //
      //   bug_actived: ho_data.bug.Bug_actived,
      //   bug_resolved: ho_data.bug.Bug_resolved,
      //   bug_vertified: ho_data.bug.Bug_verified,
      //   bug_closed: ho_data.Bug_closed,
      //
      //   bug_ac24: 0,
      //   bug_ac1624: 0,
      //   bug_ac0816: 0,
      //   bug_ac08: 0,
      //
      //   bug_ve24: 0,
      //   bug_ve1624: 0,
      //   bug_ve0816: 0,
      //   bug_ve08: 0
      //   // endregion
      // });
    }

    // sprint 初始值赋值
    if (JSON.stringify(sp_data) !== "{}" && sprint.story_status_draft === -1) {
      setsprint({
        // region 需求

        // 状态
        story_status_draft: sp_data.story.status.status_draft,
        story_status_noTask: sp_data.story.status.status_no_task,
        story_status_lackTask: sp_data.story.status.status_lack_task,
        story_status_noDeadline: sp_data.story.status.status_no_deadline,
        story_status_noAssign: sp_data.story.status.status_no_assign,
        story_status_noBug: sp_data.story.status.status_no_bug,
        story_status_noModify: sp_data.story.status.status_un_modify,
        story_status_prj_error: sp_data.story.status.status_proj_error,
        story_status_over_area: sp_data.story.status.status_over_area,

        story_status_delay: sp_data.story.status.status_devtask_delay,
        story_status_wait: sp_data.story.status.status_dev_wait,
        story_status_doing: sp_data.story.status.status_developing,
        story_status_done: sp_data.story.status.status_dev_done,

        story_status_raseTestDelay: sp_data.story.status.status_raisetest_delay,
        story_status_raseTestWait: sp_data.story.status.status_un_raisetest,
        story_status_raseTestDone: sp_data.story.status.status_raisetest_done,

        story_status_testDelay: sp_data.story.status.status_testtask_delay,
        story_status_testWait: sp_data.story.status.status_test_wait,
        story_status_testDoing: sp_data.story.status.status_testing,
        story_status_testDone: sp_data.story.status.status_test_done,

        // bug
        story_bug_noAssign: sp_data.story.bug.Bug_no_assign,
        story_bug_noDeadline: sp_data.story.bug.Bug_no_deadline,
        story_bug_prj_error: sp_data.story.bug.Bug_proj_error,
        story_bug_over_area: sp_data.story.bug.Bug_over_area,
        story_bug_actived: sp_data.story.bug.Bug_actived,
        story_bug_resolved: sp_data.story.bug.Bug_resolved,
        story_bug_vertified: sp_data.story.bug.Bug_verified,
        story_bug_closed: sp_data.story.bug.Bug_closed,
        story_bug_ac24: 0,
        story_bug_ac1624: 0,
        story_bug_ac0816: 0,
        story_bug_ac08: 0,
        story_bug_ve24: 0,
        story_bug_ve1624: 0,
        story_bug_ve0816: 0,
        story_bug_ve08: 0,

        // endregion

        // region 任务

        // 状态
        task_status_noTask: sp_data.task.status.status_no_task,
        task_status_noDeadline: sp_data.task.status.status_no_deadline,
        task_status_noAssign: sp_data.task.status.status_no_assign,
        task_status_noBug: sp_data.task.status.status_no_bug,
        task_status_noModify: sp_data.task.status.status_un_modify,
        task_status_prj_error: sp_data.task.status.status_proj_error,
        task_status_over_area: sp_data.task.status.status_over_area,

        task_status_taskDelay: sp_data.task.status.status_devtask_delay,
        task_status_wait: sp_data.task.status.status_dev_wait,
        task_status_doing: sp_data.task.status.status_developing,
        task_status_done: sp_data.task.status.status_dev_done,

        task_status_raseTestDelay: sp_data.task.status.status_raisetest_delay,
        task_status_raseTestWait: 0,
        task_status_raseTestDone: 0,

        task_status_testDelay: sp_data.task.status.status_testtask_delay,
        task_status_testWait: sp_data.task.status.status_test_wait,
        task_status_testDoing: sp_data.task.status.status_testing,
        task_status_testDone: sp_data.task.status.status_test_done,

        // bug
        task_bug_noAssign: sp_data.task.bug.Bug_no_assign,
        task_bug_noDeadline: sp_data.task.bug.Bug_no_deadline,
        task_bug_prj_error: sp_data.task.bug.Bug_proj_error,
        task_bug_over_area: sp_data.task.bug.Bug_over_area,

        task_bug_actived: sp_data.task.bug.Bug_actived,
        task_bug_resolved: sp_data.task.bug.Bug_resolved,
        task_bug_vertified: sp_data.task.bug.Bug_verified,
        task_bug_closed: sp_data.task.bug.Bug_closed,

        task_bug_ac24: 0,
        task_bug_ac1624: 0,
        task_bug_ac0816: 0,
        task_bug_ac08: 0,

        task_bug_ve24: 0,
        task_bug_ve1624: 0,
        task_bug_ve0816: 0,
        task_bug_ve08: 0,

        // endregion

        // region bug

        bug_noAssign: sp_data.bug.Bug_no_assign,
        bug_noDeadline: sp_data.bug.Bug_no_deadline,
        bug_prj_error: 0,
        bug_over_area: 0,

        bug_actived: sp_data.bug.Bug_actived,
        bug_resolved: sp_data.bug.Bug_resolved,
        bug_vertified: sp_data.bug.Bug_verified,
        bug_closed: sp_data.Bug_closed,

        bug_ac24: 0,
        bug_ac1624: 0,
        bug_ac0816: 0,
        bug_ac08: 0,

        bug_ve24: 0,
        bug_ve1624: 0,
        bug_ve0816: 0,
        bug_ve08: 0
        // endregion
      });
    }

  }, [em_data.Bug_no_deadline]);

  return (

    <PageContainer style={{height: "102%", backgroundColor: "white"}}>
      <div>
        <Row gutter={16}>

          {/* 第一列 */}
          <Col className="gutter-row" span={12}>
            <div style={{height: '101%', backgroundColor: "#F2F2F2"}}>

              {/* emergency 下拉框 */}
              <div>

                <Select defaultValue={emergencyPrjInfo.prjName}
                        style={{width: '200px', marginLeft: "20px", marginTop: '20px', fontSize: "15px"}}
                        showSearch={true} optionFilterProp="children"
                        onChange={emergencyChanged}>{emergencySelect}</Select>
                <Button type="text" style={{float: "right", color: 'black', marginTop: '20px', marginRight: "10px"}}
                        icon={<SearchOutlined/>}
                        size={'large'}
                        onClick={() => {
                          history.push(`/sprint/sprintListDetails?projectid=${emergencyPrjInfo.prjID}&project=${emergencyPrjInfo.prjName}`);
                        }}>查看项目清单All</Button>
              </div>
              {/* emergency 数据显示div */}
              <div className="site-card-wrapper" style={{marginTop: '30px', marginLeft: "20px", marginRight: "20px"}}
                   hidden={false}>
                <div style={{
                  marginTop: "-20px",
                  width: "100%",
                  fontSize: "15px",
                  backgroundColor: "white"
                }}>&nbsp;hotfix &nbsp;
                  <Link
                    to={`/sprint/basicTable/bugs/bugAll?${url}`}>10</Link> &nbsp;个
                </div>

                <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

                  <Col span={2}>
                    <div style={{backgroundColor: "white", height: "155px", textAlign: "center"}}>
                      <button
                        style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>Bug
                      </button>
                    </div>
                  </Col>

                  {/* 规范检查 */}
                  <Col span={5}>
                    <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                          headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue"}}
                          bodyStyle={{height: "110px", textAlign: "left"}}>

                      <div style={{marginTop: "-15px"}}>
                        <div style={{whiteSpace: "nowrap"}}>无指派  &nbsp;<Link
                          to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_no_assign`}>{emergency.noAssign}</Link> &nbsp;个
                        </div>
                        <div style={{whiteSpace: "nowrap"}}>无排期  &nbsp;<Link
                          to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_no_deadline`}>{emergency.noDeadline}</Link> &nbsp;个
                        </div>
                        <div style={{whiteSpace: "nowrap"}}>项目错误&nbsp;
                          <Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_proj_error`}>{emergency.prj_error}</Link>&nbsp;个
                        </div>
                        <div style={{whiteSpace: "nowrap"}}>超范围&nbsp;
                          <Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_over_area`}>{emergency.over_area}</Link>&nbsp;个
                        </div>
                      </div>
                    </Card>
                  </Col>

                  {/* bug状态 */}
                  <Col span={5}>
                    <Card title={<div style={{marginTop: "-5px"}}> bug状态 </div>}
                          headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                          bodyStyle={{height: "110px", textAlign: "left"}}>
                      <div style={{marginTop: "-15px"}}>
                        <div style={{whiteSpace: "nowrap"}}>激活 &nbsp;
                          <Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=actived`}>{emergency.actived}</Link>&nbsp;个
                        </div>
                        <div style={{whiteSpace: "nowrap"}}>已解决 &nbsp;<Link
                          to={`/sprint/basicTable/bugs/bugDetails?${url}&item=resolved`}>{emergency.resolved}</Link> &nbsp;个
                        </div>
                        <div style={{whiteSpace: "nowrap"}}>已验证 &nbsp;<Link
                          to={`/sprint/basicTable/bugs/bugDetails?${url}&item=verified`}>{emergency.vertified}</Link> &nbsp;个
                        </div>
                        <div style={{whiteSpace: "nowrap"}}>已关闭 &nbsp;<Link
                          to={`/sprint/basicTable/bugs/bugDetails?${url}&item=closed`}>{emergency.closed}</Link> &nbsp;个
                        </div>
                      </div>
                    </Card>
                  </Col>

                  {/* 激活时长 */}
                  <Col span={6}>
                    <Card title={<div style={{marginTop: "-5px"}}> 激活时长 </div>}
                          headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                          bodyStyle={{height: "110px", textAlign: "left"}}>
                      <div style={{marginTop: "-15px"}}>
                        <div style={{whiteSpace: "nowrap"}}>&gt;24H&nbsp;<Link
                          to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_>24H`}>{emergency.ac24}</Link> &nbsp;个
                        </div>
                        <div style={{whiteSpace: "nowrap"}}>16-24H&nbsp;<Link
                          to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_16-24H`}>{emergency.ac1624}</Link> &nbsp;个
                        </div>
                        <div style={{whiteSpace: "nowrap"}}>8-16H&nbsp;<Link
                          to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_8-16H`}>{emergency.ac0816}</Link> &nbsp;个
                        </div>
                        <div style={{whiteSpace: "nowrap"}}>&lt;8H&nbsp;<Link
                          to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_<8H`}>{emergency.ac08}</Link> &nbsp;个
                        </div>
                      </div>
                    </Card>
                  </Col>

                  {/* 待回验时长 */}
                  <Col span={6}>
                    <Card title={<div style={{marginTop: "-5px"}}> 待回验时长 </div>}
                          headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                          bodyStyle={{height: "110px", textAlign: "left"}}>
                      <div style={{marginTop: "-15px"}}>
                        <div style={{whiteSpace: "nowrap"}}>&gt;24H&nbsp;<Link
                          to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_>24H`}>{emergency.ve24}</Link> &nbsp;个
                        </div>
                        <div style={{whiteSpace: "nowrap"}}>16-24H&nbsp;<Link
                          to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_16-24H`}>{emergency.ve1624}</Link> &nbsp;个
                        </div>
                        <div style={{whiteSpace: "nowrap"}}>8-16H&nbsp;<Link
                          to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_8-16H`}>{emergency.ve0816}</Link>&nbsp;个
                        </div>
                        <div style={{whiteSpace: "nowrap"}}>&lt;8H&nbsp;<Link
                          to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_<8H`}>{emergency.ve08}</Link>&nbsp;个
                        </div>
                      </div>
                    </Card>
                  </Col>

                </Row>

              </div>

              {/* hotfix 下拉框 */}
              <div>
                <Select defaultValue={hotfixPrjInfo.prjName}
                        style={{width: '200px', marginLeft: "20px", marginTop: '20px', fontSize: "15px"}}
                        showSearch optionFilterProp="children" onChange={hotfixChanged}>{hotfixSelect}</Select>
                <Button type="text" style={{float: "right", color: 'black', marginTop: '20px', marginRight: "10px"}}
                        icon={<SearchOutlined/>}
                        size={'large'}
                        onClick={() => {
                          history.push(`/sprint/sprintListDetails?projectid=${hotfixPrjInfo.prjID}&project=${hotfixPrjInfo.prjName}`);
                        }}>查看项目清单All</Button>
              </div>
              {/* hotfix数据显示div */}
              <div>
                {/* 需求 */}
                <div className="site-card-wrapper" style={{marginTop: '30px', marginLeft: "20px", marginRight: "20px"}}>

                  <div style={{
                    marginTop: "-20px",
                    width: "100%",
                    fontSize: "15px",
                    backgroundColor: "white"
                  }}>&nbsp;需求 &nbsp;
                    <Link to={`/sprint/basicTable/stories/storyAll?${url}`}>10</Link> &nbsp;个
                  </div>

                  {/* 需求-状态 */}
                  <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

                    <Col span={2}>
                      <div style={{backgroundColor: "white", height: "250px", textAlign: "center"}}>
                        <button
                          style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "100px"}}>状态
                        </button>
                      </div>
                    </Col>

                    {/* 规范检查 */}
                    <Col span={5}>
                      <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "205px", textAlign: "left"}}>

                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>草稿&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=draft`}>{hotfix.story_status_draft}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>无任务&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=no_task`}>{hotfix.story_status_noTask}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>缺任务&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=lack_task`}>{hotfix.story_status_lackTask}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>无排期&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=no_deadline`}>{hotfix.story_status_noDeadline}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>无指派&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=no_assign`}>{hotfix.story_status_noAssign}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>无bug  &nbsp;&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=no_bug`}>{hotfix.story_status_noBug}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>未更新&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=un_modify`}>{hotfix.story_status_noModify}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>项目错误 &nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=proj_error`}>{hotfix.story_status_prj_error}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>超范围&nbsp;
                            <Link
                              to={`/sprint/basicTable/stories/storyDetails?${url}&item=over_area`}>{hotfix.story_status_over_area}</Link>&nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* 开发进展 */}
                    <Col span={5}>
                      <Card title={<div style={{marginTop: "-5px"}}> 开发进展 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "205px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>任务延期&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=devtask_delay`}>{hotfix.story_status_delay}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>未开始&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=dev_wait`}>{hotfix.story_status_wait}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>开发中&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=developing`}>{hotfix.story_status_doing}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>开发完&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=dev_done`}>{hotfix.story_status_done}</Link>&nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* 提测进展 */}
                    <Col span={6}>
                      <Card title={<div style={{marginTop: "-5px"}}> 提测进展 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "205px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>提测延期&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=raisetest_delay`}>{hotfix.story_status_raseTestDelay}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>未提测&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=un_raisetest`}>{hotfix.story_status_raseTestWait}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>已提测&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=raisetest_done`}>{hotfix.story_status_raseTestDone}</Link>&nbsp;个
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 测试进展 */}
                    <Col span={6}>
                      <Card title={<div style={{marginTop: "-5px"}}> 测试进展 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "205px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>任务延期&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=testtask_delay`}>{hotfix.story_status_testDelay}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>未开始&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=test_wait`}>{hotfix.story_status_testWait}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>测试中&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=testing`}>{hotfix.story_status_testDoing}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>测试完&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=test_done`}>{hotfix.story_status_testDone}</Link>&nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>

                  {/* 需求-bug */}
                  <Row gutter={8} align={"middle"} style={{marginTop: "10px"}}>   {/* gutter 每一列的间隔距离 */}

                    <Col span={2}>
                      <div style={{backgroundColor: "white", height: "145px", textAlign: "center"}}>
                        <button
                          style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>Bug
                        </button>
                      </div>
                    </Col>

                    {/* 规范检查 */}
                    <Col span={5}>
                      <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>

                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>无指派  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_no_assign`}>{hotfix.story_bug_noAssign}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>无排期  &nbsp;&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_no_deadline`}>{hotfix.story_bug_noDeadline}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>项目错误&nbsp;
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_proj_error`}>{hotfix.story_bug_prj_error}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>超范围&nbsp;
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_over_area`}>{hotfix.story_bug_over_area}</Link>&nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* bug状态 */}
                    <Col span={5}>
                      <Card title={<div style={{marginTop: "-5px"}}> bug状态 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>激活 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=actived`}>{hotfix.story_bug_actived}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>已解决 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=resolved`}>{hotfix.story_bug_resolved}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>已验证 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=verified`}>{hotfix.story_bug_vertified}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>已关闭 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=closed`}>{hotfix.story_bug_closed}</Link> &nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* 激活时长 */}
                    <Col span={6}>
                      <Card title={<div style={{marginTop: "-5px"}}> 激活时长 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>&gt;24H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_>24H`}>{hotfix.story_bug_ac24}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>16-24H  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_16-24H`}>{hotfix.story_bug_ac1624}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>8-16H  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_8-16H`}>{hotfix.story_bug_ac0816}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>&lt;8H  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_<8H`}>{hotfix.story_bug_ac08}</Link> &nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* 待回验时长 */}
                    <Col span={6}>
                      <Card title={<div style={{marginTop: "-5px"}}> 待回验时长 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>&gt;24H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_>24H`}>{hotfix.story_bug_ve24}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>16-24H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_16-24H`}>{hotfix.story_bug_ve1624}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>8-16H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_8-16H`}>{hotfix.story_bug_ve0816}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>&lt;8H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_<8H`}>{hotfix.story_bug_ve08}</Link> &nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                  </Row>

                </div>

                {/* 任务 */}
                <div className="site-card-wrapper" style={{marginTop: '30px', marginLeft: "20px", marginRight: "20px"}}>
                  <div style={{
                    marginTop: "-20px",
                    width: "100%",
                    fontSize: "15px",
                    backgroundColor: "white"
                  }}>&nbsp;任务 &nbsp;
                    <Link to={`/sprint/basicTable/tasks/taskAll?${url}`}>10</Link> &nbsp;个
                  </div>

                  {/* 任务-状态 */}
                  <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

                    <Col span={2}>
                      <div style={{backgroundColor: "white", height: "205px", textAlign: "center"}}>
                        <button
                          style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>状态
                        </button>
                      </div>
                    </Col>

                    {/* 规范检查 */}
                    <Col span={5}>
                      <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "160px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>无任务&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item='no_task`}>{hotfix.task_status_noTask}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>无排期&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=no_deadline`}>{hotfix.task_status_noDeadline}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>无指派&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=no_assign`}>{hotfix.task_status_noAssign}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>无bug  &nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=no_bug`}>{hotfix.task_status_noBug}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>未更新&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=un_modify`}>{hotfix.task_status_noModify}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>项目错误&nbsp;
                            <Link
                              to={`/sprint/basicTable/tasks/taskDetails?${url}&item=proj_error`}>{hotfix.task_status_prj_error}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>超范围&nbsp;
                            <Link
                              to={`/sprint/basicTable/tasks/taskDetails?${url}&item=over_area`}>{hotfix.task_status_over_area}</Link>&nbsp;个
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 开发进展 */}
                    <Col span={5}>
                      <Card title={<div style={{marginTop: "-5px"}}> 开发进展 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "160px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>任务延期&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=devtask_delay`}>{hotfix.task_status_taskDelay}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>未开始&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=dev_wait`}>{hotfix.task_status_wait}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>开发中&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=developing`}>{hotfix.task_status_doing}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>开发完&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=dev_done`}>{hotfix.task_status_done}</Link>&nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* 提测进展 */}
                    <Col span={6}>
                      <Card title={<div style={{marginTop: "-5px"}}> 提测进展 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "160px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>提测延期&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=raisetest_delay`}>{hotfix.task_status_raseTestDelay}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>未提测&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=un_raisetest`}>{hotfix.task_status_raseTestWait}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>已提测&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=raisetest_done`}>{hotfix.task_status_raseTestDone}</Link>&nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* 测试进展 */}
                    <Col span={6}>
                      <Card title={<div style={{marginTop: "-5px"}}> 测试进展 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "160px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>任务延期&nbsp;;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=testtask_delay`}>{hotfix.task_status_testDelay}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>未开始&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=test_wait`}>{hotfix.task_status_testWait}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>测试中 &nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=testing`}>{hotfix.task_status_testDoing}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>测试完 &nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=test_done`}>{hotfix.task_status_testDone}</Link> &nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                  </Row>

                  {/* 任务-bug */}
                  <Row gutter={8} align={"middle"} style={{marginTop: "10px"}}>   {/* gutter 每一列的间隔距离 */}

                    <Col span={2}>
                      <div style={{backgroundColor: "white", height: "145px", textAlign: "center"}}>
                        <button
                          style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>Bug
                        </button>
                      </div>
                    </Col>

                    {/* 规范检查 */}
                    <Col span={5}>
                      <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>

                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>无指派 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_no_assign`}>{hotfix.task_bug_noAssign}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>无排期  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_no_deadline`}>{hotfix.task_bug_noDeadline}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>项目错误&nbsp;
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_proj_error`}>{hotfix.task_bug_prj_error}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>超范围&nbsp;
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_over_area`}>{hotfix.task_bug_over_area}</Link>&nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* bug状态 */}
                    <Col span={5}>
                      <Card title={<div style={{marginTop: "-5px"}}> bug状态 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>激活 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=actived`}>{hotfix.task_bug_actived}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>已解决 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=resolved`}>{hotfix.task_bug_resolved}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>已验证 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=verified`}>{hotfix.task_bug_vertified}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>已关闭 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=closed`}>{hotfix.task_bug_closed}</Link> &nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* 激活时长 */}
                    <Col span={6}>
                      <Card title={<div style={{marginTop: "-5px"}}> 激活时长 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>&gt;24H  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_>24H`}>{hotfix.task_bug_ac24}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>16-24H  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_16-24H`}>{hotfix.task_bug_ac1624}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>8-16H  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_8-16H`}>{hotfix.task_bug_ac0816}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>&lt;8H  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_<8H`}>{hotfix.task_bug_ac08}</Link> &nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* 待回验时长 */}
                    <Col span={6}>
                      <Card title={<div style={{marginTop: "-5px"}}> 待回验时长 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>&gt;24H  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_>24H`}>{hotfix.task_bug_ve24}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>16-24H  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_16-24H`}>{hotfix.task_bug_ve1624}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>8-16H  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_8-16H`}>{hotfix.task_bug_ve0816}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>&lt;8H  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_<8H`}>{hotfix.task_bug_ve08}</Link> &nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                  </Row>
                </div>

                {/* bug */}
                <div className="site-card-wrapper" style={{marginTop: '30px', marginLeft: "20px", marginRight: "20px"}}>
                  <div style={{
                    marginTop: "-20px",
                    width: "100%",
                    fontSize: "15px",
                    backgroundColor: "white"
                  }}>&nbsp;hotfix &nbsp;
                    <Link
                      to={`/sprint/basicTable/bugs/bugAll?${url}`}>10</Link> &nbsp;个
                  </div>

                  <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

                    <Col span={2}>
                      <div style={{backgroundColor: "white", height: "155px", textAlign: "center"}}>
                        <button
                          style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>Bug
                        </button>
                      </div>
                    </Col>

                    {/* 规范检查 */}
                    <Col span={5}>
                      <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "110px", textAlign: "left"}}>

                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>无指派  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_no_assign`}>{hotfix.bug_noAssign}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>无排期  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_no_deadline`}>{hotfix.bug_noDeadline}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>项目错误&nbsp;
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_proj_error`}>{hotfix.bug_prj_error}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>超范围&nbsp;
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_over_area`}>{hotfix.bug_over_area}</Link>&nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* bug状态 */}
                    <Col span={5}>
                      <Card title={<div style={{marginTop: "-5px"}}> bug状态 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "110px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>激活 &nbsp;
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=actived`}>{hotfix.bug_actived}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>已解决 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=resolved`}>{hotfix.bug_resolved}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>已验证 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=verified`}>{hotfix.bug_vertified}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>已关闭 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=closed`}>{hotfix.bug_closed}</Link> &nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* 激活时长 */}
                    <Col span={6}>
                      <Card title={<div style={{marginTop: "-5px"}}> 激活时长 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "110px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>&gt;24H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_>24H`}>{hotfix.bug_ac24}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>16-24H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_16-24H`}>{hotfix.bug_ac1624}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>8-16H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_8-16H`}>{hotfix.bug_ac0816}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>&lt;8H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_<8H`}>{hotfix.bug_ac08}</Link> &nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* 待回验时长 */}
                    <Col span={6}>
                      <Card title={<div style={{marginTop: "-5px"}}> 待回验时长 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "110px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>&gt;24H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_>24H`}>{hotfix.bug_ve24}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>16-24H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_16-24H`}>{hotfix.bug_ve1624}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>8-16H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_8-16H`}>{hotfix.bug_ve0816}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>&lt;8H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_<8H`}>{hotfix.bug_ve08}</Link>&nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                  </Row>

                </div>

              </div>


            </div>
          </Col>

          {/* 第二列 */}
          <Col className="gutter-row" span={12}>
            <div style={{height: '101%', backgroundColor: "#F2F2F2"}}>
              {/* sprint 下拉框 */}
              <div>
                <Select defaultValue={sprintPrjInfo.prjName}
                        style={{width: '200px', marginLeft: "20px", marginTop: '20px', fontSize: "15px"}}
                        showSearch={true} optionFilterProp="children"
                        onChange={sprintChanged}>{sprintSelect}</Select>
                <Button type="text" style={{float: "right", color: 'black', marginTop: '20px', marginRight: "10px"}}
                        icon={<SearchOutlined/>}
                        size={'large'}
                        onClick={() => {
                          history.push(`/sprint/sprintListDetails?projectid=${sprintPrjInfo.prjID}&project=${sprintPrjInfo.prjName}`);
                        }}>查看项目清单All</Button>
              </div>

              {/* sprint数据显示div */}
              <div>
                {/* 需求 */}
                <div className="site-card-wrapper" style={{marginTop: '30px', marginLeft: "20px", marginRight: "20px"}}>

                  <div style={{
                    marginTop: "-20px",
                    width: "100%",
                    fontSize: "15px",
                    backgroundColor: "white"
                  }}>&nbsp;需求 &nbsp;
                    <Link to={`/sprint/basicTable/stories/storyAll?${url}`}>10</Link> &nbsp;个
                  </div>

                  {/* 需求-状态 */}
                  <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

                    <Col span={2}>
                      <div style={{backgroundColor: "white", height: "250px", textAlign: "center"}}>
                        <button
                          style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "100px"}}>状态
                        </button>
                      </div>
                    </Col>

                    {/* 规范检查 */}
                    <Col span={5}>
                      <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "205px", textAlign: "left"}}>

                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>草稿&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=draft`}>{sprint.story_status_draft}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>无任务&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=no_task`}>{sprint.story_status_noTask}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>缺任务&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=lack_task`}>{sprint.story_status_lackTask}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>无排期&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=no_deadline`}>{sprint.story_status_noDeadline}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>无指派&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=no_assign`}>{sprint.story_status_noAssign}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>无bug  &nbsp;&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=no_bug`}>{sprint.story_status_noBug}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>未更新&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=un_modify`}>{sprint.story_status_noModify}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>项目错误 &nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=proj_error`}>{sprint.story_status_prj_error}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>超范围&nbsp;
                            <Link
                              to={`/sprint/basicTable/stories/storyDetails?${url}&item=over_area`}>{sprint.story_status_over_area}</Link>&nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* 开发进展 */}
                    <Col span={5}>
                      <Card title={<div style={{marginTop: "-5px"}}> 开发进展 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "205px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>任务延期&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=devtask_delay`}>{sprint.story_status_delay}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>未开始&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=dev_wait`}>{sprint.story_status_wait}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>开发中&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=developing`}>{sprint.story_status_doing}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>开发完&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=dev_done`}>{sprint.story_status_done}</Link>&nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* 提测进展 */}
                    <Col span={6}>
                      <Card title={<div style={{marginTop: "-5px"}}> 提测进展 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "205px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>提测延期&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=raisetest_delay`}>{sprint.story_status_raseTestDelay}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>未提测&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=un_raisetest`}>{sprint.story_status_raseTestWait}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>已提测&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=raisetest_done`}>{sprint.story_status_raseTestDone}</Link>&nbsp;个
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 测试进展 */}
                    <Col span={6}>
                      <Card title={<div style={{marginTop: "-5px"}}> 测试进展 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "205px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>任务延期&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=testtask_delay`}>{sprint.story_status_testDelay}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>未开始&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=test_wait`}>{sprint.story_status_testWait}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>测试中&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=testing`}>{sprint.story_status_testDoing}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>测试完&nbsp;<Link
                            to={`/sprint/basicTable/stories/storyDetails?${url}&item=test_done`}>{sprint.story_status_testDone}</Link>&nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>

                  {/* 需求-bug */}
                  <Row gutter={8} align={"middle"} style={{marginTop: "10px"}}>   {/* gutter 每一列的间隔距离 */}

                    <Col span={2}>
                      <div style={{backgroundColor: "white", height: "145px", textAlign: "center"}}>
                        <button
                          style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>Bug
                        </button>
                      </div>
                    </Col>

                    {/* 规范检查 */}
                    <Col span={5}>
                      <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>

                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>无指派  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_no_assign`}>{sprint.story_bug_noAssign}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>无排期  &nbsp;&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_no_deadline`}>{sprint.story_bug_noDeadline}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>项目错误&nbsp;
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_proj_error`}>{sprint.story_bug_prj_error}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>超范围&nbsp;
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_over_area`}>{sprint.story_bug_over_area}</Link>&nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* bug状态 */}
                    <Col span={5}>
                      <Card title={<div style={{marginTop: "-5px"}}> bug状态 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>激活 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=actived`}>{sprint.story_bug_actived}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>已解决 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=resolved`}>{sprint.story_bug_resolved}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>已验证 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=verified`}>{sprint.story_bug_vertified}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>已关闭 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=closed`}>{sprint.story_bug_closed}</Link> &nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* 激活时长 */}
                    <Col span={6}>
                      <Card title={<div style={{marginTop: "-5px"}}> 激活时长 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>&gt;24H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_>24H`}>{sprint.story_bug_ac24}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>16-24H  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_16-24H`}>{sprint.story_bug_ac1624}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>8-16H  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_8-16H`}>{sprint.story_bug_ac0816}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>&lt;8H  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_<8H`}>{sprint.story_bug_ac08}</Link> &nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* 待回验时长 */}
                    <Col span={6}>
                      <Card title={<div style={{marginTop: "-5px"}}> 待回验时长 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>&gt;24H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_>24H`}>{sprint.story_bug_ve24}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>16-24H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_16-24H`}>{sprint.story_bug_ve1624}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>8-16H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_8-16H`}>{sprint.story_bug_ve0816}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>&lt;8H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_<8H`}>{sprint.story_bug_ve08}</Link> &nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                  </Row>

                </div>

                {/* 任务 */}
                <div className="site-card-wrapper" style={{marginTop: '30px', marginLeft: "20px", marginRight: "20px"}}>
                  <div style={{
                    marginTop: "-20px",
                    width: "100%",
                    fontSize: "15px",
                    backgroundColor: "white"
                  }}>&nbsp;任务 &nbsp;
                    <Link to={`/sprint/basicTable/tasks/taskAll?${url}`}>10</Link> &nbsp;个
                  </div>

                  {/* 任务-状态 */}
                  <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

                    <Col span={2}>
                      <div style={{backgroundColor: "white", height: "205px", textAlign: "center"}}>
                        <button
                          style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>状态
                        </button>
                      </div>
                    </Col>

                    {/* 规范检查 */}
                    <Col span={5}>
                      <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "160px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>无任务&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item='no_task`}>{sprint.task_status_noTask}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>无排期&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=no_deadline`}>{sprint.task_status_noDeadline}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>无指派&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=no_assign`}>{sprint.task_status_noAssign}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>无bug  &nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=no_bug`}>{sprint.task_status_noBug}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>未更新&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=un_modify`}>{sprint.task_status_noModify}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>项目错误&nbsp;
                            <Link
                              to={`/sprint/basicTable/tasks/taskDetails?${url}&item=proj_error`}>{sprint.task_status_prj_error}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>超范围&nbsp;
                            <Link
                              to={`/sprint/basicTable/tasks/taskDetails?${url}&item=over_area`}>{sprint.task_status_over_area}</Link>&nbsp;个
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 开发进展 */}
                    <Col span={5}>
                      <Card title={<div style={{marginTop: "-5px"}}> 开发进展 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "160px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>任务延期&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=devtask_delay`}>{sprint.task_status_taskDelay}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>未开始&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=dev_wait`}>{sprint.task_status_wait}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>开发中&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=developing`}>{sprint.task_status_doing}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>开发完&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=dev_done`}>{sprint.task_status_done}</Link>&nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* 提测进展 */}
                    <Col span={6}>
                      <Card title={<div style={{marginTop: "-5px"}}> 提测进展 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "160px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>提测延期&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=raisetest_delay`}>{sprint.task_status_raseTestDelay}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>未提测&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=un_raisetest`}>{sprint.task_status_raseTestWait}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>已提测&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=raisetest_done`}>{sprint.task_status_raseTestDone}</Link>&nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* 测试进展 */}
                    <Col span={6}>
                      <Card title={<div style={{marginTop: "-5px"}}> 测试进展 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "160px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>任务延期&nbsp;;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=testtask_delay`}>{sprint.task_status_testDelay}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>未开始&nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=test_wait`}>{sprint.task_status_testWait}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>测试中 &nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=testing`}>{sprint.task_status_testDoing}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>测试完 &nbsp;<Link
                            to={`/sprint/basicTable/tasks/taskDetails?${url}&item=test_done`}>{sprint.task_status_testDone}</Link> &nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                  </Row>

                  {/* 任务-bug */}
                  <Row gutter={8} align={"middle"} style={{marginTop: "10px"}}>   {/* gutter 每一列的间隔距离 */}

                    <Col span={2}>
                      <div style={{backgroundColor: "white", height: "145px", textAlign: "center"}}>
                        <button
                          style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>Bug
                        </button>
                      </div>
                    </Col>

                    {/* 规范检查 */}
                    <Col span={5}>
                      <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>

                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>无指派 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_no_assign`}>{sprint.task_bug_noAssign}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>无排期  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_no_deadline`}>{sprint.task_bug_noDeadline}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>项目错误&nbsp;
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_proj_error`}>{sprint.task_bug_prj_error}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>超范围&nbsp;
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_over_area`}>{sprint.task_bug_over_area}</Link>&nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* bug状态 */}
                    <Col span={5}>
                      <Card title={<div style={{marginTop: "-5px"}}> bug状态 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>激活 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=actived`}>{sprint.task_bug_actived}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>已解决 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=resolved`}>{sprint.task_bug_resolved}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>已验证 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=verified`}>{sprint.task_bug_vertified}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>已关闭 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=closed`}>{sprint.task_bug_closed}</Link> &nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* 激活时长 */}
                    <Col span={6}>
                      <Card title={<div style={{marginTop: "-5px"}}> 激活时长 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>&gt;24H  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_>24H`}>{sprint.task_bug_ac24}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>16-24H  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_16-24H`}>{sprint.task_bug_ac1624}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>8-16H  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_8-16H`}>{sprint.task_bug_ac0816}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>&lt;8H  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_<8H`}>{sprint.task_bug_ac08}</Link> &nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* 待回验时长 */}
                    <Col span={6}>
                      <Card title={<div style={{marginTop: "-5px"}}> 待回验时长 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>&gt;24H  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_>24H`}>{sprint.task_bug_ve24}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>16-24H  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_16-24H`}>{sprint.task_bug_ve1624}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>8-16H  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_8-16H`}>{sprint.task_bug_ve0816}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>&lt;8H  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_<8H`}>{sprint.task_bug_ve08}</Link> &nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                  </Row>
                </div>

                {/* bug */}
                <div className="site-card-wrapper" style={{marginTop: '30px', marginLeft: "20px", marginRight: "20px"}}>
                  <div style={{
                    marginTop: "-20px",
                    width: "100%",
                    fontSize: "15px",
                    backgroundColor: "white"
                  }}>&nbsp;hotfix &nbsp;
                    <Link
                      to={`/sprint/basicTable/bugs/bugAll?${url}`}>10</Link> &nbsp;个
                  </div>

                  <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

                    <Col span={2}>
                      <div style={{backgroundColor: "white", height: "155px", textAlign: "center"}}>
                        <button
                          style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>Bug
                        </button>
                      </div>
                    </Col>

                    {/* 规范检查 */}
                    <Col span={5}>
                      <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "110px", textAlign: "left"}}>

                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>无指派  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_no_assign`}>{sprint.bug_noAssign}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>无排期  &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_no_deadline`}>{sprint.bug_noDeadline}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>项目错误&nbsp;
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_proj_error`}>{sprint.bug_prj_error}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>超范围&nbsp;
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_over_area`}>{sprint.bug_over_area}</Link>&nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* bug状态 */}
                    <Col span={5}>
                      <Card title={<div style={{marginTop: "-5px"}}> bug状态 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "110px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>激活 &nbsp;
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=actived`}>{sprint.bug_actived}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>已解决 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=resolved`}>{sprint.bug_resolved}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>已验证 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=verified`}>{sprint.bug_vertified}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>已关闭 &nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=closed`}>{sprint.bug_closed}</Link> &nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* 激活时长 */}
                    <Col span={6}>
                      <Card title={<div style={{marginTop: "-5px"}}> 激活时长 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "110px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>&gt;24H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_>24H`}>{sprint.bug_ac24}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>16-24H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_16-24H`}>{sprint.bug_ac1624}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>8-16H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_8-16H`}>{sprint.bug_ac0816}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>&lt;8H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_<8H`}>{sprint.bug_ac08}</Link> &nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* 待回验时长 */}
                    <Col span={6}>
                      <Card title={<div style={{marginTop: "-5px"}}> 待回验时长 </div>}
                            headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                            bodyStyle={{height: "110px", textAlign: "left"}}>
                        <div style={{marginTop: "-15px"}}>
                          <div style={{whiteSpace: "nowrap"}}>&gt;24H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_>24H`}>{sprint.bug_ve24}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>16-24H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_16-24H`}>{sprint.bug_ve1624}</Link> &nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>8-16H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_8-16H`}>{sprint.bug_ve0816}</Link>&nbsp;个
                          </div>
                          <div style={{whiteSpace: "nowrap"}}>&lt;8H&nbsp;<Link
                            to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_<8H`}>{sprint.bug_ve08}</Link>&nbsp;个
                          </div>
                        </div>
                      </Card>
                    </Col>

                  </Row>

                </div>

              </div>

            </div>
          </Col>

        </Row>
      </div>
    </PageContainer>
  );
};

export default DashBoard;

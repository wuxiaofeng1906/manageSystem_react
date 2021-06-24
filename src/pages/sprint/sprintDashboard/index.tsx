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
import {getWeeksRange} from '@/publicMethods/timeMethods';
import {judgeAuthority} from "@/publicMethods/authorityJudge";

const {Option} = Select;


const queryDashboardViews = async (client: GqlClient<object>) => {
  const times = getWeeksRange(1)[0].to;

  // 周末的日期
  const {data} = await client.query(`
      {
        dashboardAll(endDay:"${times}"){
         id,
          name,
          category,
          data{
            name
            count
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
      <Option key={params[index].id} value={params[index].name}> {params[index].name}</Option>,
    );
  }
  return project;
};

// 动态查询下拉框所选数据
const queryProjectALL = async (client: GqlClient<object>, params: any) => {
  const {data} = await client.query(`
      {
          dashProjectAll(project:${params}){
          name
          count
          data{
            name
            data{
              item
              value
            }
          }
        }
      }
  `);
  return data?.dashProjectAll;
};

const DashBoard: React.FC<any> = () => {
  const gqlClient = useGqlClient();

  // 设置各种数据初始化状态
  const [hidden, setHidden] = useState({
    em_bug: true,
    ho_story: true,
    ho_task: true,
    ho_bug: true
  });
  const [emergency, setEmergency] = useState({
    all_count_bug: '',
    noAssign: '',
    noDeadline: '',
    prj_error: '',
    over_area: '',
    actived: '',
    resolved: '',
    vertified: '',
    closed: '',
    ac24: '',
    ac1624: '',
    ac0816: '',
    ac08: '',
    ve24: '',
    ve1624: '',
    ve0816: '',
    ve08: ''
  });
  const [hotfix, setHotfix] = useState({
    // region 需求
    story_all_count: '',
    // 状态
    story_status_draft: '',
    story_status_noTask: '',
    story_status_lackTask: '',
    story_status_noDeadline: '',
    story_status_noAssign: '',
    story_status_noBug: '',
    story_status_noModify: '',
    story_status_prj_error: '',
    story_status_over_area: '',

    story_status_delay: '',
    story_status_wait: '',
    story_status_doing: '',
    story_status_done: '',

    story_status_raseTestDelay: '',
    story_status_raseTestWait: '',
    story_status_raseTestDone: '',

    story_status_testDelay: '',
    story_status_testWait: '',
    story_status_testDoing: '',
    story_status_testDone: '',

    // bug
    story_bug_noAssign: '',
    story_bug_noDeadline: '',
    story_bug_prj_error: '',
    story_bug_over_area: '',
    story_bug_actived: '',
    story_bug_resolved: '',
    story_bug_vertified: '',
    story_bug_closed: '',
    story_bug_ac24: '',
    story_bug_ac1624: '',
    story_bug_ac0816: '',
    story_bug_ac08: '',
    story_bug_ve24: '',
    story_bug_ve1624: '',
    story_bug_ve0816: '',
    story_bug_ve08: '',

    // endregion

    // region 任务
    task_all_count: '',
    // 状态
    task_status_noTask: '',
    task_status_noDeadline: '',
    task_status_noAssign: '',
    task_status_noBug: '',
    task_status_noModify: '',
    task_status_prj_error: '',
    task_status_over_area: '',

    task_status_taskDelay: '',
    task_status_wait: '',
    task_status_doing: '',
    task_status_done: '',

    task_status_raseTestDelay: '',
    task_status_raseTestWait: '',
    task_status_raseTestDone: '',

    task_status_testDelay: '',
    task_status_testWait: '',
    task_status_testDoing: '',
    task_status_testDone: '',

    // bug
    task_bug_noAssign: '',
    task_bug_noDeadline: '',
    task_bug_prj_error: '',
    task_bug_over_area: '',

    task_bug_actived: '',
    task_bug_resolved: '',
    task_bug_vertified: '',
    task_bug_closed: '',

    task_bug_ac24: '',
    task_bug_ac1624: '',
    task_bug_ac0816: '',
    task_bug_ac08: '',

    task_bug_ve24: '',
    task_bug_ve1624: '',
    task_bug_ve0816: '',
    task_bug_ve08: '',

    // endregion

    // region bug
    all_bug_counts: '',
    bug_noAssign: '',
    bug_noDeadline: '',
    bug_prj_error: '',
    bug_over_area: '',

    bug_actived: '',
    bug_resolved: '',
    bug_vertified: '',
    bug_closed: '',

    bug_ac24: '',
    bug_ac1624: '',
    bug_ac0816: '',
    bug_ac08: '',

    bug_ve24: '',
    bug_ve1624: '',
    bug_ve0816: '',
    bug_ve08: ''
    // endregion
  });
  const [sprint, setsprint] = useState({
    // region 需求
    story_all_count: '',
    // 状态
    story_status_draft: '',
    story_status_noTask: '',
    story_status_lackTask: '',
    story_status_noDeadline: '',
    story_status_noAssign: '',
    story_status_noBug: '',
    story_status_noModify: '',
    story_status_prj_error: '',
    story_status_over_area: '',

    story_status_delay: '',
    story_status_wait: '',
    story_status_doing: '',
    story_status_done: '',

    story_status_raseTestDelay: '',
    story_status_raseTestWait: '',
    story_status_raseTestDone: '',

    story_status_testDelay: '',
    story_status_testWait: '',
    story_status_testDoing: '',
    story_status_testDone: '',

    // bug
    story_bug_noAssign: '',
    story_bug_noDeadline: '',
    story_bug_prj_error: '',
    story_bug_over_area: '',
    story_bug_actived: '',
    story_bug_resolved: '',
    story_bug_vertified: '',
    story_bug_closed: '',
    story_bug_ac24: '',
    story_bug_ac1624: '',
    story_bug_ac0816: '',
    story_bug_ac08: '',
    story_bug_ve24: '',
    story_bug_ve1624: '',
    story_bug_ve0816: '',
    story_bug_ve08: '',

    // endregion

    // region 任务
    task_all_count: '',
    // 状态
    task_status_noTask: '',
    task_status_noDeadline: '',
    task_status_noAssign: '',
    task_status_noBug: '',
    task_status_noModify: '',
    task_status_prj_error: '',
    task_status_over_area: '',

    task_status_taskDelay: '',
    task_status_wait: '',
    task_status_doing: '',
    task_status_done: '',

    task_status_raseTestDelay: '',
    task_status_raseTestWait: '',
    task_status_raseTestDone: '',

    task_status_testDelay: '',
    task_status_testWait: '',
    task_status_testDoing: '',
    task_status_testDone: '',

    // bug
    task_bug_noAssign: '',
    task_bug_noDeadline: '',
    task_bug_prj_error: '',
    task_bug_over_area: '',

    task_bug_actived: '',
    task_bug_resolved: '',
    task_bug_vertified: '',
    task_bug_closed: '',

    task_bug_ac24: '',
    task_bug_ac1624: '',
    task_bug_ac0816: '',
    task_bug_ac08: '',

    task_bug_ve24: '',
    task_bug_ve1624: '',
    task_bug_ve0816: '',
    task_bug_ve08: '',

    // endregion

    // region bug
    all_bug_counts: '',

    bug_noAssign: '',
    bug_noDeadline: '',
    bug_prj_error: '',
    bug_over_area: '',

    bug_actived: '',
    bug_resolved: '',
    bug_vertified: '',
    bug_closed: '',

    bug_ac24: '',
    bug_ac1624: '',
    bug_ac0816: '',
    bug_ac08: '',

    bug_ve24: '',
    bug_ve1624: '',
    bug_ve0816: '',
    bug_ve08: ''
    // endregion
  });
  const [selectedName, setSelectedName] = useState({
    emergency: {id: "", name: ""},
    hotfix: {id: "", name: ""},
    sprint: {id: "", name: ""}
  });

  // 界面展示数据获取和解析
  const {data} = useRequest(() => queryDashboardViews(gqlClient));
  let sp_data = Object();
  let ho_data = Object();
  let em_data = Object();
  const oraProject = {
    sprint: {id: "", name: ""},
    hotfix: {id: "", name: ""},
    emergency: {id: "", name: ""},
  };
  if (data !== undefined) {
    for (let index = 0; index < data.length; index += 1) {
      const details = data[index];
      if (details.category === "sprint") {
        oraProject.sprint.id = details.id;
        oraProject.sprint.name = details.name;
        sp_data = sp_hotResultDeals(details.data);

      } else if (details.category === "hotfix") {
        oraProject.hotfix.id = details.id;
        oraProject.hotfix.name = details.name;
        ho_data = sp_hotResultDeals(details.data);

      } else {
        oraProject.emergency.id = details.id;
        oraProject.emergency.name = details.name;

        em_data = bugResultDeals(details.data);
      }
    }
  }

  // region 动态生成项目下拉框 以及下拉框事件
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
  const emergencyChanged = async (value: string, other: any) => {
    let hidde = false;
    const datas: any = await queryProjectALL(gqlClient, other.key);
    const em_datas = bugResultDeals(datas);

    if (JSON.stringify(em_datas) === "{}" || datas === null) {
      hidde = true;
    }

    setSelectedName({
      ...selectedName,
      emergency: {id: other.key, name: other.value}
    });
    setHidden({
      ...hidden,
      em_bug: hidde,
    });
    setEmergency({
      all_count_bug: em_datas.all_bug_count === undefined ? 0 : em_datas.all_bug_count,
      noAssign: em_datas.Bug_no_assign,
      noDeadline: em_datas.Bug_no_deadline,
      prj_error: '',
      over_area: '',
      actived: em_datas.Bug_actived,
      resolved: em_datas.Bug_resolved,
      vertified: em_datas.Bug_verified,
      closed: em_datas.Bug_closed,
      ac24: em_datas.Bug_ac_24,
      ac1624: em_datas.Bug_ac_1624,
      ac0816: em_datas.Bug_ac_0816,
      ac08: em_datas.Bug_ac_08,
      ve24: em_datas.Bug_ve_24,
      ve1624: em_datas.Bug_ve_1624,
      ve0816: em_datas.Bug_ve_0816,
      ve08: em_datas.Bug_ve_08
    });

  };

  // hotfix赋值和下拉框事件
  const hotfixChanged = async (value: string, other: any) => {
    let story_hidde = false;
    let story_task = false;
    let story_bug = false;

    const datas: any = await queryProjectALL(gqlClient, other.key);
    if (datas === null) {
      return;
    }
    const ho_datas = sp_hotResultDeals(datas);
    if (ho_datas === null || JSON.stringify(ho_datas.story.bug) === "{}") {
      story_hidde = true;
    }
    if (ho_datas === null || JSON.stringify(ho_datas.task.bug) === "{}") {
      story_task = true;
    }
    if (ho_datas === null || JSON.stringify(ho_datas.bug) === "{}") {
      story_bug = true;
    }
    setSelectedName({
      ...selectedName,
      hotfix: {id: other.key, name: other.value}
    });

    if (ho_datas === null) {
      return;
    }
    setHotfix({

      // region 需求
      story_all_count: ho_datas.story.allCount,
      // 状态
      story_status_draft: ho_datas.story.status.status_draft,
      story_status_noTask: ho_datas.story.status.status_no_task,
      story_status_lackTask: ho_datas.story.status.status_lack_task,
      story_status_noDeadline: ho_datas.story.status.status_no_deadline,
      story_status_noAssign: ho_datas.story.status.status_no_assign,
      story_status_noBug: ho_datas.story.status.status_no_bug,
      story_status_noModify: ho_datas.story.status.status_un_modify,
      story_status_prj_error: ho_datas.story.status.status_proj_error,
      story_status_over_area: ho_datas.story.status.status_over_area,

      story_status_delay: ho_datas.story.status.status_devtask_delay,
      story_status_wait: ho_datas.story.status.status_dev_wait,
      story_status_doing: ho_datas.story.status.status_developing,
      story_status_done: ho_datas.story.status.status_dev_done,

      story_status_raseTestDelay: ho_datas.story.status.status_raisetest_delay,
      story_status_raseTestWait: '',
      story_status_raseTestDone: '',

      story_status_testDelay: ho_datas.story.status.status_testtask_delay,
      story_status_testWait: ho_datas.story.status.status_test_wait,
      story_status_testDoing: ho_datas.story.status.status_testing,
      story_status_testDone: ho_datas.story.status.status_test_done,

      // bug
      story_bug_noAssign: ho_datas.story.bug.Bug_no_assign,
      story_bug_noDeadline: ho_datas.story.bug.Bug_no_deadline,
      story_bug_prj_error: ho_datas.story.bug.Bug_proj_error,
      story_bug_over_area: ho_datas.story.bug.Bug_over_area,
      story_bug_actived: ho_datas.story.bug.Bug_actived,
      story_bug_resolved: ho_datas.story.bug.Bug_resolved,
      story_bug_vertified: ho_datas.story.bug.Bug_verified,
      story_bug_closed: ho_datas.story.bug.Bug_closed,
      story_bug_ac24: '',
      story_bug_ac1624: '',
      story_bug_ac0816: '',
      story_bug_ac08: '',
      story_bug_ve24: '',
      story_bug_ve1624: '',
      story_bug_ve0816: '',
      story_bug_ve08: '',

      // endregion

      // region 任务
      task_all_count: ho_datas.task.allCount,

      // 状态
      task_status_noTask: ho_datas.task.status.status_no_task,
      task_status_noDeadline: ho_datas.task.status.status_no_deadline,
      task_status_noAssign: ho_datas.task.status.status_no_assign,
      task_status_noBug: ho_datas.task.status.status_no_bug,
      task_status_noModify: ho_datas.task.status.status_un_modify,
      task_status_prj_error: ho_datas.task.status.status_proj_error,
      task_status_over_area: ho_datas.task.status.status_over_area,

      task_status_taskDelay: ho_datas.task.status.status_devtask_delay,
      task_status_wait: ho_datas.task.status.status_dev_wait,
      task_status_doing: ho_datas.task.status.status_developing,
      task_status_done: ho_datas.task.status.status_dev_done,

      task_status_raseTestDelay: ho_datas.task.status.status_raisetest_delay,
      task_status_raseTestWait: '',
      task_status_raseTestDone: '',

      task_status_testDelay: ho_datas.task.status.status_testtask_delay,
      task_status_testWait: ho_datas.task.status.status_test_wait,
      task_status_testDoing: ho_datas.task.status.status_testing,
      task_status_testDone: ho_datas.task.status.status_test_done,

      // bug
      task_bug_noAssign: ho_datas.task.bug.Bug_no_assign,
      task_bug_noDeadline: ho_datas.task.bug.Bug_no_deadline,
      task_bug_prj_error: ho_datas.task.bug.Bug_proj_error,
      task_bug_over_area: ho_datas.task.bug.Bug_over_area,

      task_bug_actived: ho_datas.task.bug.Bug_actived,
      task_bug_resolved: ho_datas.task.bug.Bug_resolved,
      task_bug_vertified: ho_datas.task.bug.Bug_verified,
      task_bug_closed: ho_datas.task.bug.Bug_closed,

      task_bug_ac24: '',
      task_bug_ac1624: '',
      task_bug_ac0816: '',
      task_bug_ac08: '',

      task_bug_ve24: '',
      task_bug_ve1624: '',
      task_bug_ve0816: '',
      task_bug_ve08: '',

      // endregion

      // region bug
      all_bug_counts: ho_datas.bug.all_bug_count,

      bug_noAssign: ho_datas.bug.Bug_no_assign,
      bug_noDeadline: ho_datas.bug.Bug_no_deadline,
      bug_prj_error: '',
      bug_over_area: '',

      bug_actived: ho_datas.bug.Bug_actived,
      bug_resolved: ho_datas.bug.Bug_resolved,
      bug_vertified: ho_datas.bug.Bug_verified,
      bug_closed: ho_datas.bug.Bug_closed,

      bug_ac24: '',
      bug_ac1624: '',
      bug_ac0816: '',
      bug_ac08: '',

      bug_ve24: '',
      bug_ve1624: '',
      bug_ve0816: '',
      bug_ve08: ''
      // endregion

    });
    setHidden({
      ...hidden,
      ho_story: story_hidde,
      ho_task: story_task,
      ho_bug: story_bug
    });
  };

  // sprint赋值和下拉框事件
  const sprintChanged = async (value: string, other: any) => {
    const datas: any = await queryProjectALL(gqlClient, other.key);
    const sp_datas = sp_hotResultDeals(datas);

    setSelectedName({
      ...selectedName,
      sprint: {id: other.key, name: other.value}
    });

    if (sp_datas === null) {
      return;
    }
    setsprint({

      // region 需求
      story_all_count: sp_datas.story.allCount,

      // 状态
      story_status_draft: sp_datas.story.status.status_draft,
      story_status_noTask: sp_datas.story.status.status_no_task,
      story_status_lackTask: sp_datas.story.status.status_lack_task,
      story_status_noDeadline: sp_datas.story.status.status_no_deadline,
      story_status_noAssign: sp_datas.story.status.status_no_assign,
      story_status_noBug: sp_datas.story.status.status_no_bug,
      story_status_noModify: sp_datas.story.status.status_un_modify,
      story_status_prj_error: sp_datas.story.status.status_proj_error,
      story_status_over_area: sp_datas.story.status.status_over_area,

      story_status_delay: sp_datas.story.status.status_devtask_delay,
      story_status_wait: sp_datas.story.status.status_dev_wait,
      story_status_doing: sp_datas.story.status.status_developing,
      story_status_done: sp_datas.story.status.status_dev_done,

      story_status_raseTestDelay: sp_datas.story.status.status_raisetest_delay,
      story_status_raseTestWait: '',
      story_status_raseTestDone: '',

      story_status_testDelay: sp_datas.story.status.status_testtask_delay,
      story_status_testWait: sp_datas.story.status.status_test_wait,
      story_status_testDoing: sp_datas.story.status.status_testing,
      story_status_testDone: sp_datas.story.status.status_test_done,

      // bug
      story_bug_noAssign: sp_datas.story.bug.Bug_no_assign,
      story_bug_noDeadline: sp_datas.story.bug.Bug_no_deadline,
      story_bug_prj_error: sp_datas.story.bug.Bug_proj_error,
      story_bug_over_area: sp_datas.story.bug.Bug_over_area,
      story_bug_actived: sp_datas.story.bug.Bug_actived,
      story_bug_resolved: sp_datas.story.bug.Bug_resolved,
      story_bug_vertified: sp_datas.story.bug.Bug_verified,
      story_bug_closed: sp_datas.story.bug.Bug_closed,
      story_bug_ac24: '',
      story_bug_ac1624: '',
      story_bug_ac0816: '',
      story_bug_ac08: '',
      story_bug_ve24: '',
      story_bug_ve1624: '',
      story_bug_ve0816: '',
      story_bug_ve08: '',

      // endregion

      // region 任务
      task_all_count: sp_datas.task.allCount,

      // 状态
      task_status_noTask: sp_datas.task.status.status_no_task,
      task_status_noDeadline: sp_datas.task.status.status_no_deadline,
      task_status_noAssign: sp_datas.task.status.status_no_assign,
      task_status_noBug: sp_datas.task.status.status_no_bug,
      task_status_noModify: sp_datas.task.status.status_un_modify,
      task_status_prj_error: sp_datas.task.status.status_proj_error,
      task_status_over_area: sp_datas.task.status.status_over_area,

      task_status_taskDelay: sp_datas.task.status.status_devtask_delay,
      task_status_wait: sp_datas.task.status.status_dev_wait,
      task_status_doing: sp_datas.task.status.status_developing,
      task_status_done: sp_datas.task.status.status_dev_done,

      task_status_raseTestDelay: sp_datas.task.status.status_raisetest_delay,
      task_status_raseTestWait: '',
      task_status_raseTestDone: '',

      task_status_testDelay: sp_datas.task.status.status_testtask_delay,
      task_status_testWait: sp_datas.task.status.status_test_wait,
      task_status_testDoing: sp_datas.task.status.status_testing,
      task_status_testDone: sp_datas.task.status.status_test_done,

      // bug
      task_bug_noAssign: sp_datas.task.bug.Bug_no_assign,
      task_bug_noDeadline: sp_datas.task.bug.Bug_no_deadline,
      task_bug_prj_error: sp_datas.task.bug.Bug_proj_error,
      task_bug_over_area: sp_datas.task.bug.Bug_over_area,

      task_bug_actived: sp_datas.task.bug.Bug_actived,
      task_bug_resolved: sp_datas.task.bug.Bug_resolved,
      task_bug_vertified: sp_datas.task.bug.Bug_verified,
      task_bug_closed: sp_datas.task.bug.Bug_closed,

      task_bug_ac24: '',
      task_bug_ac1624: '',
      task_bug_ac0816: '',
      task_bug_ac08: '',

      task_bug_ve24: '',
      task_bug_ve1624: '',
      task_bug_ve0816: '',
      task_bug_ve08: '',

      // endregion

      // region bug
      all_bug_counts: sp_datas.bug.all_bug_count,
      bug_noAssign: sp_datas.bug.Bug_no_assign,
      bug_noDeadline: sp_datas.bug.Bug_no_deadline,
      bug_prj_error: '',
      bug_over_area: '',

      bug_actived: sp_datas.bug.Bug_actived,
      bug_resolved: sp_datas.bug.Bug_resolved,
      bug_vertified: sp_datas.bug.Bug_verified,
      bug_closed: sp_datas.bug.Bug_closed,

      bug_ac24: '',
      bug_ac1624: '',
      bug_ac0816: '',
      bug_ac08: '',

      bug_ve24: '',
      bug_ve1624: '',
      bug_ve0816: '',
      bug_ve08: ''
      // endregion
    });
  };

  // endregion

  const emergency_url = `projectid=${selectedName.emergency.id}&project=${selectedName.emergency.name}`;
  const hotfix_url = `projectid=${selectedName.hotfix.id}&project=${selectedName.hotfix.name}`;
  const sprint_url = `projectid=${selectedName.sprint.id}&project=${selectedName.sprint.name}`;

  useEffect(() => {

    setSelectedName({

      emergency: {
        id: oraProject.emergency.id === "" ? "" : oraProject.emergency.id,
        name: oraProject.emergency.name === "" ? "emergency" : oraProject.emergency.name
      },
      hotfix: {
        id: oraProject.hotfix.id === "" ? "" : oraProject.hotfix.id,
        name: oraProject.hotfix.name === "" ? "hotfix" : oraProject.hotfix.name
      },
      sprint: {
        id: oraProject.sprint.id === "" ? "" : oraProject.sprint.id,
        name: oraProject.sprint.name === "" ? "sprint" : oraProject.sprint.name
      },
    });

    let em_bug_hidden = true;
    let ho_story_hidden = true;
    let ho_task_hidden = true;
    let ho_bug_hidden = true;
    // emergency 初始值赋值
    if (JSON.stringify(em_data) !== "{}" && emergency.noAssign === '') {
      setEmergency({
        all_count_bug: em_data.all_bug_count,
        noAssign: em_data.Bug_no_assign,
        noDeadline: em_data.Bug_no_deadline,
        prj_error: '',
        over_area: '',
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
      em_bug_hidden = false;
    }
    // console.log("em_data", em_data);

    // hotfix 初始值赋值
    if (JSON.stringify(ho_data) !== "{}" && hotfix.story_status_draft === '') {
      if (ho_data.story !== "{}") {
        ho_story_hidden = false;

      }
      if (ho_data.task !== "{}") {
        ho_task_hidden = false;

      }
      if (ho_data.bug !== "{}") {
        ho_bug_hidden = false;

      }

      setHotfix({
        // region 需求
        story_all_count: ho_data.story.allCount,

        // 状态
        story_status_draft: ho_data.story.status.status_draft,
        story_status_noTask: ho_data.story.status.status_no_task,
        story_status_lackTask: ho_data.story.status.status_lack_task,
        story_status_noDeadline: ho_data.story.status.status_no_deadline,
        story_status_noAssign: ho_data.story.status.status_no_assign,
        story_status_noBug: ho_data.story.status.status_no_bug,
        story_status_noModify: ho_data.story.status.status_un_modify,
        story_status_prj_error: ho_data.story.status.status_proj_error,
        story_status_over_area: ho_data.story.status.status_over_area,

        story_status_delay: ho_data.story.status.status_devtask_delay,
        story_status_wait: ho_data.story.status.status_dev_wait,
        story_status_doing: ho_data.story.status.status_developing,
        story_status_done: ho_data.story.status.status_dev_done,

        story_status_raseTestDelay: ho_data.story.status.status_raisetest_delay,
        story_status_raseTestWait: ho_data.story.status.status_un_raisetest,
        story_status_raseTestDone: ho_data.story.status.status_raisetest_done,

        story_status_testDelay: ho_data.story.status.status_testtask_delay,
        story_status_testWait: ho_data.story.status.status_test_wait,
        story_status_testDoing: ho_data.story.status.status_testing,
        story_status_testDone: ho_data.story.status.status_test_done,

        // bug
        story_bug_noAssign: '',
        story_bug_noDeadline: '',
        story_bug_prj_error: '',
        story_bug_over_area: '',
        story_bug_actived: '',
        story_bug_resolved: '',
        story_bug_vertified: '',
        story_bug_closed: '',
        story_bug_ac24: '',
        story_bug_ac1624: '',
        story_bug_ac0816: '',
        story_bug_ac08: '',
        story_bug_ve24: '',
        story_bug_ve1624: '',
        story_bug_ve0816: '',
        story_bug_ve08: '',

        // endregion

        // region 任务
        task_all_count: ho_data.task.allCount,

        // 状态
        task_status_noTask: ho_data.task.status.status_no_task,
        task_status_noDeadline: ho_data.task.status.status_no_deadline,
        task_status_noAssign: ho_data.task.status.status_no_assign,
        task_status_noBug: ho_data.task.status.status_no_bug,
        task_status_noModify: ho_data.task.status.status_un_modify,
        task_status_prj_error: ho_data.task.status.status_proj_error,
        task_status_over_area: ho_data.task.status.status_over_area,

        task_status_taskDelay: ho_data.task.status.status_devtask_delay,
        task_status_wait: ho_data.task.status.status_dev_wait,
        task_status_doing: ho_data.task.status.status_developing,
        task_status_done: ho_data.task.status.status_dev_done,

        task_status_raseTestDelay: ho_data.task.status.status_raisetest_delay,
        task_status_raseTestWait: '',
        task_status_raseTestDone: '',

        task_status_testDelay: ho_data.task.status.status_testtask_delay,
        task_status_testWait: ho_data.task.status.status_test_wait,
        task_status_testDoing: ho_data.task.status.status_testing,
        task_status_testDone: ho_data.task.status.status_test_done,

        // bug
        task_bug_noAssign: ho_data.task.bug.Bug_no_assign,
        task_bug_noDeadline: ho_data.task.bug.Bug_no_deadline,
        task_bug_prj_error: ho_data.task.bug.Bug_proj_error,
        task_bug_over_area: ho_data.task.bug.Bug_over_area,

        task_bug_actived: ho_data.task.bug.Bug_actived,
        task_bug_resolved: ho_data.task.bug.Bug_resolved,
        task_bug_vertified: ho_data.task.bug.Bug_verified,
        task_bug_closed: ho_data.task.bug.Bug_closed,

        task_bug_ac24: '',
        task_bug_ac1624: '',
        task_bug_ac0816: '',
        task_bug_ac08: '',

        task_bug_ve24: '',
        task_bug_ve1624: '',
        task_bug_ve0816: '',
        task_bug_ve08: '',

        // endregion

        // region bug

        all_bug_counts: ho_data.bug.all_bug_count,

        bug_noAssign: ho_data.bug.Bug_no_assign,
        bug_noDeadline: ho_data.bug.Bug_no_deadline,
        bug_prj_error: '',
        bug_over_area: '',

        bug_actived: ho_data.bug.Bug_actived,
        bug_resolved: ho_data.bug.Bug_resolved,
        bug_vertified: ho_data.bug.Bug_verified,
        bug_closed: ho_data.Bug_closed,

        bug_ac24: '',
        bug_ac1624: '',
        bug_ac0816: '',
        bug_ac08: '',

        bug_ve24: '',
        bug_ve1624: '',
        bug_ve0816: '',
        bug_ve08: ''
        // endregion
      });

    }
    // console.log("ho_data", ho_data);

    // sprint 初始值赋值
    if (JSON.stringify(sp_data) !== "{}" && sprint.story_status_draft === '') {
      setsprint({
        // region 需求
        story_all_count: sp_data.story.allCount,

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
        story_bug_ac24: '',
        story_bug_ac1624: '',
        story_bug_ac0816: '',
        story_bug_ac08: '',
        story_bug_ve24: '',
        story_bug_ve1624: '',
        story_bug_ve0816: '',
        story_bug_ve08: '',

        // endregion

        // region 任务
        task_all_count: sp_data.task.allCount,

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
        task_status_raseTestWait: '',
        task_status_raseTestDone: '',

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

        task_bug_ac24: '',
        task_bug_ac1624: '',
        task_bug_ac0816: '',
        task_bug_ac08: '',

        task_bug_ve24: '',
        task_bug_ve1624: '',
        task_bug_ve0816: '',
        task_bug_ve08: '',

        // endregion

        // region bug
        all_bug_counts: sp_data.bug.all_bug_count,

        bug_noAssign: sp_data.bug.Bug_no_assign,
        bug_noDeadline: sp_data.bug.Bug_no_deadline,
        bug_prj_error: '',
        bug_over_area: '',

        bug_actived: sp_data.bug.Bug_actived,
        bug_resolved: sp_data.bug.Bug_resolved,
        bug_vertified: sp_data.bug.Bug_verified,
        bug_closed: sp_data.Bug_closed,

        bug_ac24: '',
        bug_ac1624: '',
        bug_ac0816: '',
        bug_ac08: '',

        bug_ve24: '',
        bug_ve1624: '',
        bug_ve0816: '',
        bug_ve08: ''
        // endregion
      });

    }

    // console.log("sp_data", sp_data);

    if (ho_story_hidden === true && ho_task_hidden === true && ho_bug_hidden === true) {  // 如果初始化所有hotfix都没有数据，那么就显示所有的hotfix项
      // 设置可见性
      setHidden({
        em_bug: em_bug_hidden,
        ho_story: false,
        ho_task: false,
        ho_bug: false
      });
    } else {
      // 设置可见性
      setHidden({
        em_bug: em_bug_hidden,
        ho_story: ho_story_hidden,
        ho_task: ho_task_hidden,
        ho_bug: ho_bug_hidden
      });
    }


  }, [sp_data.showFlag]);   //   sp_data.story.status.status_lack_task   em_data.Bug_no_deadline


  const cssStyle = {
    itemStyle: {display: "inline-block", width: "60px"},
    linkStyle: {display: "inline-block", width: "10px"},
    unitStyle: {marginLeft: "8px"}
  };
  return (

    <PageContainer style={{height: "102%", backgroundColor: "white"}}>
      <div>
        <Row gutter={16}>

          {/* 第一列 */}
          <Col className="gutter-row" span={12}>
            <div style={{height: '101%', backgroundColor: "#F2F2F2"}}>

              {/* emergency 下拉框 */}
              <div>
                <Select value={selectedName.emergency.name}
                        style={{
                          width: '200px',
                          marginLeft: "20px",
                          marginTop: '20px',
                          fontSize: "15px",
                        }}
                        disabled={judgeAuthority("查看下拉列表") !== true}
                        showSearch={true} optionFilterProp="children"
                        onChange={emergencyChanged}>{emergencySelect}</Select>
                <Button type="text"
                        style={{
                          float: "right", color: 'black', marginTop: '20px', marginRight: "10px",
                          display: judgeAuthority("查看项目清单All") === true ? "inline" : "none"
                        }}
                        icon={<SearchOutlined/>}
                        size={'large'}
                        onClick={() => {
                          history.push(`/sprint/sprintListDetails?projectid=${selectedName.emergency.id}&project=${selectedName.emergency.name}`);
                        }}>项目清单</Button>
                <Button type="text" style={{float: "right", color: 'black', marginTop: '20px', marginRight: "10px"}}
                        icon={<SearchOutlined/>}
                        size={'large'}
                        onClick={() => {
                          history.push(`/sprint/sprintListDetails?projectid=${selectedName.emergency.id}&project=${selectedName.emergency.name}`);
                        }}> 超范围清单 </Button>

              </div>
              {/* emergency 数据显示div */}
              <div className="site-card-wrapper" style={{marginTop: '30px', marginLeft: "20px", marginRight: "20px"}}
                   hidden={hidden.em_bug}>
                <div style={{
                  marginTop: "-20px",
                  width: "100%",
                  fontSize: "15px",
                  backgroundColor: "white"
                }}>&nbsp;hotfix &nbsp;
                  <Link
                    to={`/sprint/sprintListDetails?${emergency_url}&type=BUG`}>{emergency.all_count_bug}</Link> &nbsp;个
                </div>

                <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

                  <Col span={2}>
                    <div style={{backgroundColor: "white", height: "145px", textAlign: "center"}}>
                      <button
                        style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>Bug
                      </button>
                    </div>
                  </Col>

                  {/* 规范检查 */}
                  <Col span={5}>
                    <Card title="规范检查" size={"small"}
                          headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                          bodyStyle={{height: "110px", textAlign: "left"}}>

                      <div>

                        <div style={{whiteSpace: "nowrap"}}>
                          <label style={cssStyle.itemStyle}>无指派</label>
                          <label style={cssStyle.linkStyle}>
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${emergency_url}&item=bug_no_assign`}>{emergency.noAssign}</Link>
                          </label>
                          <label style={cssStyle.unitStyle}>个</label>
                        </div>

                        <div style={{whiteSpace: "nowrap"}}>
                          <label style={cssStyle.itemStyle}>无排期</label>
                          <label style={cssStyle.linkStyle}>
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${emergency_url}&item=bug_no_deadline`}>{emergency.noDeadline}</Link>
                          </label>
                          <label style={cssStyle.unitStyle}>个</label>
                        </div>

                        <div style={{whiteSpace: "nowrap"}}>
                          <label style={cssStyle.itemStyle}>项目错误</label>
                          <label style={cssStyle.linkStyle}>
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${emergency_url}&item=bug_proj_error`}>{emergency.prj_error}</Link>
                          </label>
                          <label style={cssStyle.unitStyle}>个</label>
                        </div>

                        <div style={{whiteSpace: "nowrap"}}>
                          <label style={cssStyle.itemStyle}>超范围</label>
                          <label style={cssStyle.linkStyle}>
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${emergency_url}&item=bug_over_area`}>{emergency.over_area}</Link>
                          </label>
                          <label style={cssStyle.unitStyle}>个</label>
                        </div>

                      </div>
                    </Card>
                  </Col>

                  {/* bug状态 */}
                  <Col span={5}>
                    <Card title="bug状态" size={"small"}
                          headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                          bodyStyle={{height: "110px", textAlign: "left"}}>
                      <div>
                        <div style={{whiteSpace: "nowrap"}}>
                          <label style={cssStyle.itemStyle}>激活</label>
                          <label style={cssStyle.linkStyle}>
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${emergency_url}&item=actived`}>{emergency.actived}</Link>
                          </label>
                          <label style={cssStyle.unitStyle}>个</label>
                        </div>

                        <div style={{whiteSpace: "nowrap"}}>
                          <label style={cssStyle.itemStyle}>已解决</label>
                          <label style={cssStyle.linkStyle}>
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${emergency_url}&item=resolved`}>{emergency.resolved}</Link>
                          </label>
                          <label style={cssStyle.unitStyle}>个</label>
                        </div>

                        <div style={{whiteSpace: "nowrap"}}>
                          <label style={cssStyle.itemStyle}>已验证</label>
                          <label style={cssStyle.linkStyle}>
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${emergency_url}&item=bug_verified`}>{emergency.vertified}</Link>
                          </label>
                          <label style={cssStyle.unitStyle}>个</label>
                        </div>

                        <div style={{whiteSpace: "nowrap"}}>
                          <label style={cssStyle.itemStyle}>已关闭</label>
                          <label style={cssStyle.linkStyle}>
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${emergency_url}&item=closed`}>{emergency.closed}</Link>
                          </label>
                          <label style={cssStyle.unitStyle}>个</label>
                        </div>

                      </div>
                    </Card>
                  </Col>

                  {/* 激活时长 */}
                  <Col span={6}>
                    <Card title="激活时长" size={"small"}
                          headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                          bodyStyle={{height: "110px", textAlign: "left"}}>
                      <div>
                        <div style={{whiteSpace: "nowrap"}}>
                          <label style={cssStyle.itemStyle}>&gt;24H</label>
                          <label style={cssStyle.linkStyle}>
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${emergency_url}&item=ac_>24H`}>{emergency.ac24}</Link>
                          </label>
                          <label style={cssStyle.unitStyle}>个</label>
                        </div>

                        <div style={{whiteSpace: "nowrap"}}>
                          <label style={cssStyle.itemStyle}>16-24H</label>
                          <label style={cssStyle.linkStyle}>
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${emergency_url}&item=ac_16-24H`}>{emergency.ac1624}</Link>
                          </label>
                          <label style={cssStyle.unitStyle}>个</label>
                        </div>

                        <div style={{whiteSpace: "nowrap"}}>
                          <label style={cssStyle.itemStyle}>8-16H</label>
                          <label style={cssStyle.linkStyle}>
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${emergency_url}&item=ac_8-16H`}>{emergency.ac0816}</Link>
                          </label>
                          <label style={cssStyle.unitStyle}>个</label>
                        </div>

                        <div style={{whiteSpace: "nowrap"}}>
                          <label style={cssStyle.itemStyle}>&lt;8H</label>
                          <label style={cssStyle.linkStyle}>
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${emergency_url}&item=ac_<8H`}>{emergency.ac08}</Link>
                          </label>
                          <label style={cssStyle.unitStyle}>个</label>
                        </div>

                      </div>
                    </Card>
                  </Col>

                  {/* 待回验时长 */}
                  <Col span={6}>
                    <Card title="待回验时长" size={"small"}
                          headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                          bodyStyle={{height: "110px", textAlign: "left"}}>
                      <div>
                        <div style={{whiteSpace: "nowrap"}}>
                          <label style={cssStyle.itemStyle}>&gt;24H</label>
                          <label style={cssStyle.linkStyle}>
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${emergency_url}&item=ve_>24H`}>{emergency.ve24}</Link>
                          </label>
                          <label style={cssStyle.unitStyle}>个</label>
                        </div>

                        <div style={{whiteSpace: "nowrap"}}>
                          <label style={cssStyle.itemStyle}>16-24H</label>
                          <label style={cssStyle.linkStyle}>
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${emergency_url}&item=ve_16-24H`}>{emergency.ve1624}</Link>
                          </label>
                          <label style={cssStyle.unitStyle}>个</label>
                        </div>


                        <div style={{whiteSpace: "nowrap"}}>
                          <label style={cssStyle.itemStyle}>8-16H</label>
                          <label style={cssStyle.linkStyle}>
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${emergency_url}&item=ve_8-16H`}>{emergency.ve0816}</Link>
                          </label>
                          <label style={cssStyle.unitStyle}>个</label>
                        </div>

                        <div style={{whiteSpace: "nowrap"}}>
                          <label style={cssStyle.itemStyle}>&lt;8H</label>
                          <label style={cssStyle.linkStyle}>
                            <Link
                              to={`/sprint/basicTable/bugs/bugDetails?${emergency_url}&item=ve_<8H`}>{emergency.ve08}</Link>
                          </label>
                          <label style={cssStyle.unitStyle}>个</label>
                        </div>

                      </div>
                    </Card>
                  </Col>

                </Row>

              </div>

              {/* hotfix 下拉框 */}
              <div style={{marginTop: "20px"}}>
                <Select value={selectedName.hotfix.name}
                        style={{
                          width: '200px',
                          marginLeft: "20px",
                          fontSize: "15px",
                        }}
                        disabled={judgeAuthority("查看下拉列表") !== true}
                        showSearch optionFilterProp="children" onChange={hotfixChanged}>{hotfixSelect}</Select>
                <Button type="text" style={{
                  float: "right",
                  color: 'black',
                  marginRight: "10px",
                  display: judgeAuthority("查看项目清单All") === true ? "inline" : "none"
                }}
                        icon={<SearchOutlined/>}
                        size={'large'}
                        onClick={() => {
                          history.push(`/sprint/sprintListDetails?projectid=${selectedName.hotfix.id}&project=${selectedName.hotfix.name}`);
                        }}>项目清单</Button>

                <Button type="text" style={{float: "right", color: 'black', marginRight: "10px"}}
                        icon={<SearchOutlined/>}
                        size={'large'}
                        onClick={() => {
                          history.push(`/sprint/sprintListDetails?projectid=${selectedName.hotfix.id}&project=${selectedName.hotfix.name}`);
                        }}>超范围清单</Button>

              </div>
              {/* hotfix数据显示div */}
              <div>
                {/* 需求 */}
                <div className="site-card-wrapper" style={{marginTop: '30px', marginLeft: "20px", marginRight: "20px"}}
                     hidden={hidden.ho_story}>

                  <div style={{
                    marginTop: "-20px",
                    width: "100%",
                    fontSize: "15px",
                    backgroundColor: "white"
                  }}>&nbsp;需求 &nbsp;
                    {/* <Link to={`/sprint/basicTable/stories/storyAll?${hotfix_url}`}>{hotfix.story_all_count}</Link> &nbsp;个 */}
                    <Link
                      to={`/sprint/sprintListDetails?${hotfix_url}&type=STORY`}>{hotfix.story_all_count}</Link> &nbsp;个

                  </div>

                  {/* 需求-状态 */}
                  <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

                    <Col span={2}>
                      <div style={{backgroundColor: "white", height: "240px", textAlign: "center"}}>
                        <button
                          style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "100px"}}>状态
                        </button>
                      </div>
                    </Col>

                    {/* 规范检查 */}
                    <Col span={5}>
                      <Card title="规范检查" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "205px", textAlign: "left"}}>

                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>草稿</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/stories/storyDetails?${hotfix_url}&item=draft`}>{hotfix.story_status_draft}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>无任务</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/stories/storyDetails?${hotfix_url}&item=no_task`}>{hotfix.story_status_noTask}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>缺任务</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/stories/storyDetails?${hotfix_url}&item=lack_task`}>{hotfix.story_status_lackTask}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>无排期</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/stories/storyDetails?${hotfix_url}&item=no_deadline`}>{hotfix.story_status_noDeadline}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>无指派</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/stories/storyDetails?${hotfix_url}&item=no_assign`}>{hotfix.story_status_noAssign}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>无bug</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/stories/storyDetails?${hotfix_url}&item=no_bug`}>{hotfix.story_status_noBug}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>未更新</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/stories/storyDetails?${hotfix_url}&item=un_modify`}>{hotfix.story_status_noModify}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>项目错误</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/stories/storyDetails?${hotfix_url}&item=proj_error`}>{hotfix.story_status_prj_error}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>超范围</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/stories/storyDetails?${hotfix_url}&item=over_area`}>{hotfix.story_status_over_area}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 开发进展 */}
                    <Col span={5}>
                      <Card title="开发进展" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "205px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>任务延期</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/stories/storyDetails?${hotfix_url}&item=devtask_delay`}>{hotfix.story_status_delay}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>未开始</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/stories/storyDetails?${hotfix_url}&item=dev_wait`}>{hotfix.story_status_wait}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>开发中</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/stories/storyDetails?${hotfix_url}&item=developing`}>{hotfix.story_status_doing}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>


                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>开发完</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/stories/storyDetails?${hotfix_url}&item=dev_done`}>{hotfix.story_status_done}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 提测进展 */}
                    <Col span={6}>
                      <Card title="提测进展" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "205px", textAlign: "left"}}>
                        <div>
                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>提测延期</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/stories/storyDetails?${hotfix_url}&item=raisetest_delay`}>{hotfix.story_status_raseTestDelay}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>未提测</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/stories/storyDetails?${hotfix_url}&item=un_raisetest`}>{hotfix.story_status_raseTestWait}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>已提测</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/stories/storyDetails?${hotfix_url}&item=raisetest_done`}>{hotfix.story_status_raseTestDone}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 测试进展 */}
                    <Col span={6}>
                      <Card title="测试进展" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "205px", textAlign: "left"}}>
                        <div>
                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>任务延期</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/stories/storyDetails?${hotfix_url}&item=testtask_delay`}>{hotfix.story_status_testDelay}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>未开始</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/stories/storyDetails?${hotfix_url}&item=test_wait`}>{hotfix.story_status_testWait}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>测试中</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/stories/storyDetails?${hotfix_url}&item=testing`}>{hotfix.story_status_testDoing}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>测试完</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/stories/storyDetails?${hotfix_url}&item=test_done`}>{hotfix.story_status_testDone}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>
                  </Row>

                  {/* 需求-bug */}
                  <Row gutter={8} align={"middle"} style={{marginTop: "10px"}}>   {/* gutter 每一列的间隔距离 */}

                    <Col span={2}>
                      <div style={{backgroundColor: "white", height: "135px", textAlign: "center"}}>
                        <button
                          style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>Bug
                          <Link
                            to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=bug_no_assign`}> 0</Link> 个
                        </button>
                      </div>
                    </Col>

                    {/* 规范检查 */}
                    <Col span={5}>
                      <Card title="规范检查" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>

                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>无指派</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=bug_no_assign`}>{hotfix.story_bug_noAssign}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>无排期</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=bug_no_deadline`}>{hotfix.story_bug_noDeadline}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>项目错误</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=bug_proj_error`}>{hotfix.story_bug_prj_error}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap", display: "none"}}>
                            <label style={cssStyle.itemStyle}>超范围</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=bug_over_area`}>{hotfix.story_bug_over_area}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* bug状态 */}
                    <Col span={5}>
                      <Card title="bug状态" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div>
                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>激活</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=actived`}>{hotfix.story_bug_actived}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>已解决</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=resolved`}>{hotfix.story_bug_resolved}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>已验证</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=bug_verified`}>{hotfix.story_bug_vertified}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>已关闭</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=closed`}>{hotfix.story_bug_closed}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 激活时长 */}
                    <Col span={6}>
                      <Card title="激活时长" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div>
                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&gt;24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ac_>24H`}>{hotfix.story_bug_ac24}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>16-24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ac_16-24H`}>{hotfix.story_bug_ac1624}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>8-16H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ac_8-16H`}>{hotfix.story_bug_ac0816}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&lt;8H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ac_<8H`}>{hotfix.story_bug_ac08}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 待回验时长 */}
                    <Col span={6}>
                      <Card title="待回验时长" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&gt;24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ve_>24H`}>{hotfix.story_bug_ve24}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>16-24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ve_16-24H`}>{hotfix.story_bug_ve1624}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>


                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>8-16H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ve_8-16H`}>{hotfix.story_bug_ve0816}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&lt;8H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ve_<8H`}>{hotfix.story_bug_ve08}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                  </Row>

                </div>

                {/* 任务 */}
                <div className="site-card-wrapper" style={{marginTop: '30px', marginLeft: "20px", marginRight: "20px"}}
                     hidden={hidden.ho_task}>
                  <div style={{
                    marginTop: "-20px",
                    width: "100%",
                    fontSize: "15px",
                    backgroundColor: "white"
                  }}>&nbsp;任务 &nbsp;
                    {/* <Link to={`/sprint/basicTable/tasks/taskAll?${hotfix_url}`}>{hotfix.task_all_count}</Link> &nbsp;个 */}
                    <Link
                      to={`/sprint/sprintListDetails?${hotfix_url}&type=TASK`}>{hotfix.task_all_count}</Link> &nbsp;个
                  </div>

                  {/* 任务-状态 */}
                  <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

                    <Col span={2}>
                      <div style={{backgroundColor: "white", height: "195px", textAlign: "center"}}>
                        <button
                          style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>状态
                        </button>
                      </div>
                    </Col>

                    {/* 规范检查 */}
                    <Col span={5}>
                      <Card title="规范检查" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "160px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>无任务</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${hotfix_url}&item='no_task`}>{hotfix.task_status_noTask}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>无排期</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${hotfix_url}&item=no_deadline`}>{hotfix.task_status_noDeadline}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>无指派</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${hotfix_url}&item=no_assign`}>{hotfix.task_status_noAssign}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>无bug</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${hotfix_url}&item=no_bug`}>{hotfix.task_status_noBug}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>未更新</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${hotfix_url}&item=un_modify`}>{hotfix.task_status_noModify}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>项目错误</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${hotfix_url}&item=proj_error`}>{hotfix.task_status_prj_error}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>超范围</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${hotfix_url}&item=over_area`}>{hotfix.task_status_over_area}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 开发进展 */}
                    <Col span={5}>
                      <Card title="开发进展" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "160px", textAlign: "left"}}>
                        <div>
                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>任务延期</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${hotfix_url}&item=devtask_delay`}>{hotfix.task_status_taskDelay}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>未开始</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${hotfix_url}&item=dev_wait`}>{hotfix.task_status_wait}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>开发中</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${hotfix_url}&item=developing`}>{hotfix.task_status_doing}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>开发完</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${hotfix_url}&item=dev_done`}>{hotfix.task_status_done}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 提测进展 */}
                    <Col span={6}>
                      <Card title="提测进展" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "160px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>提测延期</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${hotfix_url}&item=raisetest_delay`}>{hotfix.task_status_raseTestDelay}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>未提测</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${hotfix_url}&item=un_raisetest`}>{hotfix.task_status_raseTestWait}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>已提测</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${hotfix_url}&item=raisetest_done`}>{hotfix.task_status_raseTestDone}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 测试进展 */}
                    <Col span={6}>
                      <Card title="测试进展" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "160px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>任务延期</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${hotfix_url}&item=testtask_delay`}>{hotfix.task_status_testDelay}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>未开始</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${hotfix_url}&item=test_wait`}>{hotfix.task_status_testWait}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>测试中</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${hotfix_url}&item=testing`}>{hotfix.task_status_testDoing}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>测试完</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${hotfix_url}&item=test_done`}>{hotfix.task_status_testDone}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                  </Row>

                  {/* 任务-bug */}
                  <Row gutter={8} align={"middle"} style={{marginTop: "10px"}}>   {/* gutter 每一列的间隔距离 */}

                    <Col span={2}>
                      <div style={{backgroundColor: "white", height: "135px", textAlign: "center"}}>
                        <button
                          style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>Bug
                          <Link
                            to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=bug_no_assign`}> 0</Link> 个
                        </button>
                      </div>
                    </Col>

                    {/* 规范检查 */}
                    <Col span={5}>
                      <Card title="规范检查" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>

                        <div>
                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>无指派</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=bug_no_assign`}>{hotfix.task_bug_noAssign}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>无排期</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=bug_no_deadline`}>{hotfix.task_bug_noDeadline}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>项目错误</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=bug_proj_error`}>{hotfix.task_bug_prj_error}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap", display: "none"}}>
                            <label style={cssStyle.itemStyle}>超范围</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=bug_over_area`}>{hotfix.task_bug_over_area}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* bug状态 */}
                    <Col span={5}>
                      <Card title="bug状态" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>激活</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=actived`}>{hotfix.task_bug_actived}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>已解决</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=resolved`}>{hotfix.task_bug_resolved}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>已验证</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=bug_verified`}>{hotfix.task_bug_vertified}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>已关闭</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=closed`}>{hotfix.task_bug_closed}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 激活时长 */}
                    <Col span={6}>
                      <Card title="激活时长" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&gt;24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ac_>24H`}>{hotfix.task_bug_ac24}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>16-24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ac_16-24H`}>{hotfix.task_bug_ac1624}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>8-16H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ac_8-16H`}>{hotfix.task_bug_ac0816}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&lt;8H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ac_<8H`}>{hotfix.task_bug_ac08}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 待回验时长 */}
                    <Col span={6}>
                      <Card title="待回验时长" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div>
                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&gt;24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ve_>24H`}>{hotfix.task_bug_ve24}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>16-24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ve_16-24H`}>{hotfix.task_bug_ve1624}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>8-16H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ve_8-16H`}>{hotfix.task_bug_ve0816}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&lt;8H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ve_<8H`}>{hotfix.task_bug_ve08}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                  </Row>
                </div>

                {/* bug */}
                <div className="site-card-wrapper" style={{marginTop: '30px', marginLeft: "20px", marginRight: "20px"}}
                     hidden={hidden.ho_bug}>
                  <div style={{
                    marginTop: "-20px",
                    width: "100%",
                    fontSize: "15px",
                    backgroundColor: "white"
                  }}>&nbsp;hotfix &nbsp;
                    {/* <Link to={`/sprint/basicTable/bugs/bugAll?${hotfix_url}`}>{hotfix.all_bug_counts}</Link> &nbsp;个 */}
                    <Link
                      to={`/sprint/sprintListDetails?${hotfix_url}&type=BUG`}>{hotfix.all_bug_counts}</Link> &nbsp;个
                  </div>

                  <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

                    <Col span={2}>
                      <div style={{backgroundColor: "white", height: "145px", textAlign: "center"}}>
                        <button
                          style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>Bug
                        </button>
                      </div>
                    </Col>

                    {/* 规范检查 */}
                    <Col span={5}>
                      <Card title="规范检查" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "110px", textAlign: "left"}}>

                        <div>
                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>无指派</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=bug_no_assign`}>{hotfix.bug_noAssign}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>无排期</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=bug_no_deadline`}>{hotfix.bug_noDeadline}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>项目错误</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=bug_proj_error`}>{hotfix.bug_prj_error}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>超范围</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=bug_over_area`}>{hotfix.bug_over_area}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* bug状态 */}
                    <Col span={5}>
                      <Card title="bug状态" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "110px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>激活</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=actived`}>{hotfix.bug_actived}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>已解决</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=resolved`}>{hotfix.bug_resolved}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>已验证</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=bug_verified`}>{hotfix.bug_vertified}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>已关闭</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=closed`}>{hotfix.bug_closed}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 激活时长 */}
                    <Col span={6}>
                      <Card title="激活时长" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "110px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&gt;24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ac_>24H`}>{hotfix.bug_ac24}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>16-24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ac_16-24H`}>{hotfix.bug_ac1624}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>8-16H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ac_8-16H`}>{hotfix.bug_ac0816}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&lt;8H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ac_<8H`}>{hotfix.bug_ac08}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 待回验时长 */}
                    <Col span={6}>
                      <Card title="待回验时长" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "110px", textAlign: "left"}}>
                        <div>
                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&gt;24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ve_>24H`}>{hotfix.bug_ve24}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>16-24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ve_16-24H`}>{hotfix.bug_ve1624}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>8-16H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ve_8-16H`}>{hotfix.bug_ve0816}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&lt;8H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=ve_<8H`}>{hotfix.bug_ve08}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
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
                <Select value={selectedName.sprint.name}
                        style={{
                          width: '200px',
                          marginLeft: "20px",
                          marginTop: '20px',
                          fontSize: "15px",
                        }}
                        disabled={judgeAuthority("查看下拉列表") !== true}
                        showSearch={true} optionFilterProp="children"
                        onChange={sprintChanged}>{sprintSelect}</Select>
                <Button type="text"
                        style={{
                          float: "right",
                          color: 'black',
                          marginTop: '20px',
                          marginRight: "10px",
                          display: judgeAuthority("查看项目清单All") === true ? "inline" : "none"
                        }}
                        icon={<SearchOutlined/>}
                        size={'large'}
                        onClick={() => {
                          history.push(`/sprint/sprintListDetails?projectid=${selectedName.sprint.id}&project=${selectedName.sprint.name}`);
                        }}>项目清单</Button>

                <Button type="text" style={{float: "right", color: 'black', marginTop: '20px', marginRight: "10px"}}
                        icon={<SearchOutlined/>}
                        size={'large'}
                        onClick={() => {
                          history.push(`/sprint/sprintListDetails?projectid=${selectedName.sprint.id}&project=${selectedName.sprint.name}`);
                        }}>超范围清单</Button>


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
                    {/* <Link to={`/sprint/basicTable/stories/storyAll?${sprint_url}`}>{sprint.story_all_count}</Link> &nbsp;个 */}
                    <Link
                      to={`/sprint/sprintListDetails?${sprint_url}&type=STORY`}>{sprint.story_all_count}</Link> &nbsp;个
                  </div>

                  {/* 需求-状态 */}
                  <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

                    <Col span={2}>
                      <div style={{backgroundColor: "white", height: "240px", textAlign: "center"}}>
                        <button
                          style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "100px"}}>状态
                        </button>
                      </div>
                    </Col>

                    {/* 规范检查 */}
                    <Col span={5}>
                      <Card title="规范检查" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "205px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 草稿</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/stories/storyDetails?${sprint_url}&item=draft`}>
                                {sprint.story_status_draft}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 无任务</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/stories/storyDetails?${sprint_url}&item=no_task`}>
                                {sprint.story_status_noTask}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 缺任务</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/stories/storyDetails?${sprint_url}&item=lack_task`}>
                                {sprint.story_status_lackTask}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 无排期</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/stories/storyDetails?${sprint_url}&item=no_deadline`}>
                                {sprint.story_status_noDeadline}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 无指派</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/stories/storyDetails?${sprint_url}&item=no_assign`}>
                                {sprint.story_status_noAssign}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 无bug</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/stories/storyDetails?${sprint_url}&item=no_bug`}>
                                {sprint.story_status_noBug}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 未更新</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/stories/storyDetails?${sprint_url}&item=un_modify`}>
                                {sprint.story_status_noModify}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 项目错误</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/stories/storyDetails?${sprint_url}&item=proj_error`}>
                                {sprint.story_status_prj_error}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 超范围</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/stories/storyDetails?${sprint_url}&item=over_area`}>
                                {sprint.story_status_over_area}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 开发进展 */}
                    <Col span={5}>
                      <Card title="开发进展" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "205px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 任务延期</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/stories/storyDetails?${sprint_url}&item=devtask_delay`}>
                                {sprint.story_status_delay}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 未开始</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/stories/storyDetails?${sprint_url}&item=dev_wait`}>
                                {sprint.story_status_wait}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 开发中</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/stories/storyDetails?${sprint_url}&item=developing`}>
                                {sprint.story_status_doing}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 开发完</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/stories/storyDetails?${sprint_url}&item=dev_done`}>
                                {sprint.story_status_done}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 提测进展 */}
                    <Col span={6}>
                      <Card title="提测进展" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "205px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 提测延期</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/stories/storyDetails?${sprint_url}&item=raisetest_delay`}>
                                {sprint.story_status_raseTestDelay}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 未提测</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/stories/storyDetails?${sprint_url}&item=un_raisetest`}>
                                {sprint.story_status_raseTestWait}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>


                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 已提测</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/stories/storyDetails?${sprint_url}&item=raisetest_done`}>
                                {sprint.story_status_raseTestDone}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 测试进展 */}
                    <Col span={6}>
                      <Card title="测试进展" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "205px", textAlign: "left"}}>

                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 任务延期</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/stories/storyDetails?${sprint_url}&item=testtask_delay`}>
                                {sprint.story_status_testDelay}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 未开始</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/stories/storyDetails?${sprint_url}&item=test_wait`}>
                                {sprint.story_status_testWait}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 测试中</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/stories/storyDetails?${sprint_url}&item=testing`}>
                                {sprint.story_status_testDoing}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 测试完</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/stories/storyDetails?${sprint_url}&item=test_done`}>
                                {sprint.story_status_testDone}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>
                  </Row>

                  {/* 需求-bug */}
                  <Row gutter={8} align={"middle"} style={{marginTop: "10px"}}>   {/* gutter 每一列的间隔距离 */}

                    <Col span={2}>
                      <div style={{backgroundColor: "white", height: "138px", textAlign: "center"}}>
                        <button
                          style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>Bug
                          <Link
                            to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=bug_no_assign`}> 0</Link> 个
                        </button>
                      </div>
                    </Col>

                    {/* 规范检查 */}
                    <Col span={5}>
                      <Card title="规范检查" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>

                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 无指派</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=bug_no_assign`}>
                                {sprint.story_bug_noAssign}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 无排期</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=bug_no_deadline`}>
                                {sprint.story_bug_noDeadline}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 项目错误</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=bug_proj_error`}>
                                {sprint.story_bug_prj_error}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap", display: "none"}}>
                            <label style={cssStyle.itemStyle}> 超范围</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=bug_over_area`}>
                                {sprint.story_bug_over_area}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* bug状态 */}
                    <Col span={5}>
                      <Card title="bug状态" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 激活</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=actived`}>
                                {sprint.story_bug_actived}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 已解决</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=resolved`}>
                                {sprint.story_bug_resolved}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 已验证</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=bug_verified`}>
                                {sprint.story_bug_vertified}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 已关闭</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=closed`}>
                                {sprint.story_bug_closed}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 激活时长 */}
                    <Col span={6}>
                      <Card title="激活时长" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> &gt;24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ac_>24H`}>
                                {sprint.story_bug_ac24}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 16-24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ac_16-24H`}>
                                {sprint.story_bug_ac1624}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}> 8-16H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ac_8-16H`}>
                                {sprint.story_bug_ac0816}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&lt;8H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ac_<8H`}>
                                {sprint.story_bug_ac08}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 待回验时长 */}
                    <Col span={6}>
                      <Card title="待回验时长" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&gt;24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ve_>24H`}>
                                {sprint.story_bug_ve24}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>16-24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ve_16-24H`}>
                                {sprint.story_bug_ve1624}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>


                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>8-16H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ve_8-16H`}>
                                {sprint.story_bug_ve0816}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&lt;8H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ve_<8H`}>
                                {sprint.story_bug_ve08}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
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
                    {/* <Link to={`/sprint/basicTable/tasks/taskAll?${sprint_url}`}>{sprint.task_all_count}</Link> &nbsp;个 */}
                    <Link
                      to={`/sprint/sprintListDetails?${sprint_url}&type=TASK`}>{sprint.task_all_count}</Link> &nbsp;个
                  </div>

                  {/* 任务-状态 */}
                  <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

                    <Col span={2}>
                      <div style={{backgroundColor: "white", height: "195px", textAlign: "center"}}>
                        <button
                          style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>状态
                        </button>
                      </div>
                    </Col>

                    {/*  */}
                    <Col span={5}>
                      <Card title="规范检查" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "160px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>无任务</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/tasks/taskDetails?${sprint_url}&item='no_task`}>
                                {sprint.task_status_noTask}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>无排期</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/tasks/taskDetails?${sprint_url}&item=no_deadline`}>
                                {sprint.task_status_noDeadline}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>无指派</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/tasks/taskDetails?${sprint_url}&item=no_assign`}>
                                {sprint.task_status_noAssign}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>无bug</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/tasks/taskDetails?${sprint_url}&item=no_bug`}>
                                {sprint.task_status_noBug}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>未更新</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/tasks/taskDetails?${sprint_url}&item=un_modify`}>
                                {sprint.task_status_noModify}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>项目错误</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/tasks/taskDetails?${sprint_url}&item=proj_error`}>
                                {sprint.task_status_prj_error}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>超范围</label>
                            <label style={cssStyle.linkStyle}>
                              <Link to={`/sprint/basicTable/tasks/taskDetails?${sprint_url}&item=over_area`}>
                                {sprint.task_status_over_area}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 开发进展 */}
                    <Col span={5}>
                      <Card title="开发进展" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "160px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>任务延期</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${sprint_url}&item=devtask_delay`}>{sprint.task_status_taskDelay}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>未开始</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${sprint_url}&item=dev_wait`}>{sprint.task_status_wait}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>开发中</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${sprint_url}&item=developing`}>{sprint.task_status_doing}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>开发完</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${sprint_url}&item=dev_done`}>{sprint.task_status_done}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 提测进展 */}
                    <Col span={6}>
                      <Card title="提测进展" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "160px", textAlign: "left"}}>

                        <div>
                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>提测延期</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${sprint_url}&item=raisetest_delay`}>{sprint.task_status_raseTestDelay}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>未提测</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${sprint_url}&item=un_raisetest`}>{sprint.task_status_raseTestWait}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>已提测</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${sprint_url}&item=raisetest_done`}>{sprint.task_status_raseTestDone}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 测试进展 */}
                    <Col span={6}>
                      <Card title="测试进展" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "160px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>任务延期</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${sprint_url}&item=testtask_delay`}>{sprint.task_status_testDelay}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>未开始</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${sprint_url}&item=test_wait`}>{sprint.task_status_testWait}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>测试中</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${sprint_url}&item=testing`}>{sprint.task_status_testDoing}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>测试完</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/tasks/taskDetails?${sprint_url}&item=test_done`}>{sprint.task_status_testDone}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                  </Row>

                  {/* 任务-bug */}
                  <Row gutter={8} align={"middle"} style={{marginTop: "10px"}}>   {/* gutter 每一列的间隔距离 */}

                    <Col span={2}>
                      <div style={{backgroundColor: "white", height: "135px", textAlign: "center"}}>
                        <button
                          style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>Bug
                          <Link
                            to={`/sprint/basicTable/bugs/bugDetails?${hotfix_url}&item=bug_no_assign`}> 0</Link> 个
                        </button>
                      </div>
                    </Col>

                    {/* 规范检查 */}
                    <Col span={5}>
                      <Card title="规范检查" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>

                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>无指派</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=bug_no_assign`}>{sprint.task_bug_noAssign}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>无排期</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=bug_no_deadline`}>{sprint.task_bug_noDeadline}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>项目错误</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=bug_proj_error`}>{sprint.task_bug_prj_error}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap", display: "none"}}>
                            <label style={cssStyle.itemStyle}>超范围</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=bug_over_area`}>{sprint.task_bug_over_area}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* bug状态 */}
                    <Col span={5}>
                      <Card title="bug状态" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>激活</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=actived`}>{sprint.task_bug_actived}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>已解决</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=resolved`}>{sprint.task_bug_resolved}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>已验证</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=bug_verified`}>{sprint.task_bug_vertified}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>已关闭</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=closed`}>{sprint.task_bug_closed}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 激活时长 */}
                    <Col span={6}>
                      <Card title="激活时长" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&gt;24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ac_>24H`}>{sprint.task_bug_ac24}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>16-24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ac_16-24H`}>{sprint.task_bug_ac1624}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>8-16H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ac_8-16H`}>{sprint.task_bug_ac0816}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&lt;8H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ac_<8H`}>{sprint.task_bug_ac08}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* 待回验时长 */}
                    <Col span={6}>
                      <Card title="待回验时长" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "100px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&gt;24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ve_>24H`}>{sprint.task_bug_ve24}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>16-24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ve_16-24H`}>{sprint.task_bug_ve1624}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>8-16H </label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ve_8-16H`}>{sprint.task_bug_ve0816}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&lt;8H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ve_<8H`}>{sprint.task_bug_ve08}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
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
                    {/* <Link to={`/sprint/basicTable/bugs/bugAll?${sprint_url}`}>{sprint.all_bug_counts}</Link> &nbsp;个 */}
                    <Link to={`/sprint/sprintListDetails?${sprint_url}&type=BUG`}>{sprint.all_bug_counts}</Link> &nbsp;个
                  </div>

                  <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

                    <Col span={2}>
                      <div style={{backgroundColor: "white", height: "145px", textAlign: "center"}}>
                        <button
                          style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>Bug
                        </button>
                      </div>
                    </Col>

                    {/* 规范检查 */}
                    <Col span={5}>
                      <Card title="规范检查" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "110px", textAlign: "left"}}>

                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>无指派</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=bug_no_assign`}>{sprint.bug_noAssign}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>无排期</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=bug_no_deadline`}>{sprint.bug_noDeadline}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>项目错误</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=bug_proj_error`}>{sprint.bug_prj_error}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>超范围</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=bug_over_area`}>{sprint.bug_over_area}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* bug状态 */}
                    <Col span={5}>
                      <Card title="bug状态" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "110px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>激活</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=actived`}>{sprint.bug_actived}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>已解决</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=resolved`}>{sprint.bug_resolved}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>已验证</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=bug_verified`}>{sprint.bug_vertified}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>已关闭</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=closed`}>{sprint.bug_closed}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 激活时长 */}
                    <Col span={6}>
                      <Card title="激活时长" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "110px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&gt;24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ac_>24H`}>{sprint.bug_ac24}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>16-24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ac_16-24H`}>{sprint.bug_ac1624}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>8-16H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ac_8-16H`}>{sprint.bug_ac0816}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>


                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&lt;8H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ac_<8H`}>{sprint.bug_ac08}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                        </div>
                      </Card>
                    </Col>

                    {/* 待回验时长 */}
                    <Col span={6}>
                      <Card title="待回验时长" size={"small"}
                            headStyle={{textAlign: "center", backgroundColor: "AliceBlue"}}
                            bodyStyle={{height: "110px", textAlign: "left"}}>
                        <div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&gt;24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ve_>24H`}>{sprint.bug_ve24}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>16-24H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ve_16-24H`}>{sprint.bug_ve1624}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>8-16H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ve_8-16H`}>{sprint.bug_ve0816}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
                          </div>

                          <div style={{whiteSpace: "nowrap"}}>
                            <label style={cssStyle.itemStyle}>&lt;8H</label>
                            <label style={cssStyle.linkStyle}>
                              <Link
                                to={`/sprint/basicTable/bugs/bugDetails?${sprint_url}&item=ve_<8H`}>{sprint.bug_ve08}</Link>
                            </label>
                            <label style={cssStyle.unitStyle}>个</label>
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

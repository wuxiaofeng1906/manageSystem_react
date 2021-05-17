import React, {useState} from 'react';
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
import {storyResultDeals, taskResultDeals, bugResultDeals} from "./dataProcess";

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

// 解析数据
const analyzeResult = (source: any) => {
  const newResult = Object();

  for (let index = 0; index < source.length; index += 1) {
    const datas = source[index];
    newResult[datas.name] = datas.data;
  }

  return newResult;
};

const queryDashboardViews = async (client: GqlClient<object>) => {
  const {data} = await client.query(`
      {
        dashboardAll(endDay:"2021-05-13"){
          name,
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
  return analyzeResult(data?.dashboardAll);
};


// 查询未关闭的项目，显示到下拉框中

const ProjectClassificate = (source: any) => {
  const data: any = {
    hotfix: [],
    sprint: [],
    emergency: []
  };

  source.forEach(function (project: any) {
    // debugger;
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
      <Option value={params[index].id}> {params[index].name}</Option>,
    );
  }
  return project;
};


const DashBoard: React.FC<any> = () => {
  const gqlClient = useGqlClient();
  const project: any = useRequest(() => queryProjectViews(gqlClient)).data;
  let emergencySelect = Array();
  let hotfixSelect = Array();
  let sprintSelect = Array();

  if (project !== undefined) {
    hotfixSelect = projectLoad(project.hotfix);
    emergencySelect = projectLoad(project.emergency);
    sprintSelect = projectLoad(project.sprint);

  }
  const {data} = useRequest(() => queryDashboardViews(gqlClient));

  const emergencyDatas = bugResultDeals([]);

  const url = `projectid=${emergencyPrjInfo.prjID}&project=${emergencyPrjInfo.prjName}&kind=hotfix`;



  // 定义更新状态
  const [showEmergency, setShowEmergency] = useState(true);

  // emergency下拉框事件
  const [emergency, setEmergency] = useState({
    noAssign: 0,
    noDeadline: 0,
    prj_error: 0,
    over_area: 0,
    actived: 0,
    resolved: 0,
    vertified: 0,
    closed: 0,
    ac24: 0,
    ac1624: 0,
    ac0816: 0,
    ac08: 0,
    ve24: 0,
    ve1624: 0,
    ve0816: 0,
    ve08: 0
  });
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
    setShowEmergency(false);
  };

  // hotfix下拉框事件
  const [hotfix, setHotfix] = useState({

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

  // sprint下拉框事件
  const [sprint, setsprint] = useState({

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

  return (
    <PageContainer style={{height: "102%", backgroundColor: "white"}}>sprintDetail
      <div>
        <Row gutter={16}>

          {/* 第一列 */}
          <Col className="gutter-row" span={12}>
            <div style={{height: '101%', backgroundColor: "#F2F2F2"}}>

              {/* emergency 下拉框 */}
              <div>

                <Select defaultValue={"emergencytest"}
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
                   hidden={showEmergency}>
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
                <Select defaultValue={"hotfixtest"}
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
                <Select defaultValue={"sprinttest"}
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

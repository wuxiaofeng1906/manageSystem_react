import React from 'react';
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


// region 页面代码


// sprint下拉框事件
const sprintChanged = (value: string, other: any) => {
  sprintPrjInfo.prjID = value;
  sprintPrjInfo.prjName = other.key;
};
const SprintChoiceLoad = (params: any) => {
  const sprintName = params.project;
  const sp_project = [];
  for (let index = 0; index < sprintName.length; index += 1) {

    sp_project.push(
      <Option value={sprintName[index].id}> {sprintName[index].name}</Option>,
    );
  }

  return (
    <div>
      <Select style={{width: '200px', marginLeft: "20px", marginTop: '20px', fontSize: "15px"}}
              showSearch optionFilterProp="children" onChange={sprintChanged}>
        {sp_project}
      </Select>
      <Button type="text" style={{float: "right", color: 'black', marginTop: '20px', marginRight: "10px"}}
              icon={<SearchOutlined/>}
              size={'large'}
              onClick={() => {
                history.push(`/sprint/sprintListDetails?projectid=${sprintPrjInfo.prjID}&project=${sprintPrjInfo.prjName}`);
              }}>查看项目清单All</Button>
    </div>);
};

// hotfix下拉框事件
const hotfixChanged = (value: string, other: any) => {
  hotfixPrjInfo.prjID = value;
  hotfixPrjInfo.prjName = other.key;
};
const HotfixChoiceLoad = (params: any) => {
  // 初始化值
  const hotfixName = params.project;
  const ho_project = [];
  for (let index = 0; index < hotfixName.length; index += 1) {

    ho_project.push(
      <Option value={hotfixName[index].id}> {hotfixName[index].name}</Option>,
    );
  }

  return (
    <div>
      <Select style={{width: '200px', marginLeft: "20px", marginTop: '20px', fontSize: "15px"}}
              showSearch optionFilterProp="children" onChange={hotfixChanged}>{ho_project}</Select>
      <Button type="text" style={{float: "right", color: 'black', marginTop: '20px', marginRight: "10px"}}
              icon={<SearchOutlined/>}
              size={'large'}
              onClick={() => {
                history.push(`/sprint/sprintListDetails?projectid=${hotfixPrjInfo.prjID}&project=${hotfixPrjInfo.prjName}`);
              }}>查看项目清单All</Button>
    </div>);
};

// emergency下拉框事件
const emergencyChanged = (value: string, other: any) => {
  emergencyPrjInfo.prjID = value;
  emergencyPrjInfo.prjName = other.key;
};
const EmergencyChoiceLoad = (params: any) => {
  const emerName = params.project;
  const em_project = [];
  for (let index = 0; index < emerName.length; index += 1) {
    em_project.push(
      <Option value={emerName[index].id}> {emerName[index].name}</Option>,
    );
  }

  return (
    <div>
      <Select style={{width: '200px', marginLeft: "20px", marginTop: '20px', fontSize: "15px"}}
              showSearch optionFilterProp="children" onChange={emergencyChanged}>{em_project}</Select>
      <Button type="text" style={{float: "right", color: 'black', marginTop: '20px', marginRight: "10px"}}
              icon={<SearchOutlined/>}
              size={'large'}
              onClick={() => {
                history.push(`/sprint/sprintListDetails?projectid=${emergencyPrjInfo.prjID}&project=${emergencyPrjInfo.prjName}`);
              }}>查看项目清单All</Button>
    </div>);
};

// 需求组件
const StoryLoad = (params: any) => {

  const project = params.project[0];
  const url = `projectid=${project.prjID}&project=${project.prjName}&kind=hotfix`;

  const data = storyResultDeals(params.project[1]);
  console.log("需求相关数据返回", data);

  return (<div className="site-card-wrapper" style={{marginTop: '10px', marginLeft: "20px", marginRight: "20px"}}>

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
            <button style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "100px"}}>状态</button>
          </div>
        </Col>

        {/* 规范检查 */}
        <Col span={5}>
          <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                bodyStyle={{height: "205px", textAlign: "left"}}>

            <div style={{marginTop: "-15px"}}>
              <div style={{whiteSpace: "nowrap"}}>草稿&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=draft`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>无任务&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=no_task`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>缺任务&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=lack_task`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>无排期&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=no_deadline`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>无指派&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=no_assign`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>无bug  &nbsp;&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=no_bug`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>未更新&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=un_modify`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>项目错误 &nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=proj_error`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>超范围&nbsp;
                <Link to={`/sprint/basicTable/stories/storyDetails?${url}&item=over_area`}>2</Link>&nbsp;个
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
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=devtask_delay`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>未开始&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=dev_wait`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>开发中&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=developing`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>开发完&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=dev_done`}>2</Link>&nbsp;个
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
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=raisetest_delay`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>未提测&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=un_raisetest`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>已提测&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=raisetest_done`}>2</Link>&nbsp;个
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
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=testtask_delay`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>未开始&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=test_wait`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>测试中&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=testing`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>测试完&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=test_done`}>2</Link>&nbsp;个
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 需求-bug */}
      <Row gutter={8} align={"middle"} style={{marginTop: "10px"}}>   {/* gutter 每一列的间隔距离 */}

        <Col span={2}>
          <div style={{backgroundColor: "white", height: "145px", textAlign: "center"}}>
            <button style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>Bug</button>
          </div>
        </Col>

        {/* 规范检查 */}
        <Col span={5}>
          <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue"}}
                bodyStyle={{height: "100px", textAlign: "left"}}>

            <div style={{marginTop: "-15px"}}>
              <div style={{whiteSpace: "nowrap"}}>无指派  &nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_no_assign`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>无排期  &nbsp;&nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_no_deadline`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>项目错误&nbsp;
                <Link to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_proj_error`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>超范围&nbsp;
                <Link to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_over_area`}>2</Link>&nbsp;个
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
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=actived`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>已解决 &nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=resolved`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>已验证 &nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=verified`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>已关闭 &nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=closed`}>2</Link> &nbsp;个
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
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_>24H`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>16-24H  &nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_16-24H`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>8-16H  &nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_8-16H`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>&lt;8H  &nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_<8H`}>2</Link> &nbsp;个
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
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_>24H`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>16-24H&nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_16-24H`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>8-16H&nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_8-16H`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>&lt;8H&nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_<8H`}>2</Link> &nbsp;个
              </div>
            </div>
          </Card>
        </Col>

      </Row>

    </div>
  );
};
// 任务组件
const TaskLoad = (params: any) => {
  const project = params.project[0];
  const url = `projectid=${project.prjID}&project=${project.prjName}&kind=hotfix`;

  const data = taskResultDeals(params.project[1]);
  console.log("任务相关数据返回", data);

  return (<div className="site-card-wrapper" style={{marginTop: '10px', marginLeft: "20px", marginRight: "20px"}}>
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
          <div style={{backgroundColor: "white", height: "185px", textAlign: "center"}}>
            <button style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>状态</button>
          </div>
        </Col>

        {/* 规范检查 */}
        <Col span={5}>
          <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                bodyStyle={{height: "140px", textAlign: "left"}}>
            <div style={{marginTop: "-15px"}}>
              <div style={{whiteSpace: "nowrap"}}>无任务&nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item='no_task`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>无排期&nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=no_deadline`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>无bug  &nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=no_bug`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>未更新&nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=un_modify`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>项目错误&nbsp;
                <Link to={`/sprint/basicTable/tasks/taskDetails?${url}&item=proj_error`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>超范围&nbsp;
                <Link to={`/sprint/basicTable/tasks/taskDetails?${url}&item=over_area`}>2</Link>&nbsp;个
              </div>

            </div>
          </Card>
        </Col>

        {/* 开发进展 */}
        <Col span={5}>
          <Card title={<div style={{marginTop: "-5px"}}> 开发进展 </div>}
                headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                bodyStyle={{height: "140px", textAlign: "left"}}>
            <div style={{marginTop: "-15px"}}>
              <div style={{whiteSpace: "nowrap"}}>任务延期&nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=devtask_delay`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>未开始&nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=dev_wait`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>开发中&nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=developing`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>开发完&nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=dev_done`}>2</Link>&nbsp;个
              </div>
            </div>
          </Card>
        </Col>

        {/* 提测进展 */}
        <Col span={6}>
          <Card title={<div style={{marginTop: "-5px"}}> 提测进展 </div>}
                headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                bodyStyle={{height: "140px", textAlign: "left"}}>
            <div style={{marginTop: "-15px"}}>
              <div style={{whiteSpace: "nowrap"}}>提测延期&nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=raisetest_delay`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>未提测&nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=un_raisetest`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>已提测&nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=raisetest_done`}>2</Link>&nbsp;个
              </div>
            </div>
          </Card>
        </Col>

        {/* 测试进展 */}
        <Col span={6}>
          <Card title={<div style={{marginTop: "-5px"}}> 测试进展 </div>}
                headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                bodyStyle={{height: "140px", textAlign: "left"}}>
            <div style={{marginTop: "-15px"}}>
              <div style={{whiteSpace: "nowrap"}}>任务延期&nbsp;;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=testtask_delay`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>未开始&nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=test_wait`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>测试中 &nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=testing`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>测试完 &nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=test_done`}>2</Link> &nbsp;个
              </div>
            </div>
          </Card>
        </Col>

      </Row>

      {/* 任务-bug */}
      <Row gutter={8} align={"middle"} style={{marginTop: "10px"}}>   {/* gutter 每一列的间隔距离 */}

        <Col span={2}>
          <div style={{backgroundColor: "white", height: "145px", textAlign: "center"}}>
            <button style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>Bug</button>
          </div>
        </Col>
        {/* 规范检查 */}
        <Col span={5}>
          <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                bodyStyle={{height: "100px", textAlign: "left"}}>

            <div style={{marginTop: "-15px"}}>
              <div style={{whiteSpace: "nowrap"}}>无指派  &nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_no_assign`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>无排期  &nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_no_deadline`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>项目错误&nbsp;
                <Link to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_proj_error`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>超范围&nbsp;
                <Link to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_over_area`}>2</Link>&nbsp;个
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
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=actived`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>已解决 &nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=resolved`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>已验证 &nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=verified`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>已关闭 &nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=closed`}>2</Link> &nbsp;个
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
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_>24H`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>16-24H  &nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_16-24H`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>8-16H  &nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_8-16H`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>&lt;8H  &nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_<8H`}>2</Link> &nbsp;个
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
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_>24H`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>16-24H  &nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_16-24H`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>8-16H  &nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_8-16H`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>&lt;8H  &nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_<8H`}>2</Link> &nbsp;个
              </div>
            </div>
          </Card>
        </Col>

      </Row>
    </div>
  );
};
// hotfix组件
const HotfixLoad = (params: any) => {

  const project = params.project[0];
  const data = bugResultDeals(params.project[1]);
  console.log("hotfix数据返回", data);

  const url = `projectid=${project.prjID}&project=${project.prjName}&kind=hotfix`;

  return (<div className="site-card-wrapper" style={{marginTop: '10px', marginLeft: "20px", marginRight: "20px"}}>
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
          <button style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>Bug</button>
        </div>
      </Col>

      {/* 规范检查 */}
      <Col span={5}>
        <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
              headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue"}}
              bodyStyle={{height: "110px", textAlign: "left"}}>

          <div style={{marginTop: "-15px"}}>
            <div style={{whiteSpace: "nowrap"}}>无指派  &nbsp;<Link
              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_no_assign`}>2</Link> &nbsp;个
            </div>
            <div style={{whiteSpace: "nowrap"}}>无排期  &nbsp;<Link
              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_no_deadline`}>2</Link> &nbsp;个
            </div>
            <div style={{whiteSpace: "nowrap"}}>项目错误&nbsp;
              <Link to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_proj_error`}>2</Link>&nbsp;个
            </div>
            <div style={{whiteSpace: "nowrap"}}>超范围&nbsp;
              <Link to={`/sprint/basicTable/bugs/bugDetails?${url}&item=bug_over_area`}>2</Link>&nbsp;个
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
              <Link to={`/sprint/basicTable/bugs/bugDetails?${url}&item=actived`}>2</Link>&nbsp;个
            </div>
            <div style={{whiteSpace: "nowrap"}}>已解决 &nbsp;<Link
              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=resolved`}>2</Link> &nbsp;个
            </div>
            <div style={{whiteSpace: "nowrap"}}>已验证 &nbsp;<Link
              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=verified`}>2</Link> &nbsp;个
            </div>
            <div style={{whiteSpace: "nowrap"}}>已关闭 &nbsp;<Link
              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=closed`}>2</Link> &nbsp;个
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
              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_>24H`}>2</Link> &nbsp;个
            </div>
            <div style={{whiteSpace: "nowrap"}}>16-24H&nbsp;<Link
              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_16-24H`}>2</Link> &nbsp;个
            </div>
            <div style={{whiteSpace: "nowrap"}}>8-16H&nbsp;<Link
              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_8-16H`}>2</Link> &nbsp;个
            </div>
            <div style={{whiteSpace: "nowrap"}}>&lt;8H&nbsp;<Link
              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ac_<8H`}>2</Link> &nbsp;个
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
              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_>24H`}>2</Link> &nbsp;个
            </div>
            <div style={{whiteSpace: "nowrap"}}>16-24H&nbsp;<Link
              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_16-24H`}>2</Link> &nbsp;个
            </div>
            <div style={{whiteSpace: "nowrap"}}>8-16H&nbsp;<Link
              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_8-16H`}>2</Link>&nbsp;个
            </div>
            <div style={{whiteSpace: "nowrap"}}>&lt;8H&nbsp;<Link
              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=ve_<8H`}>2</Link>&nbsp;个
            </div>
          </div>
        </Card>
      </Col>

    </Row>

  </div>);
};

// 左边页面
const LeftControl = (params: any) => {
  let hotfix = Array();
  let emergency = Array();

  if (params.result[1] !== undefined) {
    hotfix = params.result[1].hotfix;
    emergency = params.result[1].emergency;
  }

  return (
    <div>
      <HotfixChoiceLoad project={hotfix}/>,
      {/* <HotfixLoad project={[hotfixPrjInfo, params]}/> */}
      <EmergencyChoiceLoad project={emergency}/>,
      {/* <HotfixLoad project={[emergencyPrjInfo, params]}/> */}
    </div>

  );
};
// 右边页面
const RightControl = (params: any) => {
  // 下拉框数据
  let sprint = Array();
  if (params.result[1] !== undefined) {
    sprint = params.result[1].sprint;
  }

  let sprintStory: any = [];
  let sprintTask: any = [];
  let sprintBug: any = [];
  if (params.result[0] !== undefined) {
    const sprintDetail = params.result[0].sprint;
    sprintDetail.forEach(function (sp: any) {
      if (sp.name === "story") {
        sprintStory = sp.data;
      } else if (sp.name === "task") {
        sprintTask = sp.data;
      } else {
        sprintBug = sp.data;
      }
    });
  }

  return (
    <div>
      <SprintChoiceLoad project={sprint}/>,
      <StoryLoad project={[sprintPrjInfo, sprintStory]}/>,
      <TaskLoad project={[sprintPrjInfo, sprintTask]}/>,
      <HotfixLoad project={[sprintPrjInfo, sprintBug]}/>
    </div>
  );
};

// endregion

const DashBoard: React.FC<any> = () => {

  const gqlClient = useGqlClient();
  const project: any = useRequest(() => queryProjectViews(gqlClient)).data;
  const {data} = useRequest(() => queryDashboardViews(gqlClient));


  // 获取页面数据并解析

  return (
    <PageContainer style={{height: "102%", backgroundColor: "white"}}>
      <div>
        <Row gutter={16}>

          {/* 第一列 */}
          <Col className="gutter-row" span={12}>
            <div style={{height: '101%', backgroundColor: "#F2F2F2"}}>
              <LeftControl result={[data, project]}/>
            </div>
          </Col>

          {/* 第二列 */}
          <Col className="gutter-row" span={12}>
            <div style={{height: '101%', backgroundColor: "#F2F2F2"}}>
              <RightControl result={[data, project]}/>
            </div>
          </Col>

        </Row>
      </div>

    </PageContainer>
  );
};

export default DashBoard;

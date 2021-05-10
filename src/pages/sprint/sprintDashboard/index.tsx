import React from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {Row, Col, Select, Card, Button} from 'antd';
import {Link} from 'umi';
import {SearchOutlined} from "@ant-design/icons";
import {history} from "@@/core/history";

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

// region 页面代码


// sprint下拉框事件
const sprintChanged = (value: string, other: any) => {
  sprintPrjInfo.prjID = value;
  sprintPrjInfo.prjName = other.key;
};
const SprintProjectLoad = () => {
  // 初始化值
  sprintPrjInfo.prjID = "4790";
  sprintPrjInfo.prjName = "sprint20210427_测试项目!";

  return (
    <div>
      <Select defaultValue="4790"
              style={{width: '200px', marginLeft: "20px", marginTop: '20px', fontSize: "15px"}}
              showSearch optionFilterProp="children" onChange={sprintChanged}>
        {[
          <Option value={'4790'} key={"sprint20210427_测试项目!"}>sprint20210427_测试项目!</Option>,
          <Option value={'4733'} key={"sprint20210422"}>sprint20210422</Option>,
        ]}
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
const HotfixProjectLoad = () => {
  // 初始化值
  hotfixPrjInfo.prjID = "4790";
  hotfixPrjInfo.prjName = "hotfix20210506";

  return (
    <div>
      <Select defaultValue="4790"
              style={{width: '200px', marginLeft: "20px", marginTop: '20px', fontSize: "15px"}}
              showSearch optionFilterProp="children" onChange={hotfixChanged}>
        {[
          <Option value={'4790'} key={"hotfix20210506"}>hotfix20210506</Option>,
          <Option value={'4733'} key={"sprint20210422"}>hotfix20210422</Option>,
        ]}
      </Select>
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
const EmergencyProjectLoad = () => {
  // 初始化值
  emergencyPrjInfo.prjID = "4790";
  emergencyPrjInfo.prjName = "emergency20210507";

  return (
    <div>
      <Select defaultValue="4790"
              style={{width: '200px', marginLeft: "20px", marginTop: '20px', fontSize: "15px"}}
              showSearch optionFilterProp="children" onChange={emergencyChanged}>
        {[
          <Option value={'4790'} key={"emergency20210507"}>emergency20210507</Option>,
          <Option value={'4733'} key={"emergency20210407"}>emergency20210407</Option>,
        ]}
      </Select>
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
  const {project} = params;
  const url = `projectid=${project.prjID}&project=${project.prjName}&kind=hotfix`;


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
          <div style={{backgroundColor: "white", height: "230px", textAlign: "center"}}>
            <button style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "100px"}}>状态</button>
          </div>
        </Col>

        {/* 规范检查 */}
        <Col span={5}>
          <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                bodyStyle={{height: "185px", textAlign: "left"}}>

            <div style={{marginTop: "-15px"}}>
              <div style={{whiteSpace: "nowrap"}}>草稿&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>无任务&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>缺任务&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>无排期&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=no_deadline`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>无指派&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=no_assign`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>未更新&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=`}>2</Link>&nbsp;个
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
                bodyStyle={{height: "185px", textAlign: "left"}}>
            <div style={{marginTop: "-15px"}}>
              <div style={{whiteSpace: "nowrap"}}>任务延期&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>未开始&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>开发中&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>开发完&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
            </div>
          </Card>
        </Col>

        {/* 提测进展 */}
        <Col span={6}>
          <Card title={<div style={{marginTop: "-5px"}}> 提测进展 </div>}
                headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                bodyStyle={{height: "185px", textAlign: "left"}}>
            <div style={{marginTop: "-15px"}}>
              <div style={{whiteSpace: "nowrap"}}>提测延期&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>未提测&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>已提测&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>

            </div>
          </Card>
        </Col>

        {/* 测试进展 */}
        <Col span={6}>
          <Card title={<div style={{marginTop: "-5px"}}> 测试进展 </div>}
                headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                bodyStyle={{height: "185px", textAlign: "left"}}>
            <div style={{marginTop: "-15px"}}>
              <div style={{whiteSpace: "nowrap"}}>任务延期&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>未开始&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>测试中&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>测试完&nbsp;<Link
                to={`/sprint/basicTable/stories/storyDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 需求-bug */}
      <Row gutter={8} align={"middle"} style={{marginTop: "10px"}}>   {/* gutter 每一列的间隔距离 */}

        <Col span={2}>
          <div style={{backgroundColor: "white", height: "165px", textAlign: "center"}}>
            <button style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>Bug</button>
          </div>
        </Col>

        {/* 规范检查 */}
        <Col span={5}>
          <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue"}}
                bodyStyle={{height: "120px", textAlign: "left"}}>

            <div style={{marginTop: "-15px"}}>
              <div style={{whiteSpace: "nowrap"}}>无指派  &nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=no_assign`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>无排期  &nbsp;&nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=no_deadline`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>无bug  &nbsp;&nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=no_bug`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>项目错误&nbsp;
                <Link to={`/sprint/basicTable/bugs/bugDetails?${url}&item=proj_error`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>超范围&nbsp;
                <Link to={`/sprint/basicTable/bugs/bugDetails?${url}&item=over_area`}>2</Link>&nbsp;个
              </div>
            </div>
          </Card>
        </Col>

        {/* bug状态 */}
        <Col span={5}>
          <Card title={<div style={{marginTop: "-5px"}}> bug状态 </div>}
                headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                bodyStyle={{height: "120px", textAlign: "left"}}>
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
                bodyStyle={{height: "120px", textAlign: "left"}}>
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
                bodyStyle={{height: "120px", textAlign: "left"}}>
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
  const {project} = params;
  const url = `projectid=${project.prjID}&project=${project.prjName}&kind=hotfix`;


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
          <div style={{backgroundColor: "white", height: "165px", textAlign: "center"}}>
            <button style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>状态</button>
          </div>
        </Col>

        {/* 规范检查 */}
        <Col span={5}>
          <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                bodyStyle={{height: "120px", textAlign: "left"}}>
            <div style={{marginTop: "-15px"}}>
              <div style={{whiteSpace: "nowrap"}}>无任务&nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>无排期&nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=no_deadline`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>未更新&nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=`}>2</Link>&nbsp;个
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
                bodyStyle={{height: "120px", textAlign: "left"}}>
            <div style={{marginTop: "-15px"}}>
              <div style={{whiteSpace: "nowrap"}}>任务延期&nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>未开始&nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>开发中&nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>开发完&nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
            </div>
          </Card>
        </Col>

        {/* 提测进展 */}
        <Col span={6}>
          <Card title={<div style={{marginTop: "-5px"}}> 提测进展 </div>}
                headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                bodyStyle={{height: "120px", textAlign: "left"}}>
            <div style={{marginTop: "-15px"}}>
              <div style={{whiteSpace: "nowrap"}}>&gt;24H &nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>提测延期&nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>未提测&nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>已提测&nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
            </div>
          </Card>
        </Col>

        {/* 测试进展 */}
        <Col span={6}>
          <Card title={<div style={{marginTop: "-5px"}}> 测试进展 </div>}
                headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                bodyStyle={{height: "120px", textAlign: "left"}}>
            <div style={{marginTop: "-15px"}}>
              <div style={{whiteSpace: "nowrap"}}>任务延期&nbsp;;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>未开始&nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>测试中 &nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>测试完 &nbsp;<Link
                to={`/sprint/basicTable/tasks/taskDetails?${url}&item=`}>2</Link> &nbsp;个
              </div>
            </div>
          </Card>
        </Col>

      </Row>

      {/* 任务-bug */}
      <Row gutter={8} align={"middle"} style={{marginTop: "10px"}}>   {/* gutter 每一列的间隔距离 */}

        <Col span={2}>
          <div style={{backgroundColor: "white", height: "165px", textAlign: "center"}}>
            <button style={{backgroundColor: "white", border: "none", fontSize: "15px", marginTop: "65px"}}>Bug</button>
          </div>
        </Col>
        {/* 规范检查 */}
        <Col span={5}>
          <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                bodyStyle={{height: "120px", textAlign: "left"}}>

            <div style={{marginTop: "-15px"}}>
              <div style={{whiteSpace: "nowrap"}}>无指派  &nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=no_assign`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>无排期  &nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=no_deadline`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>无bug  &nbsp;<Link
                to={`/sprint/basicTable/bugs/bugDetails?${url}&item=no_bug`}>2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>项目错误&nbsp;
                <Link to={`/sprint/basicTable/bugs/bugDetails?${url}&item=proj_error`}>2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>超范围&nbsp;
                <Link to={`/sprint/basicTable/bugs/bugDetails?${url}&item=over_area`}>2</Link>&nbsp;个
              </div>
            </div>
          </Card>
        </Col>

        {/* bug状态 */}
        <Col span={5}>
          <Card title={<div style={{marginTop: "-5px"}}> bug状态 </div>}
                headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                bodyStyle={{height: "120px", textAlign: "left"}}>
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
                bodyStyle={{height: "120px", textAlign: "left"}}>
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
                bodyStyle={{height: "120px", textAlign: "left"}}>
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
  const {project} = params;
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
              headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
              bodyStyle={{height: "110px", textAlign: "left"}}>

          <div style={{marginTop: "-15px"}}>
            <div style={{whiteSpace: "nowrap"}}>无指派  &nbsp;<Link
              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=no_assign`}>2</Link> &nbsp;个
            </div>
            <div style={{whiteSpace: "nowrap"}}>无排期  &nbsp;<Link
              to={`/sprint/basicTable/bugs/bugDetails?${url}&item=no_deadline`}>2</Link> &nbsp;个
            </div>
            <div style={{whiteSpace: "nowrap"}}>项目错误&nbsp;
              <Link to={`/sprint/basicTable/bugs/bugDetails?${url}&item=proj_error`}>2</Link>&nbsp;个
            </div>
            <div style={{whiteSpace: "nowrap"}}>超范围&nbsp;
              <Link to={`/sprint/basicTable/bugs/bugDetails?${url}&item=over_area`}>2</Link>&nbsp;个
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
const LeftControl = () => {
  return (
    <div>
      <HotfixProjectLoad/>,
      <HotfixLoad project={hotfixPrjInfo}/>
      <EmergencyProjectLoad/>,
      <HotfixLoad project={emergencyPrjInfo}/>
    </div>

  );
};
// 右边页面
const RightControl = () => {
  return (
    <div>
      <SprintProjectLoad/>,
      <StoryLoad project={sprintPrjInfo}/>,
      <TaskLoad project={sprintPrjInfo}/>,
      <HotfixLoad project={sprintPrjInfo}/>
    </div>
  );
};

// endregion

const DashBoard: React.FC<any> = () => {

  return (
    <PageContainer style={{height: "102%", backgroundColor: "white"}}>
      <div>
        <Row gutter={16}>

          {/* 第一列 */}
          <Col className="gutter-row" span={12}>
            <div style={{height: '101%', backgroundColor: "#F2F2F2"}}>
              <LeftControl/>
            </div>
          </Col>

          {/* 第二列 */}
          <Col className="gutter-row" span={12}>
            <div style={{height: '101%', backgroundColor: "#F2F2F2"}}>
              <RightControl/>
            </div>
          </Col>

        </Row>
      </div>

    </PageContainer>
  );
};

export default DashBoard;

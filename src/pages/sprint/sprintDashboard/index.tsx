import React from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {Row, Col, Select, Card, Button} from 'antd';
import {Link} from 'umi';
import {SearchOutlined} from "@ant-design/icons";


const {Option} = Select;

const DashBoard: React.FC<any> = () => {
  // 项目下拉框加载
  const ProjectLoad = () => {

    return (
      <div>
        <Select defaultValue="1"
                style={{width: '200px', marginLeft: "20px", marginTop: '20px'}}
                showSearch optionFilterProp="children">
          {[
            <Option key={'1'} value={'1'}>sprint20201223</Option>,
            <Option key={'2'} value={'2'}>sprint20201216</Option>,
            <Option key={'3'} value={'3'}>sprint20201209</Option>,
          ]}
        </Select>
        <Button type="text" style={{float: "right", color: 'black', marginTop: '10px'}} icon={<SearchOutlined/>}
                size={'large'}>查看项目清单</Button>
      </div>);
  };
  // 需求组件
  const StoryLoad = () => {
    return (<div className="site-card-wrapper" style={{marginTop: '10px', marginLeft: "20px", marginRight: "20px"}}>

        <div style={{
          marginTop: "-20px",
          width: "100%",
          fontSize: "18px",
          backgroundColor: "white"
        }}>需求 &nbsp;
          <Link to="/sprint/sprintListDetails">10</Link> &nbsp;个
        </div>

        {/* 需求-状态 */}
        <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}


          <Col span={2}>
            <div style={{backgroundColor: "white", height: "165px", textAlign: "center"}}>
              <label style={{fontSize: '18px'}}>状态</label>
              {/* <strong style={{top: "200px"}}>状态</strong> */}
            </div>
          </Col>

          {/* 规范检查 */}
          <Col span={5}>
            <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                  headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                  bodyStyle={{height: "120px", textAlign: "center"}}>

              <div style={{marginTop: "-15px"}}>
                <div style={{whiteSpace: "nowrap"}}>草稿&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>项目错误 &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>无任务&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>无排期&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>未更新&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
              </div>
            </Card>
          </Col>

          {/* 开发进展 */}
          <Col span={5}>
            <Card title={<div style={{marginTop: "-5px"}}> 开发进展 </div>}
                  headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                  bodyStyle={{height: "120px", textAlign: "center"}}>
              <div style={{marginTop: "-15px"}}>
                <div style={{whiteSpace: "nowrap"}}>任务延期&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>未开始&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>开发中&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>开发完&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
              </div>
            </Card>
          </Col>

          {/* 提测进展 */}
          <Col span={6}>
            <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                  headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                  bodyStyle={{height: "120px", textAlign: "center"}}>
              <div style={{marginTop: "-15px"}}>
                <div style={{whiteSpace: "nowrap"}}>提测延期&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>未提测&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>已提测&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>

              </div>
            </Card>
          </Col>

          {/* 测试进展 */}
          <Col span={6}>
            <Card title={<div style={{marginTop: "-5px"}}> 测试进展 </div>}
                  headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                  bodyStyle={{height: "120px", textAlign: "center"}}>
              <div style={{marginTop: "-15px"}}>
                <div style={{whiteSpace: "nowrap"}}>任务延期&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>未开始&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>测试中&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>测试完&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 需求-bug */}
        <Row gutter={8} align={"middle"} style={{marginTop: "10px"}}>   {/* gutter 每一列的间隔距离 */}

          <Col span={2}>
            <div style={{backgroundColor: "white", height: "155px", textAlign: "center"}}>
              {/* <strong style={{top: "200px"}}>bug</strong> */}
              <label style={{fontSize: '18px'}}>Bug</label>
            </div>
          </Col>

          {/* 规范检查 */}
          <Col span={5}>
            <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                  headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                  bodyStyle={{height: "110px", textAlign: "center"}}>

              <div style={{marginTop: "-15px"}}>
                <div style={{whiteSpace: "nowrap"}}>无指派  &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>无排期  &nbsp;&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>无bug  &nbsp;&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
              </div>
            </Card>
          </Col>

          {/* bug状态 */}
          <Col span={5}>
            <Card title={<div style={{marginTop: "-5px"}}> bug状态 </div>}
                  headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                  bodyStyle={{height: "110px", textAlign: "center"}}>
              <div style={{marginTop: "-15px"}}>
                <div style={{whiteSpace: "nowrap"}}>激活 &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>已解决 &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>已验证 &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>已关闭 &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
              </div>
            </Card>
          </Col>

          {/* 激活时长 */}
          <Col span={6}>
            <Card title={<div style={{marginTop: "-5px"}}> 激活时长 </div>}
                  headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                  bodyStyle={{height: "110px", textAlign: "center"}}>
              <div style={{marginTop: "-15px"}}>
                <div style={{whiteSpace: "nowrap"}}>&gt;24H&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>16-24H  &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>8-16H  &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>&lt;8H  &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
              </div>
            </Card>
          </Col>

          {/* 待回验时长 */}
          <Col span={6}>
            <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                  headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                  bodyStyle={{height: "110px", textAlign: "center"}}>
              <div style={{marginTop: "-15px"}}>
                <div style={{whiteSpace: "nowrap"}}>&gt;24H&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>16-24H&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>8-16H&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>&lt;8H&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
              </div>
            </Card>
          </Col>

        </Row>

      </div>
    );
  };
  // 任务组件
  const TaskLoad = () => {
    return (<div className="site-card-wrapper" style={{marginTop: '10px', marginLeft: "20px", marginRight: "20px"}}>
        <div style={{
          marginTop: "-20px",
          width: "100%",
          fontSize: "18px",
          backgroundColor: "white"
        }}>任务 &nbsp;
          <Link to="/sprint/sprintListDetails">10</Link> &nbsp;个
        </div>

        {/* 任务-状态 */}
        <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

          <Col span={2}>
            <div style={{backgroundColor: "white", height: "155px", textAlign: "center"}}>
              {/* <strong style={{top: "200px"}}>状态</strong> */}
              <label style={{fontSize: "18px",}}>状态</label>
            </div>
          </Col>

          {/* 规范检查 */}
          <Col span={5}>
            <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                  headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                  bodyStyle={{height: "110px", textAlign: "center"}}>
              <div style={{marginTop: "-15px"}}>
                <div style={{whiteSpace: "nowrap"}}>项目错误&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>无任务&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>无排期&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>未更新&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
              </div>
            </Card>
          </Col>

          {/* 开发进展 */}
          <Col span={5}>
            <Card title={<div style={{marginTop: "-5px"}}> 开发进展 </div>}
                  headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                  bodyStyle={{height: "110px", textAlign: "center"}}>
              <div style={{marginTop: "-15px"}}>
                <div style={{whiteSpace: "nowrap"}}>任务延期&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>未开始&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>开发中&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>开发完&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
              </div>
            </Card>
          </Col>

          {/* 提测进展 */}
          <Col span={6}>
            <Card title={<div style={{marginTop: "-5px"}}> 提测进展 </div>}
                  headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                  bodyStyle={{height: "110px", textAlign: "center"}}>
              <div style={{marginTop: "-15px"}}>
                <div style={{whiteSpace: "nowrap"}}>&gt;24H &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>提测延期&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>未提测&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>已提测&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
              </div>
            </Card>
          </Col>

          {/* 测试进展 */}
          <Col span={6}>
            <Card title={<div style={{marginTop: "-5px"}}> 测试进展 </div>}
                  headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                  bodyStyle={{height: "110px", textAlign: "center"}}>
              <div style={{marginTop: "-15px"}}>
                <div style={{whiteSpace: "nowrap"}}>任务延期&nbsp;;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>未开始&nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link>&nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>测试中 &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>测试完 &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
              </div>
            </Card>
          </Col>

        </Row>

        {/* 任务-bug */}
        <Row gutter={8} align={"middle"} style={{marginTop: "10px"}}>   {/* gutter 每一列的间隔距离 */}

          <Col span={2}>
            <div style={{backgroundColor: "white", height: "155px", textAlign: "center"}}>
              {/* <strong style={{top: "200px"}}>bug</strong> */}
              <label style={{fontSize: "18px",}}>Bug</label>
            </div>
          </Col>
          {/* 规范检查 */}
          <Col span={5}>
            <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                  headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                  bodyStyle={{height: "110px", textAlign: "center"}}>

              <div style={{marginTop: "-15px"}}>
                <div style={{whiteSpace: "nowrap"}}>无指派  &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>无排期  &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>无bug  &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
              </div>
            </Card>
          </Col>

          {/* bug状态 */}
          <Col span={5}>
            <Card title={<div style={{marginTop: "-5px"}}> bug状态 </div>}
                  headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                  bodyStyle={{height: "110px", textAlign: "center"}}>
              <div style={{marginTop: "-15px"}}>
                <div style={{whiteSpace: "nowrap"}}>激活 &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>已解决 &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>已验证 &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>已关闭 &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
              </div>
            </Card>
          </Col>

          {/* 激活时长 */}
          <Col span={6}>
            <Card title={<div style={{marginTop: "-5px"}}> 激活时长 </div>}
                  headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                  bodyStyle={{height: "110px", textAlign: "center"}}>
              <div style={{marginTop: "-15px"}}>
                <div style={{whiteSpace: "nowrap"}}>&gt;24H  &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>16-24H  &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>8-16H  &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>&lt;8H  &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
              </div>
            </Card>
          </Col>

          {/* 待回验时长 */}
          <Col span={6}>
            <Card title={<div style={{marginTop: "-5px"}}> 待回验时长 </div>}
                  headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                  bodyStyle={{height: "110px", textAlign: "center"}}>
              <div style={{marginTop: "-15px"}}>
                <div style={{whiteSpace: "nowrap"}}>&gt;24H  &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>16-24H  &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>8-16H  &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
                <div style={{whiteSpace: "nowrap"}}>&lt;8H  &nbsp;<Link
                  to="/sprint/sprintListDetails">2</Link> &nbsp;个
                </div>
              </div>
            </Card>
          </Col>

        </Row>
      </div>
    );
  };
  // hotfix组件
  const HotfixLoad = () => {
    return (<div className="site-card-wrapper" style={{marginTop: '10px', marginLeft: "20px", marginRight: "20px"}}>
      <div style={{
        marginTop: "-20px",
        width: "100%",
        fontSize: "18px",
        backgroundColor: "white"
      }}>hotfix &nbsp;
        <Link to="/sprint/sprintListDetails">10</Link> &nbsp;个
      </div>

      <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

        <Col span={2}>
          <div style={{backgroundColor: "white", height: "155px", textAlign: "center"}}>
            {/* <strong style={{top: "200px"}}>bug</strong> */}
            <label style={{fontSize: "18px",}}>Bug</label>
          </div>
        </Col>

        {/* 规范检查 */}
        <Col span={5}>
          <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                bodyStyle={{height: "110px", textAlign: "center"}}>

            <div style={{marginTop: "-15px"}}>
              <div style={{whiteSpace: "nowrap"}}>无指派  &nbsp;<Link
                to="/sprint/sprintListDetails">2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>无排期  &nbsp;<Link
                to="/sprint/sprintListDetails">2</Link> &nbsp;个
              </div>
            </div>
          </Card>
        </Col>

        {/* bug状态 */}
        <Col span={5}>
          <Card title={<div style={{marginTop: "-5px"}}> bug状态 </div>}
                headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                bodyStyle={{height: "110px", textAlign: "center"}}>
            <div style={{marginTop: "-15px"}}>
              <div style={{whiteSpace: "nowrap"}}>激活 &nbsp;<Link
                to="/sprint/sprintListDetails">2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>已解决 &nbsp;<Link
                to="/sprint/sprintListDetails">2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>已验证 &nbsp;<Link
                to="/sprint/sprintListDetails">2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>已关闭 &nbsp;<Link
                to="/sprint/sprintListDetails">2</Link> &nbsp;个
              </div>
            </div>
          </Card>
        </Col>

        {/* 激活时长 */}
        <Col span={6}>
          <Card title={<div style={{marginTop: "-5px"}}> 激活时长 </div>}
                headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                bodyStyle={{height: "110px", textAlign: "center"}}>
            <div style={{marginTop: "-15px"}}>
              <div style={{whiteSpace: "nowrap"}}>&gt;24H&nbsp;<Link
                to="/sprint/sprintListDetails">2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>16-24H&nbsp;<Link
                to="/sprint/sprintListDetails">2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>8-16H&nbsp;<Link
                to="/sprint/sprintListDetails">2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>&lt;8H&nbsp;<Link
                to="/sprint/sprintListDetails">2</Link> &nbsp;个
              </div>
            </div>
          </Card>
        </Col>
        {/* 待回验时长 */}
        <Col span={6}>
          <Card title={<div style={{marginTop: "-5px"}}> 规范检查 </div>}
                headStyle={{textAlign: "center", height: "10px", backgroundColor: "AliceBlue  "}}
                bodyStyle={{height: "110px", textAlign: "center"}}>
            <div style={{marginTop: "-15px"}}>
              <div style={{whiteSpace: "nowrap"}}>&gt;24H&nbsp;<Link
                to="/sprint/sprintListDetails">2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>16-24H&nbsp;<Link
                to="/sprint/sprintListDetails">2</Link> &nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>8-16H&nbsp;<Link
                to="/sprint/sprintListDetails">2</Link>&nbsp;个
              </div>
              <div style={{whiteSpace: "nowrap"}}>&lt;8H&nbsp;<Link
                to="/sprint/sprintListDetails">2</Link>&nbsp;个
              </div>
            </div>
          </Card>
        </Col>

      </Row>

    </div>);
  };

  // 第一个页面
  const LeftControl = () => {
    return (
      <div>
        <ProjectLoad/>,
        <HotfixLoad/>
        <ProjectLoad/>,
        <HotfixLoad/>
      </div>

    );
  };

  const RightControl = () => {
    return (
      <div>
        <ProjectLoad/>,
        <StoryLoad/>,
        <TaskLoad/>,
        <HotfixLoad/>
      </div>

    );

  };

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

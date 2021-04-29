import React from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {Row, Col, Select, Card, Button} from 'antd';
import {Link} from 'umi';

const {Option} = Select;

const DashBoard: React.FC<any> = () => {

  return (

    <PageContainer style={{height: "100%", backgroundColor: "white"}}>
      <div>
        <Row gutter={16}>

          {/* 第一列 */}
          <Col className="gutter-row" span={12}>
            {/* emergency */}
            <div style={{marginLeft: "20px", height: "250px", backgroundColor: "#F2F2F2"}}>
              {/* emergency 项目 选择 */}
              <div>
                <Select defaultValue="1" style={{width: '200px', marginLeft: "20px", marginTop: '10px'}}
                        showSearch optionFilterProp="children">
                  {[
                    <Option key={'1'} value={'1'}>emergency20201223</Option>,
                    <Option key={'2'} value={'2'}>emergency20201216</Option>,
                    <Option key={'3'} value={'3'}>emergency20201209</Option>,
                  ]}
                </Select>

                {/* <label style={{width:"200px", float:"right",marginTop: "10px", marginRight:"10px", fontSize: "18px", backgroundColor: "white"}}>hotfix &nbsp; <Link to="/sprint/sprintListDetails">2</Link> &nbsp;个</label> */}
              </div>

              {/* 类型个数显示 */}
              <div style={{
                marginTop: "10px", marginLeft: "20px", width: "97%", fontSize: "18px", backgroundColor: "white"
              }}> &nbsp;hotfix &nbsp;<Link to="/sprint/sprintListDetails">2</Link> &nbsp;个
              </div>

              {/* #F2F2F2 :灰色 */}
              <div className="site-card-wrapper" style={{marginTop: '10px', marginLeft: "20px", marginRight: "20px"}}>
                <Row gutter={8} align={"middle"} wrap={false}>   {/* gutter 每一列的间隔距离 */}

                  <Col span={2}>
                    <div style={{backgroundColor: "white", height: "145px", textAlign: "center"}}>
                      <label style={{fontSize: '18px'}}>Bug</label>
                      {/* <strong style={{ marginTop:"50px",fontSize: '18px'}}>Bug</strong> */}
                    </div>
                  </Col>

                  {/* 规范检查 */}
                  <Col span={5}>
                    <Card title="规范检查"
                          headStyle={{marginTop: "-10px", textAlign: "center"}}
                          bodyStyle={{height: "100px", textAlign: "center"}}>
                      <div style={{marginTop: "-15px"}}>
                        <div style={{whiteSpace: "nowrap"}}>无指派 &nbsp;<Link
                          to="/sprint/sprintListDetails">2</Link>&nbsp;个
                        </div>
                        <div style={{whiteSpace: "nowrap"}}>无排期 &nbsp;<Link
                          to="/sprint/sprintListDetails">2</Link>&nbsp;个
                        </div>
                      </div>
                    </Card>
                  </Col>

                  {/* bug状态 */}
                  <Col span={5}>
                    <Card title="bug状态"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
                          bodyStyle={{height: "100px", textAlign: "center"}}>
                      <div style={{marginTop: "-15px"}}>
                        <div style={{whiteSpace: "nowrap"}}>激活&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;个
                        </div>
                        <div style={{whiteSpace: "nowrap"}}>已解决&nbsp;<Link
                          to="/sprint/sprintListDetails">2</Link>&nbsp;个
                        </div>
                        <div style={{whiteSpace: "nowrap"}}>已验证&nbsp;<Link
                          to="/sprint/sprintListDetails">2</Link>&nbsp;个
                        </div>
                        <div style={{whiteSpace: "nowrap"}}>已关闭&nbsp;<Link
                          to="/sprint/sprintListDetails">2</Link>&nbsp;个
                        </div>
                      </div>
                    </Card>
                  </Col>

                  {/* 激活时长 */}
                  <Col span={6}>
                    <Card title="激活时长"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
                          bodyStyle={{textAlign: "center", height: "100px"}}>
                      <div style={{marginTop: "-15px"}}>
                        <div style={{whiteSpace: "nowrap"}}>&gt;24H &nbsp;<Link
                          to="/sprint/sprintListDetails">2</Link>&nbsp;个
                        </div>
                        <div style={{whiteSpace: "nowrap"}}>16-24H &nbsp;<Link
                          to="/sprint/sprintListDetails">2</Link>&nbsp;个
                        </div>
                        <div style={{whiteSpace: "nowrap"}}>8-16H &nbsp;<Link
                          to="/sprint/sprintListDetails">2</Link>&nbsp;个
                        </div>
                        <div style={{whiteSpace: "nowrap"}}>&lt;8H &nbsp;<Link
                          to="/sprint/sprintListDetails">2</Link>&nbsp;个
                        </div>
                      </div>
                    </Card>
                  </Col>

                  {/* 待回验时长 */}
                  <Col span={6}>
                    <Card title="待回验时长"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
                          bodyStyle={{height: "100px", textAlign: "center"}}>
                      <div style={{marginTop: "-15px"}}>
                        <div style={{whiteSpace: "nowrap"}}>&gt;24H &nbsp;<Link
                          to="/sprint/sprintListDetails">2</Link>&nbsp;个
                        </div>
                        <div style={{whiteSpace: "nowrap"}}>16-24H &nbsp;<Link
                          to="/sprint/sprintListDetails">2</Link>&nbsp;个
                        </div>
                        <div style={{whiteSpace: "nowrap"}}>8-16H &nbsp;<Link
                          to="/sprint/sprintListDetails">2</Link>&nbsp;个
                        </div>
                        <div style={{whiteSpace: "nowrap"}}>&lt;8H &nbsp;<Link
                          to="/sprint/sprintListDetails">2</Link>&nbsp;个
                        </div>
                      </div>
                    </Card>
                  </Col>

                </Row>
              </div>
            </div>
          </Col>

          {/* 第二列 */}
          <Col className="gutter-row" span={12}>
            {/* sprint */}
            <div style={{height: '101%', backgroundColor: "#F2F2F2"}}>
              {/* 项目选择 */}
              <div>
                <Select defaultValue="1"
                        style={{width: '200px', marginLeft: "20px", marginTop: '10px'}}
                        showSearch optionFilterProp="children">
                  {[
                    <Option key={'1'} value={'1'}>sprint20201223</Option>,
                    <Option key={'2'} value={'2'}>sprint20201216</Option>,
                    <Option key={'3'} value={'3'}>sprint20201209</Option>,
                  ]}
                </Select>

                <Button type="text" style={{fontWeight: "bold"}}>查看项目清单all</Button>
              </div>

              {/* 需求 */}
              <div style={{
                marginTop: "10px",
                marginLeft: "20px",
                width: "97%",
                fontSize: "18px",
                backgroundColor: "white"
              }}>需求 &nbsp;
                <Link to="/sprint/sprintListDetails">10</Link> &nbsp;个
              </div>
              <div className="site-card-wrapper" style={{marginTop: '10px', marginLeft: "20px", marginRight: "20px"}}>

                {/* 需求-状态 */}
                <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

                  <Col span={2}>
                    <div style={{backgroundColor: "white", height: "165px", textAlign: "center"}}>
                      <label style={{fontSize: '18px'}}>状态</label>
                      {/* <strong style={{top: "200px"}}>状态</strong> */}
                    </div>
                  </Col>

                  <Col span={5}>
                    <Card title="规范检查"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
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

                  <Col span={5}>
                    <Card title="开发进展"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
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

                  <Col span={6}>
                    <Card title="提测进展"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
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

                  <Col span={6}>
                    <Card title="测试进展"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
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

                  <Col span={5}>
                    <Card title="规范检查"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
                          bodyStyle={{height: "110px", textAlign: "center"}}>

                      <div style={{marginTop: "-15px"}}>
                        <div style={{whiteSpace: "nowrap"}}>无指派  &nbsp;&nbsp;<Link
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

                  <Col span={5}>
                    <Card title="bug状态"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
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

                  <Col span={6}>
                    <Card title="激活时长"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
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

                  <Col span={6}>
                    <Card title="待回验时长"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
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

              {/* 任务 */}
              <div style={{
                marginTop: "10px",
                marginLeft: "20px",
                width: "97%",
                fontSize: "18px",
                backgroundColor: "white"
              }}>任务 &nbsp;
                <Link to="/sprint/sprintListDetails">10</Link> &nbsp;个
              </div>
              <div className="site-card-wrapper" style={{marginTop: '10px', marginLeft: "20px", marginRight: "20px"}}>
                {/* 任务-状态 */}
                <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

                  <Col span={2}>
                    <div style={{backgroundColor: "white", height: "155px", textAlign: "center"}}>
                      {/* <strong style={{top: "200px"}}>状态</strong> */}
                      <label style={{fontSize: "18px",}}>状态</label>
                    </div>
                  </Col>

                  <Col span={5}>
                    <Card title="规范检查"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
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

                  <Col span={5}>
                    <Card title="开发进展"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
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

                  <Col span={6}>
                    <Card title="提测进展"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
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

                  <Col span={6}>
                    <Card title="测试进展"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
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

                  <Col span={5}>
                    <Card title="规范检查"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
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

                  <Col span={5}>
                    <Card title="bug状态"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
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

                  <Col span={6}>
                    <Card title="激活时长"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
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

                  <Col span={6}>
                    <Card title="待回验时长"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
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

              {/* hotfix */}
              <div style={{
                marginTop: "10px",
                marginLeft: "20px",
                width: "97%",
                fontSize: "18px",
                backgroundColor: "white"
              }}>hotfix &nbsp;
                <Link to="/sprint/sprintListDetails">10</Link> &nbsp;个
              </div>
              <div className="site-card-wrapper" style={{marginTop: '10px', marginLeft: "20px", marginRight: "20px"}}>
                <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

                  <Col span={2}>
                    <div style={{backgroundColor: "white", height: "155px", textAlign: "center"}}>
                      {/* <strong style={{top: "200px"}}>bug</strong> */}
                      <label style={{fontSize: "18px",}}>Bug</label>
                    </div>
                  </Col>

                  <Col span={5}>
                    <Card title="规范检查"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
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

                  <Col span={5}>
                    <Card title="bug状态"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
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

                  <Col span={6}>
                    <Card title="激活时长"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
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
                  <Col span={6}>
                    <Card title="待回验时长"
                          headStyle={{textAlign: "center", marginTop: "-10px",}}
                          bodyStyle={{height: "110px",textAlign: "center"}}>
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

              </div>
            </div>
          </Col>

        </Row>
      </div>

    </PageContainer>
  );
};

export default DashBoard;

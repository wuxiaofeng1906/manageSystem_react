import React from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {Row, Col, Select, Card, Button} from 'antd';
import {Link} from 'umi';

const {Option} = Select;


const fontSizes = {fontSize: "18px"};
const DashBoard: React.FC<any> = () => {

  return (

    <PageContainer style={{height: "105%", backgroundColor: "white"}}>
      <div>
        {/* emergency */}
        <div style={{marginLeft: "20px", height: "300px", backgroundColor: "#F2F2F2"}}>
          <div style={{backgroundColor: "blue"}}>
            <Select placeholder="请选择" defaultValue="1" style={{width: '200px', marginLeft: "20px", marginTop: '10px'}}
                    showSearch optionFilterProp="children">
              {[
                <Option key={'1'} value={'1'}>emergency20201223</Option>,
                <Option key={'2'} value={'2'}>emergency20201216</Option>,
                <Option key={'3'} value={'3'}>emergency20201209</Option>,
              ]}
            </Select>
          </div>
          <div style={{
            marginTop: "10px",
            marginLeft: "20px",
            width: "97%",
            fontSize: "18px",
            backgroundColor: "white"
          }}>hotfix&nbsp;&nbsp;
            <Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
          </div>

          {/* #F2F2F2 :灰色 */}
          <div className="site-card-wrapper" style={{marginTop: '10px', marginLeft: "20px", marginRight: "20px"}}>
            <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

              <Col span={2}>
                <div style={{backgroundColor: "white", height: "190px", textAlign: "center"}}>
                  <strong style={{top: "200px"}}>bug</strong>
                </div>
              </Col>

              <Col span={5}>
                <Card title="规范检查"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "140px"}}>

                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>无指派 &nbsp;&nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>无排期 &nbsp;&nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                  </div>
                </Card>


              </Col>
              <Col span={5}>
                <Card title="bug状态"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "140px"}}>
                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>激活&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>已解决&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>已验证&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>已关闭&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                  </div>
                </Card>
              </Col>

              <Col span={6}>
                <Card title="激活时长"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "140px"}}>
                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>&gt;24H &nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>16-24H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>8-16H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>&lt;8H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card title="待回验时长"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "140px"}}>
                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>&gt;24H &nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>16-24H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>8-16H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>&lt;8H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>

        {/* sprint */}
        <div style={{marginTop: "20px", marginLeft: "20px", height: "100%", backgroundColor: "#F2F2F2"}}>
          <div>
            <Select placeholder="请选择" defaultValue="1" style={{width: '200px', marginLeft: "20px", marginTop: '10px'}}
                    showSearch optionFilterProp="children">
              {[
                <Option key={'1'} value={'1'}>sprint20201223</Option>,
                <Option key={'2'} value={'2'}>sprint20201216</Option>,
                <Option key={'3'} value={'3'}>sprint20201209</Option>,
              ]}
            </Select>

            <Button type="text">查看项目清单all</Button>
          </div>

          {/* 需求 */}
          <div style={{
            marginTop: "10px",
            marginLeft: "20px",
            width: "97%",
            fontSize: "18px",
            backgroundColor: "white"
          }}>需求&nbsp;&nbsp;
            <Link to="/sprint/sprintListDetails">10</Link>&nbsp;&nbsp;个
          </div>

          <div className="site-card-wrapper" style={{marginTop: '10px', marginLeft: "20px", marginRight: "20px"}}>
            <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

              <Col span={2}>
                <div style={{backgroundColor: "white", height: "210px", textAlign: "center"}}>
                  <strong style={{top: "200px"}}>状态</strong>
                </div>
              </Col>

              <Col span={5}>
                <Card title="规范检查"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "160px"}}>

                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>草稿&nbsp;&nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>项目错误  &nbsp;&nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>无任务&nbsp;&nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>无排期&nbsp;&nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>未更新&nbsp;&nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                  </div>
                </Card>


              </Col>
              <Col span={5}>
                <Card title="开发进展"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "160px"}}>
                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>任务延期&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>未开始&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>开发中&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>开发完&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                  </div>
                </Card>
              </Col>

              <Col span={6}>
                <Card title="提测进展"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "160px"}}>
                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>提测延期&nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>未提测&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>已提测&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>

                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card title="测试进展"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "160px"}}>
                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>任务延期&nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>未开始&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>测试中&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>测试完&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
            <Row gutter={8} align={"middle"} style={{marginTop: "10px"}}>   {/* gutter 每一列的间隔距离 */}

              <Col span={2}>
                <div style={{backgroundColor: "white", height: "190px", textAlign: "center"}}>
                  <strong style={{top: "200px"}}>bug</strong>
                </div>
              </Col>

              <Col span={5}>
                <Card title="规范检查"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "140px"}}>

                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>无指派 &nbsp;&nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>无排期 &nbsp;&nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>无bug &nbsp;&nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                  </div>
                </Card>

              </Col>
              <Col span={5}>
                <Card title="bug状态"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "140px"}}>
                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>激活&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>已解决&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>已验证&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>已关闭&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                  </div>
                </Card>
              </Col>

              <Col span={6}>
                <Card title="激活时长"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "140px"}}>
                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>&gt;24H &nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>16-24H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>8-16H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>&lt;8H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card title="待回验时长"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "140px"}}>
                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>&gt;24H &nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>16-24H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>8-16H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>&lt;8H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
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
          }}>任务&nbsp;&nbsp;
            <Link to="/sprint/sprintListDetails">10</Link>&nbsp;&nbsp;个
          </div>
          <div className="site-card-wrapper" style={{marginTop: '10px', marginLeft: "20px", marginRight: "20px"}}>
            <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

              <Col span={2}>
                <div style={{backgroundColor: "white", height: "190px", textAlign: "center"}}>
                  <strong style={{top: "200px"}}>状态</strong>
                </div>
              </Col>

              <Col span={5}>
                <Card title="规范检查"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "140px"}}>

                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>项目错误  &nbsp;&nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>无任务&nbsp;&nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>无排期&nbsp;&nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>未更新&nbsp;&nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>

                  </div>
                </Card>


              </Col>
              <Col span={5}>
                <Card title="开发进展"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "140px"}}>
                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>任务延期&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>未开始&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>开发中&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>开发完&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                  </div>
                </Card>
              </Col>

              <Col span={6}>
                <Card title="提测进展"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "140px"}}>
                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>&gt;24H &nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>提测延期&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>未提测&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>已提测&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card title="测试进展"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "140px"}}>
                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>任务延期&nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>未开始&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>测试中&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>测试完&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
            <Row gutter={8} align={"middle"} style={{marginTop: "10px"}}>   {/* gutter 每一列的间隔距离 */}

              <Col span={2}>
                <div style={{backgroundColor: "white", height: "190px", textAlign: "center"}}>
                  <strong style={{top: "200px"}}>bug</strong>
                </div>
              </Col>

              <Col span={5}>
                <Card title="规范检查"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "140px"}}>

                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>无指派 &nbsp;&nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>无排期 &nbsp;&nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>无bug &nbsp;&nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                  </div>
                </Card>

              </Col>
              <Col span={5}>
                <Card title="bug状态"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "140px"}}>
                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>激活&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>已解决&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>已验证&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>已关闭&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                  </div>
                </Card>
              </Col>

              <Col span={6}>
                <Card title="激活时长"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "140px"}}>
                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>&gt;24H &nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>16-24H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>8-16H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>&lt;8H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card title="待回验时长"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "140px"}}>
                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>&gt;24H &nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>16-24H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>8-16H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>&lt;8H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
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
          }}>hotfix&nbsp;&nbsp;
            <Link to="/sprint/sprintListDetails">10</Link>&nbsp;&nbsp;个
          </div>
          <div className="site-card-wrapper" style={{marginTop: '10px', marginLeft: "20px", marginRight: "20px"}}>
            <Row gutter={8} align={"middle"}>   {/* gutter 每一列的间隔距离 */}

              <Col span={2}>
                <div style={{backgroundColor: "white", height: "190px", textAlign: "center"}}>
                  <strong style={{top: "200px"}}>bug</strong>
                </div>
              </Col>

              <Col span={5}>
                <Card title="规范检查"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "140px"}}>

                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>无指派 &nbsp;&nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>无排期 &nbsp;&nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                  </div>
                </Card>


              </Col>
              <Col span={5}>
                <Card title="bug状态"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "140px"}}>
                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>激活&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>已解决&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>已验证&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>已关闭&nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                  </div>
                </Card>
              </Col>

              <Col span={6}>
                <Card title="激活时长"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "140px"}}>
                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>&gt;24H &nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>16-24H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>8-16H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>&lt;8H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card title="待回验时长"
                      headStyle={{textAlign: "center", fontSize: "18px", marginTop: "-10px",}}
                      bodyStyle={{height: "140px"}}>
                  <div style={{marginLeft: "60px", marginTop: "-15px"}}>
                    <div style={fontSizes}>&gt;24H &nbsp;&nbsp;<Link
                      to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>16-24H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>8-16H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                    <div style={fontSizes}>&lt;8H &nbsp;&nbsp;<Link to="/sprint/sprintListDetails">2</Link>&nbsp;&nbsp;个
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>

    </PageContainer>
  );
};

export default DashBoard;

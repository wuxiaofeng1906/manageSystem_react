import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {
  Button,
  DatePicker,
  Checkbox,
  Card,
  message,
  Table,
  Modal,
  Form,
  Select,
  Row,
  Col,
  Divider,
  Space,
  Input
} from "antd";
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import axios from "axios";
import moment from "moment";
import {log} from "echarts/types/src/util/log";

const {RangePicker} = DatePicker;
const {Option} = Select;


const queryDevelopViews = async () => {

  let result: any = [];
  await axios.get('/api/verify/app_tools/app_list', {params: ""})
    .then(function (res) {

      if (res.data.code === 200) {
        result = res.data.data;
      } else {
        message.error({
          content: `错误：${res.data.msg}`,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      }


    }).catch(function (error) {

      message.error({
        content: `异常信息:${error.toString()}`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    });

  return result;
};

// const TestDiv: React.FC<any> = (props) => {
//
//   //
//   const {addProject, delProject} = props
//   //
//   return <div>
//
//     <div>
//       <Form.Item name="prjName" label="① 项目名称" style={{marginTop: -2}}>
//         <Select style={{width: 362, marginLeft: 27}}>
//           <Option value="刘黎明">刘黎明</Option>
//         </Select>
//       </Form.Item>
//       <Form.Item name="prjType" label="项目类型" style={{marginTop: -20, marginLeft: 17}}>
//         <Select style={{width: 362, marginLeft: 27}}>
//           <Option value="刘黎明">刘黎明</Option>
//         </Select>
//       </Form.Item>
//       <Form.Item name="branch" label="对应分支" style={{marginTop: -20, marginLeft: 17}}>
//         <Select style={{width: 362, marginLeft: 27}}>
//           <Option value="刘黎明">刘黎明</Option>
//         </Select>
//       </Form.Item>
//       <Form.Item name="testEnv" label="对应测试环境" style={{marginTop: -20, marginLeft: 17}}>
//         <Select>
//           <Option value="刘黎明">刘黎明</Option>
//         </Select>
//       </Form.Item>
//       <Form.Item name="upgradeEnv" label="对应升级环境" style={{marginTop: -20, marginLeft: 17}}>
//         <Select>
//           <Option value="刘黎明">刘黎明</Option>
//         </Select>
//       </Form.Item>
//       <Form.Item name="prjManager" label="项目负责人" style={{marginTop: -20, marginLeft: 17}}>
//         <Select style={{width: 361, marginLeft: 14}}>
//           <Option value="刘黎明">刘黎明</Option>
//         </Select>
//       </Form.Item>
//       <Form.Item name="planGrayTime" label="计划灰度时间" style={{marginTop: -20, marginLeft: 17}}>
//         <RangePicker style={{width: '100%'}}/>
//       </Form.Item>
//       <Form.Item name="planOnlineTime" label="计划上线时间" style={{marginTop: -20, marginLeft: 17}}>
//         <RangePicker style={{width: '100%'}}/>
//       </Form.Item>
//     </div>
//     <div style={{marginTop: -25}}>
//       <table>
//         <tr>
//           <td>
//             <Button type="text" onClick={addProject}>
//               <img src="../add_black.png" width="20" height="20" alt="新增项目" title="新增项目"/>
//             </Button>
//           </td>
//           <td>
//             <Divider style={{width: 380}}></Divider>
//           </td>
//           <td>
//             <Button type="text" onClick={delProject}>
//               <img src="../sub_black.png" width="20" height="20" alt="删除项目" title="删除项目"/>
//             </Button>
//           </td>
//         </tr>
//       </table>
//     </div>
//
//   </div>;
// };

const DutyPlan: React.FC<any> = () => {

  /* region 数据查询 */

  const [choicedCondition, setChoicedCondition] = useState({start: "", end: ""});
  const {data} = useRequest(() => queryDevelopViews());
  console.log(data);

  const columns: any = [

    {
      title: '所属端',
      dataIndex: 'money',
      align: 'center'
    },
    {
      title: '姓名',
      dataIndex: 'address',
      align: 'center'
    },
  ];
  const datawww = [
    {

      money: '前端',
      address: '刘黎明',
    },
    {

      money: '后端',
      address: '胡靖华/罗林',
    },
    {

      money: '测试',
      address: '徐睿',
    },
  ];

  /* endregion */

  /* region 时间查询 */
  const onTimeSelected = (params: any, dateString: any) => {

    setChoicedCondition({start: dateString[0], end: dateString[1]});

  };
  /* endregion */

  /* region 消息推送事件 */

  // checkbox 选中事件
  const onPlanChanged = (params: any) => {
    const selectedId = params.target.id;
    const isChecked = params.target.checked;
    console.log(selectedId, isChecked);
    message.info(selectedId);
  };
  const sendMessage = () => {

  };
  /*  endregion */

  /* region 弹出层事件 */
  const [formForPlanModify] = Form.useForm();
  const [isPlanVisble, setIsPlanVisble] = useState(false);
  console.log(isPlanVisble);
  // 表格双击事件
  const doubleClickRow = (params: any) => {
    const gridValue = params.target.parentElement.parentElement.innerText;
    console.log(gridValue);
    // message.info(gridValue);
    setIsPlanVisble(true);
  };

  // 弹出层取消
  const planModalCancel = () => {
    setIsPlanVisble(false);
  };
  const [form] = Form.useForm();
  // 弹出层保存
  const carrySave = () => {
    const test = formForPlanModify.getFieldsValue();
    const testsss = form.getFieldsValue();

    debugger;

  };

  /* endregion */


  const onFinish = (values: any) => {
    debugger;
    console.log('Received values of form:', values);
  };


  const initForm = () => {

  };
  return (
    <PageContainer>
      {/* 时间查询条件 */}
      <div style={{width: '100%', backgroundColor: "white", marginTop: -15}}>
        <label style={{marginLeft: '10px'}}>计划筛选：</label>
        <RangePicker
          className={'times'}
          style={{width: '18%'}}
          onChange={onTimeSelected}
          value={[
            choicedCondition.start === "" ? null : moment(choicedCondition.start),
            choicedCondition.end === "" ? null : moment(choicedCondition.end)]}
        />

        <Button type="text" onClick={sendMessage} style={{marginLeft: 10, padding: 10}}>
          <img src="../pushMessage.png" width="25" height="25" alt="一键推送" title="一键推送"/> &nbsp;一键推送
        </Button>

      </div>

      <div style={{marginTop: 5, overflow: "scroll"}}>
        <table style={{width: "100%"}}>
          <tr>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox id={"2021/01/01~2021/01/07"} onChange={onPlanChanged}></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                  onRow={() => {
                    return {onDoubleClick: doubleClickRow};
                  }}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox id={"2021/01/01~2021/01/07"} onChange={onPlanChanged}></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
          </tr>

          <tr>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
          </tr>

          <tr>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
          </tr>

          <tr>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
          </tr>
        </table>


      </div>

      <Modal
        title={'值班计划'}
        visible={true}
        onCancel={planModalCancel}
        centered={true}
        width={550}
        footer={
          [
            <Button
              style={{borderRadius: 5, marginTop: -100}}
              onClick={planModalCancel}>取消
            </Button>,
            <Button type="primary"
                    style={{
                      marginLeft: 10,
                      color: '#46A0FC',
                      backgroundColor: "#ECF5FF",
                      borderRadius: 5,
                    }}
                    onClick={carrySave}>保存
            </Button>
          ]}>
        <Form form={formForPlanModify} style={{marginTop: -15}}>
          <Form.Item label="值班时间" name="planTime" required={true}>
            <RangePicker
              className={'times'}
              style={{width: '100%'}}
            />
          </Form.Item>

          {/* 值班人员Card */}
          <Card size="small" title="值班人员" style={{marginTop: -15}} bodyStyle={{height: 130}}>
            <Row gutter={40} style={{marginTop: -10}}>
              <Col span={10}>
                <Form.Item name="firstFront" label="前端" style={{marginTop: 7}}>
                  <Select style={{width: '130px'}}>
                    <Option value="刘黎明">刘黎明</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item name="secondFront" label="前端第二值班人" style={{marginTop: 7}}>
                  <Select style={{width: '130px'}}>
                    <Option value="刘黎明">刘黎明</Option>

                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={40} style={{marginTop: -25}}>
              <Col span={10}>
                <Form.Item name="firstBackend" label="后端" style={{marginTop: 7}}>
                  <Select style={{width: '130px'}}>
                    <Option value="刘黎明">刘黎明</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={14}>
                <Form.Item name="secondBackend" label="后端第二值班人" style={{marginTop: 7}}>
                  <Select style={{width: '130px'}}>
                    <Option value="刘黎明">刘黎明</Option>
                  </Select>
                </Form.Item>
              </Col>

            </Row>

            <Row gutter={40} style={{marginTop: -25}}>
              <Col span={10}>
                <Form.Item name="firstTester" label="测试" style={{marginTop: 7}}>
                  <Select style={{width: '130px'}}>
                    <Option value="刘黎明">刘黎明</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item name="secondTester" label="测试第二值班人" style={{marginTop: 7}}>
                  <Select style={{width: '130px'}}>
                    <Option value="刘黎明">刘黎明</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 项目明细Card */}
          <Card size="small" title="项目" style={{marginTop: 10}}>
            <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
              <Form.List name="users">

                {
                  (fields, {add, remove}) => (
                    <>
                      {fields.map(({key, name, fieldKey, ...restField}) => (
                        <Space key={key} style={{display: 'flex', marginBottom: 8}} align="baseline">
                          <div>

                            <Form.Item
                              {...restField}
                              name={[name, 'prjName']}
                              fieldKey={[fieldKey, 'prjName']}
                              label="项目名称"
                              required={true}
                            >
                              <Select style={{width: '93%', marginLeft: 27}}>
                                <Option value="刘黎明">刘黎明</Option>
                              </Select>
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, 'prjType']}
                              fieldKey={[fieldKey, 'prjType']}
                              label="项目类型"
                              style={{marginTop: -20, marginLeft: 13}}>
                              <Select style={{width: '93%', marginLeft: 27}}>
                                <Option value="刘黎明">刘黎明</Option>
                              </Select>
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, 'branch']}
                              fieldKey={[fieldKey, 'branch']}
                              label="对应分支"
                              style={{marginTop: -20, marginLeft: 13}}>
                              <Select style={{width: "93%", marginLeft: 27}}>
                                <Option value="刘黎明">刘黎明</Option>
                              </Select>
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, 'testEnv']}
                              fieldKey={[fieldKey, 'testEnv']}
                              label="对应测试环境"
                              style={{marginTop: -20, marginLeft: 13}}>
                              <Select style={{width: "100%"}}>
                                <Option value="刘黎明">刘黎明</Option>
                              </Select>
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, 'upgradeEnv']}
                              fieldKey={[fieldKey, 'upgradeEnv']}
                              label="对应升级环境"
                              style={{marginTop: -20, marginLeft: 13}}>
                              <Select style={{width: "100%"}}>
                                <Option value="刘黎明">刘黎明</Option>
                              </Select>
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, 'prjManager']}
                              fieldKey={[fieldKey, 'prjManager']}
                              label="项目负责人" style={{marginTop: -20, marginLeft: 13}}>
                              <Select style={{width: "96%", marginLeft: 14}}>
                                <Option value="刘黎明">刘黎明</Option>
                              </Select>
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, 'planGrayTime']}
                              fieldKey={[fieldKey, 'planGrayTime']}
                              label="计划灰度时间" style={{marginTop: -20, marginLeft: 13}}>
                              <RangePicker style={{width: '100%'}}/>
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, 'planOnlineTime']}
                              fieldKey={[fieldKey, 'planOnlineTime']}
                              label="计划上线时间" style={{marginTop: -20, marginLeft: 13}}>
                              <RangePicker style={{width: '100%'}}/>
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, 'operate']}
                              fieldKey={[fieldKey, 'operate']}
                              style={{marginLeft: 17, marginTop: -25, marginBottom: -10}}>
                              <table>
                                <tr>
                                  <td>
                                    <Button type="text" onClick={() => add()}>
                                      <img src="../add_black.png" width="20" height="20" alt="新增项目" title="新增项目"/>
                                    </Button>
                                  </td>
                                  <td>
                                    <Divider style={{width: "330px"}}></Divider>
                                  </td>
                                  <td>
                                    <Button type="text" block onClick={() => remove(name)}>
                                      <img src="../sub_black.png" width="20" height="20" alt="删除项目" title="删除项目"/>
                                    </Button>
                                  </td>
                                </tr>
                              </table>
                            </Form.Item>

                          </div>


                        </Space>
                      ))}

                      {/* */}
                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                          新增
                        </Button>
                      </Form.Item>
                    </>
                  )}
              </Form.List>
            </Form>


            {/* 备注显示 */}

            <div>
              <label style={{color: "orange"}}> 备注： </label>
              <label> 需要当天紧急修复的请走emergency申请 <br/>
                对应分支：emergency/stage-emergency<br/>
                对应测试环境:nx-hotfix（如有变动，由测试负责人临时调配环境） </label>
            </div>

          </Card>
        </Form>
      </Modal>

    </PageContainer>
  );
};

export default DutyPlan;

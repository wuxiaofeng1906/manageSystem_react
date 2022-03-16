import React, {useEffect, useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Header from "./components/CusPageHeader";
import {getTaskColumns} from "./gridMethod/columns";
import {Button, Col, Form, Row, Select, DatePicker, message, Spin} from "antd";
import {getHeight} from "@/publicMethods/pageSet";
import {GridApi, GridReadyEvent} from "ag-grid-community";
import {history} from "@@/core/history";
import moment from "moment";

const {Option} = Select;
// 组件初始化
const CheckBeforeOnline: React.FC<any> = () => {

  /* region 表格事件 */
  const [gridHeight, setGridHeight] = useState(getHeight());
  const gridApi = useRef<GridApi>();
  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  window.onresize = function () {
    setGridHeight(getHeight());
    gridApi.current?.sizeColumnsToFit();
  };

  /* endregion 表格事件 */

  /* region 联动选项 */

  const planStartChanged = () => {
    //   时间改变后，下面的预计开始时间也要同步改变
  }

  const planEndChanged = () => {
    //   时间改变后，下面的预计截至时间也要同步改变
  }

  // 指派人修改后，也要对应修改表格中所属端的指派人
  const changeAssignedTo = (side: string, currentValue: any) => {
    console.log("currentValue", currentValue);
    switch (side) {
      case "SQA":
        break;
      case "Front":
        break;
      case "Backend":
        break;
      case "Tester":
        break;
      default:
        break;
    }

  };

  /* endregion 联动选项 */

  const [formForZentaoTask] = Form.useForm(); // 上线分支设置
  const [excuteState, setExcuteState] = useState(false);

  // 取消模板编辑
  const cancleTempEdit = () => {
    history.push('/zentao/templateList');
  };

  // 生成任务
  const builtTask = () => {
    setExcuteState(true);
    // 需要校验空值
    const formData = formForZentaoTask.getFieldsValue();
    console.log(formData);
    //   调用接口生成
  };

  useEffect(() => {
    formForZentaoTask.setFieldsValue({
      belongExcution: "",
      assingedToSQA: "",
      assingedToFront: "",
      assingedToBackend: "",
      assingedToTester: "",
      planStart: moment(),
      planEnd: moment()
    });

  });

  return (
    <div style={{width: "100%", height: "100%", marginTop: "-20px"}}>
      <Header/>
      <Spin spinning={excuteState} tip="任务生成中，请稍后..." size={"large"}>
        <div style={{marginTop:5}}>

          {/* 条件 */}
          <div style={{background: 'white', height: 80,paddingTop:4}}>
            <Form form={formForZentaoTask} autoComplete="off" style={{marginLeft: 5}}>

              <Row>
                <Col span={6}>
                  <Form.Item label="所属执行:" name="belongExcution" required={true} style={{marginLeft: 14}}>
                    <Select defaultValue="lucy" style={{width: '100%'}} allowClear>
                      <Option value="lucy">Lucy</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="SQA指派人:" name="assingedToSQA" required={true} style={{marginLeft: 19}}>
                    <Select defaultValue="lucy" style={{width: '100%'}} allowClear
                            onChange={(params: any) => {
                              changeAssignedTo("SQA", params);
                            }}>
                      <Option value="lucy">Lucy</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="前端指派人:" name="assingedToFront" required={true} style={{marginLeft: 19}}>
                    <Select defaultValue="lucy" style={{width: '100%'}} allowClear
                            onChange={(params: any) => {
                              changeAssignedTo("Front", params);
                            }}>
                      <Option value="lucy">Lucy</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="后端指派人:" name="assingedToBackend" required={true} style={{marginLeft: 5}}>
                    <Select defaultValue="lucy" style={{width: '100%'}} allowClear
                            onChange={(params: any) => {
                              changeAssignedTo("Backend", params);
                            }}>
                      <Option value="lucy">Lucy</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{marginTop: -17}}>
                <Col span={6}>
                  <Form.Item label="测试指派人:" name="assingedToTester" required={true}>
                    <Select defaultValue="lucy" style={{width: '100%'}} allowClear
                            onChange={(params: any) => {
                              changeAssignedTo("Tester", params);
                            }}>
                      <Option value="lucy">Lucy</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="预计开始日期:" name="planStart" required={true} style={{marginLeft: 5}}>
                    <DatePicker style={{width: "100%"}} onChange={planStartChanged}/>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="预计结束日期:" name="planEnd" required={true} style={{marginLeft: 5}}>
                    <DatePicker style={{width: "100%"}} onChange={planEndChanged}/>
                  </Form.Item>
                </Col>

              </Row>
            </Form>
          </div>
          {/* 表格 */}
          <div style={{marginTop: 5}}>
            <div className="ag-theme-alpine" style={{height: gridHeight - 45, width: '100%'}}>
              <AgGridReact
                columnDefs={getTaskColumns()} // 定义列
                rowData={[]} // 数据绑定
                defaultColDef={{
                  resizable: true,
                  sortable: true,
                  filter: true,
                  suppressMenu: true,
                  cellStyle: {'line-height': '28px'},
                }}
                rowHeight={28}
                headerHeight={30}
                suppressRowTransform={true}
                onGridReady={onGridReady}
              >
              </AgGridReact>
            </div>
          </div>

          <div style={{marginTop: 10}}>
            <Button type="primary"
                    style={{
                      float: "right", color: '#46A0FC',
                      backgroundColor: "#ECF5FF", borderRadius: 5, marginLeft: 20
                    }}
                    onClick={builtTask}>点击生成
            </Button>
            <Button
              style={{float: "right", borderRadius: 5}}
              onClick={cancleTempEdit}>取消
            </Button>
          </div>
        </div>
      </Spin>
    </div>
  );
};


export default CheckBeforeOnline;

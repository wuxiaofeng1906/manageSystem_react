import React, {useEffect, useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Header from "./components/CusPageHeader";
import {getProjectColumns} from "./gridMethod/columns";
import {Button, Col, Form, Row, Select, DatePicker, message, Spin} from "antd";
import {getHeight} from "@/publicMethods/pageSet";
import {GridApi, GridReadyEvent} from "ag-grid-community";
import {history} from "@@/core/history";
import moment from "moment";

const {Option} = Select;
// 组件初始化
const ProjectTemplate: React.FC<any> = () => {

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

  /* region  联动修改 */

  // 项目执行修改后要修改任务名称
  const excutionChanged = () => {

  };

// 项目负责人修改后，也要对应修改表格中所属端的指派人
  const projectManagerChanged = (currentValue: any) => {
    console.log("currentValue", currentValue);
  };

  // 计划开始时间选择后改变表格中的时间
  const planStartChanged = () => {
    //   时间改变后，下面的预计开始时间也要同步改变

  }

  // 计划开始结束选择后改变表格中的时间
  const planEndChanged = () => {
    //   时间改变后，下面的预计截至时间也要同步改变
  }

  /* endregion 联动修改 */

  const [formForProject] = Form.useForm(); // 上线分支设置
  const [excuteState, setExcuteState] = useState(false);
  // 任务生成按钮
  const builtTask = () => {
    setExcuteState(true);
    // 需要校验空值
    const formData = formForProject.getFieldsValue();
    console.log(formData);
    //   调用接口生成
  };
  // 取消模板编辑
  const cancleTempEdit = () => {
    history.push('/zentao/templateList');
  };

  useEffect(() => {
    formForProject.setFieldsValue({
      belongExcution: "",
      projectManager: "",
      planStart: moment(),
      planEnd: moment()
    });

  });

  return (
    <div style={{width: "100%", height: "100%", marginTop: "-20px"}}>
      <Header/>
      <Spin spinning={excuteState} tip="任务生成中，请稍后..." size={"large"}>

        <div>
          {/* 条件 */}
          <div style={{background: 'white', height: 35}}>
            <Form form={formForProject} autoComplete="off" style={{marginLeft: 5}}>
              <Row>
                <Col span={6}>
                  <Form.Item label="所属执行:" name="belongExcution" required={true}>
                    <Select defaultValue="lucy" style={{width: '100%'}} allowClear onChange={excutionChanged}>
                      <Option value="lucy">Lucy</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="项目负责人:" name="projectManager" required={true} style={{marginLeft: 5}}>
                    <Select defaultValue="lucy" style={{width: '100%'}} allowClear
                            onChange={projectManagerChanged}>
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
            <div className="ag-theme-alpine" style={{height: gridHeight - 20, width: '100%'}}>
              <AgGridReact
                columnDefs={getProjectColumns()} // 定义列
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


export default ProjectTemplate;

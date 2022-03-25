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
import {
  loadUserSelect, loadExcutionSelect, getDutyPerson, getTempDetails, generateTask
} from "./axiosRequest/requestDataParse";
import {useRequest} from "ahooks";
import {loadProjectManager} from "@/pages/zentao/zentaoManage/btForProjectTemplate/axiosRequest/requestDataParse";

const {Option} = Select;
let dutyInfo: any;
// 组件初始化
const CheckBeforeOnline: React.FC<any> = () => {

  /* region 表格事件 */
  const [gridData, setGridData] = useState([]);
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

  // 更新表格的值（比如控件啥的）
  const updateGridData = (props: any, value: string) => {
    // 重设某行的值
    const rowNode = gridApi.current?.getRowNode(props.rowIndex);
    rowNode?.setData({
      ...props.data,
      [props.column.colId]: value
    });
  }
  /* endregion 表格事件 */

  /* region 获取跳转过来的模板，并获取对应数据 */
  const template = {id: '', name: '', type: ''};
  const location = history.location.query;
  if (location && JSON.stringify(location) !== '{}') {
    if (location.tempName) {
      template.name = location.tempName.toString();
    }
    if (location.tempID) {
      template.id = location.tempID.toString();
    }
    if (location.tempType) {
      template.type = location.tempType.toString();
    }
  }

  /* endregion 获取跳转过来的模板，并获取对应数据 */

  /* region 联动选项 */
  const [formForZentaoTask] = Form.useForm(); // 上线分支设置

  // 项目执行修改
  const excutionChanged = async (values: any, params: any,) => {

    let assigned_to = "";
    //   获取项目负责人，如果是特性项目就是执行里边设置的后端负责人；如果是班车就设置为值班计划里边当周的后端值班人
    if (params.sprintType === "sprint" || params.sprintType === "hotfix") { // 班车项目
      assigned_to = dutyInfo.backend;
    } else {
      // 特性项目
      const excuteInfo = values.split("&");
      assigned_to = (await loadProjectManager(Number(excuteInfo[0]))).user_name;
    }

    // 同样修改表格里面的值，增加类型为 新增（父任务）的指派人
    const atferValue: any = [];
    gridData.forEach((ele: any) => {
      if (ele.add_type_name === "新增") {
        atferValue.push({
          ...ele,
          assigned_person_name: assigned_to,
        });
      } else {
        atferValue.push(ele);
      }
    });
    setGridData(atferValue);
  };

  // 预计开始时间
  const planStartChanged = (params: any, values: any) => {
    //   时间改变后，下面的预计开始时间也要同步改变
    const atferValue: any = [];
    gridData.forEach((ele: any) => {
      atferValue.push({...ele, plan_start: values});
    });
    setGridData(atferValue);
  };

  // 预计结束时间
  const planEndChanged = (params: any, values: any) => {
    //   时间改变后，下面的预计截至时间也要同步改变
    const atferValue: any = [];
    gridData.forEach((ele: any) => {
      atferValue.push({...ele, plan_end: values});
    });
    setGridData(atferValue);
  };

  // 指派人修改后，也要对应修改表格中所属端的指派人(只是修改子任务指派人)
  const changeAssignedTo = (side: string, currentValue: any) => {

    const atferValue: any = [];
    gridData.forEach((ele: any) => {
      if (side === "Front" && (ele.task_name).startsWith(">【前端】")
        || side === "Backend" && (ele.task_name).startsWith(">【后端】")
        || side === "Tester" && (ele.task_name).startsWith(">【测试】")
        || side === "SQA" && (ele.task_name).startsWith(">【sqa】")) {
        atferValue.push({...ele, assigned_person_name: currentValue});
      } else {
        atferValue.push(ele);
      }
    });
    setGridData(atferValue);
  };

  /* endregion 联动选项 */

  /* region 表格中的时间选择修改和下拉框值 */
  const planTimeChanged = (props: any, timeValue: any) => {
    updateGridData(props, timeValue);
  };
  // 是否裁剪下拉框h值的变化
  const setGridCutValue = (props: any, selectedValue: any) => {
    updateGridData(props, selectedValue);
  };

  /* endregion 表格中的时间选择修改和下拉框值 */

  /* region 任务生成 */
  const [excuteState, setExcuteState] = useState(false);

  // 取消模板编辑
  const cancleTempEdit = () => {
    history.push('/zentao/templateList');
  };

  // 生成任务
  const builtTask = async () => {
    setExcuteState(true);
    // 需要校验空值
    const formData = formForZentaoTask.getFieldsValue();
    const gridDatas: any = [];
    // 遍历列表中的数据(不能用usestate中的值)
    gridApi.current?.forEachNode((node: any) => {
      gridDatas.push(node.data);
    });

    //   调用接口生成
    const result = await generateTask(template, formData, gridDatas);
    if (result) {
      message.error({
        content: result,
        duration: 1,
        className: 'delNone',
        style: {
          marginTop: '50vh',
        },
      });

    } else {
      message.info({
        content: "任务生成成功！",
        duration: 1,
        className: 'delNone',
        style: {
          marginTop: '50vh',
        },
      });

      history.push('/zentao/templateList');
    }

    setExcuteState(false);

  };

  /* endregion 任务生成 */

  /* region 界面初始化显示 */

  const frontUserInfo = useRequest(() => loadUserSelect("1")).data;
  const backendUserInfo = useRequest(() => loadUserSelect("2")).data;
  const testerUserInfo = useRequest(() => loadUserSelect("3")).data;
  const sqaUserInfo = useRequest(() => loadUserSelect("7")).data;
  const excutionInfo = useRequest(() => loadExcutionSelect()).data;

  const showPageInfo = async () => {
    dutyInfo = await getDutyPerson();
    formForZentaoTask.setFieldsValue({
      belongExcution: "",
      assingedToSQA: dutyInfo.sqa,
      assingedToFront: dutyInfo.front,
      assingedToBackend: dutyInfo.backend,
      assingedToTester: dutyInfo.test,
      planStart: moment(),
      planEnd: moment()
    });
    const tabInfo = await getTempDetails(template.id, dutyInfo);
    setGridData(tabInfo);
  };
  useEffect(() => {
    showPageInfo();
  }, [excutionInfo]);

  /* endregion  界面初始化显示 */

  return (
    <div style={{width: "100%", height: "100%", marginTop: "-20px"}}>
      <Header tempName={template.name}/>
      <Spin spinning={excuteState} tip="任务生成中，请稍后..." size={"large"}>
        <div style={{marginTop: 5}}>

          {/* 条件 */}
          <div style={{background: 'white', height: 80, paddingTop: 4}}>
            <Form form={formForZentaoTask} autoComplete="off" style={{marginLeft: 5}}>
              <Row>
                <Col span={6}>
                  <Form.Item label="所属执行:" name="belongExcution" required={true} style={{marginLeft: 14}}>
                    <Select style={{width: '100%'}} showSearch onChange={excutionChanged}>
                      {excutionInfo}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="SQA指派人:" name="assingedToSQA" required={true} style={{marginLeft: 19}}>
                    <Select style={{width: '100%'}}
                            onChange={(params: any) => {
                              changeAssignedTo("SQA", params);
                            }}>
                      {sqaUserInfo}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="前端指派人:" name="assingedToFront" required={true} style={{marginLeft: 19}}>
                    <Select style={{width: '100%'}}  showSearch
                            onChange={(params: any) => {
                              changeAssignedTo("Front", params);
                            }}>
                      {frontUserInfo}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="后端指派人:" name="assingedToBackend" required={true} style={{marginLeft: 5}}>
                    <Select style={{width: '100%'}} showSearch
                            onChange={(params: any) => {
                              changeAssignedTo("Backend", params);
                            }}>
                      {backendUserInfo}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{marginTop: -17}}>
                <Col span={6}>
                  <Form.Item label="测试指派人:" name="assingedToTester" required={true}>
                    <Select style={{width: '100%'}} showSearch
                            onChange={(params: any) => {
                              changeAssignedTo("Tester", params);
                            }}>
                      {testerUserInfo}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="预计开始日期:" name="planStart" required={true} style={{marginLeft: 5}}>
                    <DatePicker style={{width: "100%"}} onChange={planStartChanged} allowClear={false}/>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="预计结束日期:" name="planEnd" required={true} style={{marginLeft: 5}}>
                    <DatePicker style={{width: "100%"}} onChange={planEndChanged} allowClear={false}/>
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
                rowData={gridData} // 数据绑定
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
                frameworkComponents={{
                  timeRender: (props: any) => {
                    return (<DatePicker
                      allowClear={false} size={'small'}
                      defaultValue={moment(props.value)} bordered={false}
                      onChange={(params: any, value: any) => {
                        planTimeChanged(props, value)
                      }}
                    />);
                  },
                  cutRender: (props: any) => {
                    return (
                      <Select
                        size={'small'} defaultValue={props.value}
                        bordered={false} style={{width: '100%'}}
                        onChange={(selectedValue: any) => {
                          setGridCutValue(props, selectedValue);
                        }}
                      >
                        <Option key={'yes'} value={'yes'}>{'是'}</Option>
                        <Option key={'no'} value={'no'}>{'否'}</Option>
                      </Select>
                    );
                    // return cutRenderer(props.value);
                  },
                }}
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

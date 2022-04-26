import React, {useRef, useState} from 'react';
import {Button, Col, Form, Tooltip, Row, Select, Spin, TreeSelect, DatePicker} from "antd";
import {CopyOutlined,} from "@ant-design/icons";
import {AgGridReact} from "ag-grid-react";
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {PageContainer} from '@ant-design/pro-layout';
import {useRequest} from "ahooks";
import {zentaoExcutionSelect, zentaoStorySelect, zentaoDevCenterSelect} from "./component/selector";
import {getHeight} from "@/publicMethods/pageSet";
import {GridApi, GridReadyEvent} from "ag-grid-community";
import {gridColumns} from "./grid/columns";
import {getTaskGridData} from "./grid/datas";
import moment from "moment";

const {SHOW_PARENT} = TreeSelect;

// 组件初始化
const TaskDecompose: React.FC<any> = () => {

  const [createState, setCreateState] = useState(false); // 点击执行后的状态（是否执行完）

  /* region 表格事件 */
  const [gridHeight, setGridHeight] = useState(getHeight());
  const gridApi = useRef<GridApi>();
  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  window.onresize = () => {
    setGridHeight(getHeight());
    gridApi.current?.sizeColumnsToFit();
  };
  const gridData = useRequest(() => getTaskGridData()).data;

  /* endregion 表格事件 */

  /* region 下拉框加载 */
  const excutionSelect = useRequest(() => zentaoExcutionSelect()).data;
  const storySelect = useRequest(() => zentaoStorySelect()).data;
  const devCenterSelect = useRequest(() => zentaoDevCenterSelect()).data;
  /* endregion 下拉框加载 */

  /* region 操作栏相关事件 */


  const [formForTaskQuery] = Form.useForm();

  // 所属执行改变
  const executionChanged = () => {

  };


  // 禅道需求改变
  const ztStoryChanged = () => {

  }
  // 指派人改变
  const assignedToChanged = () => {

  }

  // 创建人改变
  const createrChanged = () => {

  };

  // 点击创建任务按钮
  const createZentaoTask = () => {

    setCreateState(true);
  };

  /* endregion 操作栏相关事件 */

  /* region 表格中事件触发 */
  const updateGridData = (props: any, value: string) => {
    // 重设某行的值
    const rowNode = gridApi.current?.getRowNode(props.rowIndex);
    rowNode?.setData({
      ...props.data,
      [props.column.colId]: value
    });
  }
  // 指派人修改
  const assignedSelectChanged = (props: any, value: any) => {
    const rowNode = gridApi.current?.getRowNode(props.rowIndex);
    rowNode?.setData({
      ...props.data,
      [props.column.colId]: value
    });
  }
  // 计划时间修改
  const planTimeChanged = (props: any, timeValue: any) => {
    updateGridData(props, timeValue);
  };

  // 表格编辑完毕
  const gridEditedEnd = () => {

  };

  /* endregion 表格中事件触发 */


  return (
    <PageContainer style={{marginTop: -30}}>
      <Spin spinning={createState} tip="任务创建中..." size={"large"}>
        <div style={{marginTop: -15}}>
          <Form form={formForTaskQuery}>
            {/* gutter col 之间的间隔 [水平，垂直] */}
            <Row style={{marginLeft: -10}} gutter={[4, 4]}>
              <Col>
                <Tooltip title="创建任务">
                  <Button type="text" icon={<CopyOutlined/>} size={'middle'}
                          style={{
                            color: '#46A0FC'
                          }}
                          onClick={createZentaoTask}>
                  </Button>
                </Tooltip>
              </Col>
              <Col span={5}>
                <Form.Item label="所属执行" name="execution">
                  <Select style={{width: '100%'}} showSearch onChange={executionChanged}>
                    {excutionSelect}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="禅道需求" name="ztStory">
                  <TreeSelect
                    showSearch
                    style={{width: '100%'}}
                    treeCheckable={true}
                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                    allowClear
                    treeDefaultExpandAll
                    treeData={storySelect}
                    showCheckedStrategy={SHOW_PARENT}
                    maxTagCount={'responsive'}
                    onChange={ztStoryChanged}
                  >
                  </TreeSelect>

                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="指派给" name="assignedTo">
                  <Select style={{width: '100%'}} showSearch onChange={assignedToChanged}>
                    {devCenterSelect}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="由谁创建" name="creater">
                  <Select style={{width: '100%'}} showSearch onChange={createrChanged}>
                    {devCenterSelect}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        {/* 表格 */}
        <div style={{marginTop: -15}}>
          <div className="ag-theme-alpine" style={{height: gridHeight, width: '100%'}}>
            <AgGridReact
              columnDefs={gridColumns} // 定义列
              rowData={gridData} // 数据绑定
              defaultColDef={{
                resizable: true,
                sortable: true,
                filter: true,
                suppressMenu: true,
                minWidth: 90,
                width: 90,
                cellStyle: {'line-height': '28px'},
              }}
              rowHeight={28}
              headerHeight={30}
              suppressRowTransform={true}
              onGridReady={onGridReady}
              onCellEditingStopped={gridEditedEnd}
              frameworkComponents={{
                assigenedTo: (props: any) => {
                  return (
                    <Select
                      size={'small'} defaultValue={props.value}
                      bordered={false} style={{width: '120%'}} showSearch
                      onChange={(currentValue: any) => {
                        assignedSelectChanged(props, currentValue);
                      }}
                    >
                      {devCenterSelect}
                    </Select>
                  );

                },
                timeRender: (props: any) => {
                  return (<DatePicker
                    allowClear={false} size={'small'}
                    defaultValue={moment(props.value)} bordered={false}
                    onChange={(params: any, value: any) => {
                      planTimeChanged(props, value)
                    }}
                  />);
                }
              }}
            >
            </AgGridReact>
          </div>
        </div>
      </Spin>
    </PageContainer>
  );
};


export default TaskDecompose;

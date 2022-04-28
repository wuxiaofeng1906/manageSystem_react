import React, {useRef, useState, useMemo, useEffect} from 'react';
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
import {gridColumns, setCellStyle} from "./grid/columns";
import {getInitGridData, getGridDataByStory} from "./grid/datas";
import moment from "moment";
import DetailCellRenderer from "./grid/DetailCellRenderer";
import {errorMessage, sucMessage} from "@/publicMethods/showMessages";
import {createZentaoTaskDecompose} from "./taskCreate";

const {SHOW_PARENT} = TreeSelect;
let devCenterPerson: any = [];
// 组件初始化
const TaskDecompose: React.FC<any> = () => {

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

  const zentaoTemplate = useRequest(() => getInitGridData()).data;


  const detailCellRenderer: any = useMemo(() => {
    return DetailCellRenderer;
  }, []);

  /* endregion 表格事件 */

  /* region 下拉框加载 */

  const excutionSelect = useRequest(() => zentaoExcutionSelect()).data;
  const devCenterSelect = useRequest(() => zentaoDevCenterSelect()).data;
  /* endregion 下拉框加载 */

  /* region 操作栏相关事件 */
  const [formForTaskQuery] = Form.useForm();
  const [storySelect, setStorySelect] = useState([]);
  const [createState, setCreateState] = useState(false); // 点击执行后的状态（是否执行完）

  // 根据条件获取需求数据
  const getZentaoStory = async () => {
    const formDt = formForTaskQuery.getFieldsValue();
    if (!formDt.execution) {
      errorMessage("请先选择所属执行！");
      return;
    }
    const params = {
      execution_id: formDt.execution,
      create_user: formDt.creater,
      assigned_to: formDt.assignedTo
    };
    const selectArray = await zentaoStorySelect(params);
    setStorySelect(selectArray);
  };

  // 设置展开的行（用于设置空白行）
  const setExpandedRow = () => {
    gridApi.current?.forEachNode((node: any) => {
      node.setExpanded(Number(node.id) % 5 === 4);
    });
  };

  // 禅道需求改变
  const ztStoryChanged = async (params: any) => {
    //  需要同步到下面表格中，一个需求生成5条数据,如果小于4个需求，则显示4块，其他的为空白即可。
    const formDt = formForTaskQuery.getFieldsValue();
    const queryInfo = {
      execution_id: formDt.execution,
      create_user: formDt.creater,
      assigned_to: formDt.assignedTo
    };
    const tempData = await getGridDataByStory(params, queryInfo);
    gridApi.current?.setRowData(tempData);
    setExpandedRow();
  }

  // 点击创建任务按钮
  const createZentaoTask = async () => {
    setCreateState(true);
    const gridData: any = [];
    gridApi.current?.forEachNode((node: any) => {
      // 需要判断相关需求是不是为空，为空的话表示默认数据，则不生成。

      const rowData = node.data;
      if (rowData.subtask_dev_needs) {
        gridData.push(rowData);
      }
    });

    const createResult = await createZentaoTaskDecompose(gridData, formForTaskQuery.getFieldValue("execution"));
    if (createResult.code === 200) {
      sucMessage("执行成功！");
    } else {
      errorMessage(`执行失败：${createResult.msg}`)
    }
    setCreateState(false);
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

  // 表格编辑完毕
  const gridEditedEnd = () => {

  };

  /* endregion 表格中事件触发 */

  useEffect(() => {
    devCenterPerson = devCenterSelect;
  }, [devCenterSelect])
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
                  <Select style={{width: '100%'}} showSearch onChange={getZentaoStory} allowClear placeholder="请选择"
                          filterOption={(inputValue: string, option: any) =>
                            !!option.children.includes(inputValue)}>
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
                    placeholder={"请选择"}
                    treeNodeLabelProp={"key"}
                    filterTreeNode={(inputValue: string, treeNode: any) => {
                      return !!treeNode?.title.includes(inputValue);
                    }}
                  >
                  </TreeSelect>

                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="指派给" name="assignedTo">
                  <Select style={{width: '100%'}} showSearch onChange={getZentaoStory} allowClear placeholder="请选择"
                          filterOption={(inputValue: string, option: any) =>
                            !!option.children.includes(inputValue)}>
                    {devCenterSelect}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="由谁创建" name="creater">
                  <Select style={{width: '100%'}} showSearch onChange={getZentaoStory} allowClear placeholder="请选择"
                          filterOption={(inputValue: string, option: any) =>
                            !!option.children.includes(inputValue)}>
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
              rowData={zentaoTemplate} // 数据绑定
              defaultColDef={{
                resizable: true,
                sortable: true,
                filter: true,
                suppressMenu: true,
                minWidth: 90,
                width: 90,
                cellStyle: setCellStyle,
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
                      filterOption={(inputValue: string, option: any) =>
                        !!option.children.includes(inputValue)}
                      onChange={(currentValue: any) => {
                        updateGridData(props, currentValue);
                      }}
                    >
                      {devCenterPerson}
                    </Select>
                  );
                },
                timeRender: (props: any) => {
                  return (<DatePicker
                    allowClear={false} size={'small'} style={{width: "100%"}}
                    defaultValue={moment(props.value)} bordered={false}
                    onChange={(params: any, currentValue: any) => {
                      updateGridData(props, currentValue)
                    }}
                  />);
                }
              }}
              masterDetail={true}
              detailCellRenderer={detailCellRenderer}
              detailRowHeight={28}
              onFirstDataRendered={setExpandedRow}
            >
            </AgGridReact>
          </div>
        </div>
      </Spin>
    </PageContainer>
  );
};


export default TaskDecompose;

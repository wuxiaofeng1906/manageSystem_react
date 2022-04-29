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
import {getInitGridData, getGridDataByStory, getParentEstimate, getEmptyRow} from "./grid/datas";
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

  // 通过接口获取表格的数据
  const getOraGridData = () => {
    const gridData: any = [];
    gridApi.current?.forEachNode((node: any) => {
      // 需要判断相关需求是不是为空，为空的话表示默认数据，则不生成。
      const rowData = node.data;
      if (rowData.subtask_dev_needs) {
        gridData.push(rowData);
      }
    });

    return gridData;
  }
  /* endregion 表格事件 */

  /* region 下拉框加载 */

  const excutionSelect = useRequest(() => zentaoExcutionSelect()).data;
  const devCenterSelect = useRequest(() => zentaoDevCenterSelect()).data;
  /* endregion 下拉框加载 */

  /* region 操作栏相关事件 */
  const [formForTaskQuery] = Form.useForm();
  const [storySelect, setStorySelect] = useState([]);
  const [createState, setCreateState] = useState(false); // 点击执行后的状态（是否执行完）
  // 设置展开的行（用于设置空白行）
  const setExpandedRow = () => {
    gridApi.current?.forEachNode((node: any) => {
      node.setExpanded(Number(node.id) % 5 === 4);
    });
  };
  // 根据条件获取需求数据
  const getZentaoStory = async (param: any) => {
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

    // 如果选择的是所属执行，并且禅道需求有选择数据，则也要清空禅道需求选择框以及表格的数据，指派给和由谁创建不需要清空
    if (param === "execution" && formDt.ztStory && (formDt.ztStory).length > 0) {
      formForTaskQuery.setFieldsValue({
        ztStory: undefined
      });
      gridApi.current?.setRowData(await getInitGridData());
      setExpandedRow();
    }
  };

  // 禅道需求改变
  const ztStoryChanged = async (params: any, other: any, currentValue: any) => {
    debugger;
    let fianlData = [];
    // 通过currentValue的triggerValue可以拿到当前选择的值，之前选择的值就不用再改变了。
    const selectedValue = currentValue.triggerValue;

    if (currentValue.checked) { // 是选中的话就增加记录，如果是false，则删除本条记录
      //  需要同步到下面表格中，一个需求生成5条数据,如果小于4个需求，则显示4块，其他的为空白即可。
      const formDt = formForTaskQuery.getFieldsValue();
      const queryInfo = {
        execution_id: formDt.execution,
        create_user: formDt.creater,
        assigned_to: formDt.assignedTo
      };
      debugger;
      const {preValue} = currentValue; // 之前选择框中的数据，用于全选时不覆盖之前的数据操作
      const perValueArray = [];
       preValue.forEach((ele: any) => {
         perValueArray.push(ele.value);
      });

      const tempData = await getGridDataByStory(selectedValue, perValueArray, queryInfo);

      //   如果是全选的话，就不拼接之前的数据了
      // if (selectedValue === "全选") {
      //   fianlData = [...tempData];
      // } else {
      // 获取表格之前数据，拼接起来即可，不重新刷新之前的数据
      fianlData = getOraGridData().concat(tempData);
      // }
    } else if (selectedValue !== "全选") {

      const oraData = getOraGridData();
      oraData.forEach((ele: any) => {
        //   如果是删掉的id,则不添加到数据中去。
        if (ele.subtask_dev_id !== selectedValue) {
          fianlData.push(ele);
        }
      });
    }

    const storyCount = Math.floor((fianlData.length) / 5);

    // 看原本查询了多少个，如果少于4个，则需要拼接成4个块展示。
    if (storyCount < 4) {
      // 拿取剩余的初始化数据
      const initData = await getEmptyRow(4 - storyCount);
      fianlData = fianlData.concat(initData);
      gridApi.current?.setRowData(fianlData);
    } else {
      gridApi.current?.setRowData(fianlData);
    }
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
      sucMessage("任务正在生成，请稍后查看！");
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
  const gridEditedEnd = (params: any) => {

    // 最初预计进行格式验证
    if (params.column.colId === "estimate") {
      //   判断是不是为数字
      if (params.newValue !== "0" && !Number(params.newValue)) {
        errorMessage("【最初预计】必须为数字！");
        updateGridData(params, params.oldValue);
        return;
      }

      // 如果是子任务，还要把父任务的最初预计同步
      if (params.data?.add_type === "subtask") {

        const tabData: any = [];
        gridApi.current?.forEachNode((node: any) => {
          tabData.push(node.data);
        });
        // 计算父任务的最初预计
        const parentInfo = getParentEstimate(tabData, params);
        const rowNode = gridApi.current?.getRowNode((parentInfo.parentIndex).toString());
        rowNode?.setData({
          ...tabData[parentInfo.parentIndex],
          "estimate": parentInfo.parentValue
        })
      }
    }
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
                  <Select style={{width: '100%'}} showSearch onChange={() => {
                    getZentaoStory("execution")
                  }} allowClear placeholder="请选择"
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
                  <Select style={{width: '100%'}} showSearch onChange={() => {
                    getZentaoStory("assignedTo")
                  }} allowClear placeholder="请选择"
                          filterOption={(inputValue: string, option: any) =>
                            !!option.children.includes(inputValue)}>
                    {devCenterSelect}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="由谁创建" name="creater">
                  <Select style={{width: '100%'}} showSearch onChange={() => {
                    getZentaoStory("creater")
                  }} allowClear placeholder="请选择"
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
                // sortable: true,
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

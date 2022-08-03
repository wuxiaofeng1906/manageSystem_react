import React, { useRef, useState, useEffect } from 'react';
import { Button, Col, Form, Row, Select, Spin, TreeSelect, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { useRequest } from 'ahooks';
import {
  zentaoExcutionSelect,
  zentaoStorySelect,
  zentaoDevCenterSelect,
  zentaoAppServerSelect,
} from './component/selector';
import { getHeight } from '@/publicMethods/pageSet';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { gridColumns, setCellStyle } from './grid/columns';
import Header from './component/CusPageHeader';
import {
  getInitGridData,
  getGridDataByStory,
  getParentEstimate,
  getEmptyRow,
  insertEmptyRows,
  judgeTaskName,
} from './grid/datas';
import moment from 'moment';
import { errorMessage, infoMessage, sucMessage } from '@/publicMethods/showMessages';
import { createZentaoTaskDecompose } from './taskCreate';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';

const { SHOW_PARENT } = TreeSelect;
let devCenterPerson: any;
let appServerList: string[] = [];
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

  // 通过接口获取表格的数据
  const getOraGridData = () => {
    const gridData: any = [];
    gridApi.current?.forEachNode((node: any) => {
      // 需要判断相关需求是不是为空，为空的话表示默认数据，则不添加。
      const rowData = node.data;
      if (rowData.subtask_dev_needs) {
        gridData.push(rowData);
      }
    });
    return gridData;
  };
  /* endregion 表格事件 */

  /* region 下拉框加载 */
  const excutionSelect = useRequest(() => zentaoExcutionSelect()).data;
  const devCenterSelect: any = useRequest(() => zentaoDevCenterSelect()).data;
  const appServerSource: any = useRequest(() => zentaoAppServerSelect()).data;
  /* endregion 下拉框加载 */

  /* region 操作栏相关事件 */
  const [formForTaskQuery] = Form.useForm();
  const [storySelect, setStorySelect] = useState([]);
  const [createState, setCreateState] = useState(false); // 点击执行后的状态（是否执行完）

  // 显示表格数据（包含拼初始化数据）
  const showGridData = async (gridData: any) => {
    let fianlGridData = gridData;
    const storyCount = Math.floor(fianlGridData.length / 5);
    // 看原本查询了多少个，如果少于4个，则需要拼接成4个块展示。
    if (storyCount < 4) {
      // 拿取剩余的初始化数据
      const initData = await getEmptyRow(4 - storyCount);
      fianlGridData = fianlGridData.concat(initData);
      gridApi.current?.setRowData(insertEmptyRows(fianlGridData));
    } else {
      gridApi.current?.setRowData(insertEmptyRows(fianlGridData));
    }
  };

  // 所属执行和指派给以及由谁创建选择后数据展示。
  const showSelectChangedData = async (params: any, storyData: any) => {
    const storys = formForTaskQuery.getFieldValue('ztStory');
    // 如果选择的是所属执行，需要清空数据
    if (params === 'execution') {
      if (storys && storys.length > 0) {
        formForTaskQuery.setFieldsValue({
          ztStory: [],
        });
        gridApi.current?.setRowData(await getInitGridData());
        return;
      }
      return;
    }

    // 如果选择的不是所属执行，而是指派给和由谁创建，查询后的需求为空，则表格和查询栏都需要清空。
    if (!storyData || storyData.length === 0) {
      formForTaskQuery.setFieldsValue({
        ztStory: undefined,
      });
      gridApi.current?.setRowData(await getInitGridData());
      return;
    }
    // 如果选择的是指派给和由谁创建,则需要判断禅道需求框里面有无符合筛选条件的数据，符合的数据就保留，不符合的就删除。
    const allSelect = storyData[0].children;
    const oraData = getOraGridData();

    if (storys && storys.length) {
      const newStoryArray: any = []; // 保存存在的id
      const fianlGridData: any = []; // 保存后面需要的表格数据
      storys.forEach((id: number) => {
        // 判断需求框中的需求是否在查询后的结果中。
        allSelect.forEach((ele: any) => {
          if (id === ele.key) {
            newStoryArray.push(id);
          }
        });
      });
      // 更新需求数据
      formForTaskQuery.setFieldsValue({
        ztStory: newStoryArray,
      });

      oraData.forEach((ele: any) => {
        // 将已有的数据保存
        if (newStoryArray.indexOf(ele.subtask_dev_id) > -1) {
          fianlGridData.push(ele);
        }
      });
      // 更新表格数据
      await showGridData(fianlGridData);
    }
  };

  const getZentaoStoryByConditon = async () => {
    const formDt = formForTaskQuery.getFieldsValue();
    if (!formDt.execution) {
      errorMessage('请先选择所属执行！');
      return;
    }
    const params = {
      execution_id: formDt.execution,
      create_user: formDt.creater,
      assigned_to: formDt.assignedTo,
    };
    const selectArray = await zentaoStorySelect(params);
    // 下拉框数据
    setStorySelect(selectArray);
  };
  // 根据条件获取需求数据
  const getZentaoStory = async (param: any) => {
    const selectArray = await getZentaoStoryByConditon();
    // 需要判断禅道需求和表格数据是否清空。
    await showSelectChangedData(param, selectArray);
  };

  // 禅道需求改变
  const ztStoryChanged = async (params: any, other: any, currentValue: any) => {
    let fianlData = [];
    // 通过currentValue的triggerValue可以拿到当前选择的值，之前选择的值就不用再改变了。
    const selectedValue = currentValue.triggerValue;

    if (currentValue.checked) {
      // 是选中的话就增加记录，如果是false，则删除本条记录
      //  需要同步到下面表格中，一个需求生成5条数据,如果小于4个需求，则显示4块，其他的为空白即可。
      const formDt = formForTaskQuery.getFieldsValue();
      const queryInfo = {
        execution_id: formDt.execution,
        create_user: formDt.creater,
        assigned_to: formDt.assignedTo,
      };

      const perValueArray: any = [];
      const { preValue } = currentValue; // 之前选择框中的数据，用于全选时不覆盖之前的数据操作
      preValue.forEach((ele: any) => {
        perValueArray.push(ele.value);
      });

      const tempData = await getGridDataByStory(selectedValue, perValueArray, queryInfo);
      // 获取表格之前数据，拼接起来即可，不重新刷新之前的数据
      fianlData = getOraGridData().concat(tempData);
    } else if (selectedValue !== '全选' && currentValue.checked === false) {
      const oraData = getOraGridData();
      oraData.forEach((ele: any) => {
        //   如果是删掉的id,则不添加到数据中去。
        if (ele.subtask_dev_id !== selectedValue) {
          fianlData.push(ele);
        }
      });
    }
    await showGridData(fianlData);
  };

  // 点击创建任务按钮
  const createZentaoTask = async () => {
    // 需要验证禅道需求不能为空（所属执行不需要判断，因为要选择禅道需求就必须选额所属执行）
    if (
      !formForTaskQuery.getFieldValue('ztStory') ||
      formForTaskQuery.getFieldValue('ztStory').length === 0
    ) {
      errorMessage('禅道需求不能为空！');
      return;
    }
    // 任务类型为开发时，应用服务不能为空
    const gridData: any = getOraGridData(); // 获取表格数据
    let validRow: number[] = [];
    gridData.forEach((it: any, index: number) => {
      if (it.task_type_name == '开发' && isEmpty(it.app_server)) {
        validRow.push(index + 1);
      }
    });
    if (!isEmpty(validRow))
      return infoMessage(`第${validRow.join(',')}行中任务类型为开发，应用服务不能为空！`);
    setCreateState(true);
    const createResult = await createZentaoTaskDecompose(
      gridData,
      formForTaskQuery.getFieldValue('execution'),
    );
    if (createResult.code === 200) {
      sucMessage('任务创建成功！');
      //   成功后需要重置禅道需求列表
      await getZentaoStoryByConditon();
    } else {
      const repeatStory = createResult.data;
      if (repeatStory && repeatStory.length > 0) {
        errorMessage(`创建失败：需求【${repeatStory.join('、')}】已创建任务`);
      } else {
        errorMessage(`需求创建失败：${createResult.msg}`);
      }
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
      [props.column.colId]: value,
    });
  };

  // 预计时间选择事件
  const planTimeChaned = (props: any, currentValue: any) => {
    //  预计开始或者预计截止时间 ，需要判断开始时间不能大于截止时间
    let oldValue = currentValue;
    if (props.column?.colId === 'plan_start') {
      let planEnd = props.data?.plan_end;
      if (!planEnd) {
        planEnd = dayjs().format('YYYY-MM-DD');
      }
      if (currentValue > planEnd) {
        oldValue = props.data?.plan_start;
        errorMessage('预计开始时间不能大于预计截止时间！');
      }
    }

    if (props.column?.colId === 'plan_end') {
      let planStart = props.data?.plan_start;
      if (!planStart) {
        planStart = dayjs().format('YYYY-MM-DD');
      }
      if (planStart > currentValue) {
        oldValue = props.data?.plan_end;
        errorMessage('预计截止时间不能小于预计开始时间！');
      }
    }
    updateGridData(props, oldValue);
  };
  // 表格编辑完毕
  const gridEditedEnd = (params: any) => {
    // 最初预计进行格式验证
    if (params.column.colId === 'estimate') {
      //   判断是不是为数字
      if (params.newValue !== '0' && !Number(params.newValue)) {
        errorMessage('【最初预计】必须为数字！');
        updateGridData(params, params.oldValue);
        return;
      }

      // 如果是子任务，还要把父任务的最初预计同步
      if (params.data?.add_type === 'subtask') {
        const tabData: any = [];
        gridApi.current?.forEachNode((node: any) => {
          tabData.push(node.data);
        });
        // 计算父任务的最初预计
        const parentInfo = getParentEstimate(tabData, params);
        const rowNode = gridApi.current?.getRowNode(parentInfo.parentIndex.toString());
        rowNode?.setData({
          ...tabData[parentInfo.parentIndex],
          estimate: parentInfo.parentValue,
        });
      }
    } else if (params.column.colId === 'task_name') {
      // 任务名称不能为空，必须包含相关字段。
      const message = judgeTaskName(params);
      if (message !== '') {
        errorMessage(message);
        updateGridData(params, params.oldValue);
      }
    }
  };

  /* endregion 表格中事件触发 */

  useEffect(() => {
    devCenterPerson = devCenterSelect;
  }, [devCenterSelect]);

  useEffect(() => {
    appServerList = appServerSource;
  }, [appServerSource]);

  return (
    <div>
      <Header />
      <Spin spinning={createState} tip="任务创建中..." size={'large'}>
        <div style={{ marginTop: 3 }}>
          <Form form={formForTaskQuery}>
            {/* gutter col 之间的间隔 [水平，垂直] */}
            <Row gutter={[4, 4]}>
              <Col span={2}>
                <Form.Item name="createTask">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size={'small'}
                    onClick={createZentaoTask}
                    style={{ width: '100%', borderRadius: 5 }}
                  >
                    建任务
                  </Button>
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label="所属执行" name="execution">
                  <Select
                    style={{ width: '100%' }}
                    showSearch
                    onChange={() => {
                      getZentaoStory('execution');
                    }}
                    allowClear
                    placeholder="请选择"
                    size={'small'}
                    filterOption={(inputValue: string, option: any) =>
                      !!option.children.includes(inputValue)
                    }
                  >
                    {excutionSelect}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item label="禅道需求" name="ztStory">
                  <TreeSelect
                    size={'small'}
                    showSearch
                    style={{ width: '100%' }}
                    treeCheckable={true}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    allowClear
                    treeDefaultExpandAll
                    treeData={storySelect}
                    showCheckedStrategy={SHOW_PARENT}
                    maxTagCount={'responsive'}
                    onChange={ztStoryChanged}
                    placeholder={'请选择'}
                    treeNodeLabelProp={'key'}
                    filterTreeNode={(inputValue: string, treeNode: any) => {
                      return !!treeNode?.title.includes(inputValue);
                    }}
                  ></TreeSelect>
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item label="指派给" name="assignedTo">
                  <Select
                    style={{ width: '100%' }}
                    showSearch
                    onChange={() => {
                      getZentaoStory('assignedTo');
                    }}
                    allowClear
                    placeholder="请选择"
                    size={'small'}
                    filterOption={(inputValue: string, option: any) =>
                      !!option.children.includes(inputValue)
                    }
                  >
                    {devCenterSelect?.assignedOption}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item label="由谁创建" name="creater">
                  <Select
                    style={{ width: '100%' }}
                    showSearch
                    onChange={() => {
                      getZentaoStory('creater');
                    }}
                    allowClear
                    placeholder="请选择"
                    size={'small'}
                    filterOption={(inputValue: string, option: any) =>
                      !!option.children.includes(inputValue)
                    }
                  >
                    {devCenterSelect?.createOption}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        {/* 表格 */}
        <div style={{ marginTop: -25 }}>
          <div className="ag-theme-alpine" style={{ height: gridHeight + 40, width: '100%' }}>
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
              rowHeight={25}
              headerHeight={27}
              suppressRowTransform={true}
              onGridReady={onGridReady}
              onCellEditingStopped={gridEditedEnd}
              frameworkComponents={{
                assigenedTo: (props: any) => {
                  if (props.data?.No === 6) {
                    return '';
                  }
                  return (
                    <Select
                      size={'small'}
                      defaultValue={props.value}
                      bordered={false}
                      style={{ width: '120%' }}
                      showSearch
                      filterOption={(inputValue: string, option: any) =>
                        !!option.children.includes(inputValue)
                      }
                      onChange={(currentValue: any) => {
                        updateGridData(props, currentValue);
                      }}
                    >
                      {devCenterPerson?.createOption}
                    </Select>
                  );
                },
                timeRender: (props: any) => {
                  if (props.data?.No === 6) {
                    return '';
                  }
                  return (
                    <DatePicker
                      allowClear={false}
                      size={'small'}
                      style={{ width: '100%' }}
                      defaultValue={moment(props.value)}
                      bordered={false}
                      onChange={(params: any, currentValue: any) => {
                        planTimeChaned(props, currentValue);
                      }}
                    />
                  );
                },
                tailoring: (params: any) => {
                  return params.data?.No === 6 ? (
                    ''
                  ) : (
                    <Select
                      options={[
                        { label: '是', value: 'yes' },
                        { label: '否', value: 'no' },
                      ]}
                      defaultValue={params.value}
                      disabled={params.data.add_type == 'add'}
                      bordered={false}
                      onChange={(v) => {
                        let rowNode = gridApi.current?.getRowNode(params.rowIndex);
                        // 为是： 标题修改为无，应用服务为 不涉及
                        rowNode?.setData({
                          ...params.data,
                          is_tailoring: v,
                          origin_task_name: params.data.task_name, // 用于将任务名称还原为最初的标题
                          app_server: v == 'yes' ? ['notinvolved'] : [],
                          task_name:
                            v == 'yes'
                              ? `${params.data.task_name.split('】')[0]}】无`
                              : params.data.origin_task_name || params.data.task_name,
                        });
                      }}
                    />
                  );
                },
                appServer: (params: any) => {
                  return params.data?.No === 6 ? (
                    ''
                  ) : (
                    <Select
                      style={{ width: '110%' }}
                      mode={'multiple'}
                      defaultValue={params.value}
                      bordered={false}
                      showArrow
                      maxTagCount={'responsive'}
                      onChange={(v) => {
                        let rowNode = gridApi.current?.getRowNode(params.rowIndex);
                        rowNode?.setData({ ...params.data, app_server: v });
                      }}
                    >
                      {appServerList?.map((it) => (
                        <Select.Option value={it} key={it}>
                          {it == 'notinvolved' ? '不涉及' : it}
                        </Select.Option>
                      ))}
                    </Select>
                  );
                },
              }}
            ></AgGridReact>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default TaskDecompose;

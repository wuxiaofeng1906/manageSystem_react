import React, {useEffect, useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {Button, Col, Form, Input, message, Modal, Row, Select, Upload} from 'antd';
import Header from './components/CusPageHeader';
import {DeleteTwoTone, ImportOutlined} from '@ant-design/icons';
import {getTempColumns, columnsAdd} from './gridMethod/columns';
import {getHeight} from '@/publicMethods/pageSet';
import {history} from '@@/core/history';
import {loadExcelData, getGridDataFromExcel} from './import';
import {
  getTemTypeSelect, getAddTypeSelect, getAssignedToSelect,
  getPrioritySelect, getTaskTypeSelect, getSideSelect,
  getTaskSourceSelect, deleteTemplateList, vertifySaveData,
  saveTempList,
} from './axiosRequest/requestDataParse';
import {getTemplateDetails} from './gridMethod/girdData';
import {useRequest} from 'ahooks';

const {Option} = Select;
const selectOptions = {
  addType: [],
  assignedTo: [],
  priority: [],
  taskType: [],
  side: [],
  taskSource: [],
};
// 表格中的下拉框在渲染时调用不到state中的gridData数据，只能定义一个全局变量用于表格中的控件值的变化。
let gridDataForTableComponent: any = []; // gridDataForTableComponent 必须一直等于useState中的gridData值。意味着每一个setGridData后面都需要给gridDataForTableComponent赋一个最新的值

// 组件初始化
const EditTemplateList: React.FC<any> = () => {
  /* region 表格事件 */
  const [gridData, setGridData] = useState([]);
  // 获取跳转过来的模板，并获取对应数据
  const template = {id: '', name: '', type: '', type_name: ''};
  const location = history.location.query;
  if (location && JSON.stringify(location) !== '{}') {
    if (location.tempName) {
      template.name = location.tempName.toString();
    }
    if (location.tempId) {
      template.id = location.tempId.toString();
    }
    if (location.tempType) {
      if (((location.tempType).toString()).split("|")[0]) {
        template.type = ((location.tempType).toString()).split("|")[0].toString();
        template.type_name = ((location.tempType).toString()).split("|")[1].toString();
      }
    }
  }

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

  /* region 数据导入和新增 */
  // 导入excel任务
  const importTemplate = (file: any) => {
    //   获取数据
    loadExcelData(file).then((result: any) => {
      if (result.message) {
        message.error({
          content: `导入失败：${result.message}`,
          duration: 1,
          style: {marginTop: '50vh'},
        });
        return;
      }
      // 将数据显示到表格中
      if (result.data.length === 0) {
        message.error({
          content: `导入失败：表格中没有数据！`,
          duration: 1,
          style: {marginTop: '50vh'},
        });
        return;
      }

      const newDatas: any = getGridDataFromExcel(result.data);
      // 导入需要追加之前的数据，从表格遍历获取数据，不能直接用state中的gridData，因为在手动新增一行时不会更新state
      const oraData: any = [];
      gridApi.current?.forEachNode((node: any) => {
        oraData.push(node.data);
      });

      setGridData(oraData.concat(newDatas));
      gridDataForTableComponent = oraData.concat(newDatas);
    });
  };

  // 新增行
  (window as any).addTemplateRow = async (rowIndex: any, rowData: any) => {
    const addData = columnsAdd(rowIndex, rowData, gridData);
    gridApi.current?.updateRowData({add: [addData.row], addIndex: addData.position});
    gridDataForTableComponent.length = 0;
    gridApi.current?.forEachNode((node: any) => {
      gridDataForTableComponent.push(node.data);
    });

  };

  /* endregion 数据导入和新增 */

  /* region 删除行 */
  const [isdelModalVisible, setIsDelModalVisible] = useState({
    showFalg: false,
    db_delData: '', // 需要从数据库删除的数据
    cu_delData: [], // 本地的数据，还未保存到数据库中
  });

  // 删除行弹窗
  const delTemplateRow = () => {
    // 获取选中的行
    const selRows: any = gridApi.current?.getSelectedRows(); // 获取选中的行
    if (selRows.length === 0) {
      message.error({
        content: '请选中需要删除的数据!',
        duration: 1,
        className: 'delNone',
        style: {
          marginTop: '50vh',
        },
      });
      return;
    }
    let selData = '';
    // 获取需要删除的ID
    selRows.forEach((ele: any) => {
      // 首先要判断有没有subtask_id，有的话才是数据库中已经存储的，需要链接数据库删除，如果没有的，直接在表格中删除即可。
      if (ele.subtask_id) {
        selData = selData === '' ? ele.subtask_id : `${selData},${ele.subtask_id}`;
      }
    });
    setIsDelModalVisible({
      showFalg: true,
      db_delData: selData,
      cu_delData: selRows,
    });
  };

  // 取消删除
  const delFormCancle = () => {
    setIsDelModalVisible({
      showFalg: false,
      db_delData: '',
      cu_delData: [],
    });
  };

  // 确定删除选中项
  const delTempRow = async () => {
    // 判断有无数据库删除项目，有的话则调用删除接口，没有直接删除表格本地数据即可
    if (isdelModalVisible.db_delData) {
      const rtMsg = await deleteTemplateList(isdelModalVisible.db_delData);
      if (rtMsg) {
        message.error({
          content: `删除失败：${rtMsg}`,
          duration: 1,
          className: 'delNone',
          style: {
            marginTop: '50vh',
          },
        });
        return;
      }
    }

    gridApi.current?.updateRowData({remove: isdelModalVisible.cu_delData});
    // 这里还需要重置 gridDataForTableComponent
    gridDataForTableComponent.length = 0; // 清除之前的数据
    gridApi.current?.forEachNode((node: any) => {
      gridDataForTableComponent.push(node.data);
    });

    setIsDelModalVisible({
      showFalg: false,
      db_delData: '', // 需要从数据库删除的数据
      cu_delData: [], // 本地的数据，还未保存到数据库中
    });
    message.info({
      content: `删除成功！`,
      duration: 1,
      className: 'delNone',
      style: {
        marginTop: '50vh',
      },
    });
  };

  /* endregion  删除行 */

  /* region 模板保存 */
  const [formForTemplate] = Form.useForm();

  // 表格中数据变化
  const gridSelectChanged = (index: number, filed: string, value: any) => {
    if (index && filed) {
      gridDataForTableComponent[index][filed] = value; // 修改对应的字段的值。
      // gridApi.current?.refreshCells({force: true});
      if (filed === "is_tailoring") {
        gridApi.current?.setRowData(gridDataForTableComponent);
      }
    }

  };

  // 保存编辑后的模板
  const saveTemplate = async () => {

    const gridDatas: any = [];
    // 遍历列表中的数据
    gridApi.current?.forEachNode((node: any) => {
      gridDatas.push(node.data);
    });
    // 需要校验模版名称不能为空
    const tempInfos = formForTemplate.getFieldsValue();
    // 验证数据
    const vertifyMessage = vertifySaveData(gridDatas, tempInfos);
    if (vertifyMessage) {
      message.error({
        content: `错误：${vertifyMessage}`,
        duration: 1,
        style: {marginTop: '50vh'},
      });
      return;
    }

    const tempInfo = {
      id: template.id,
      name: tempInfos.tempName,
      type: tempInfos.tempType,
    };
    const messages = await saveTempList(gridDatas, tempInfo);
    if (messages) {
      message.error({
        content: `错误：${messages}`,
        duration: 1,
        style: {marginTop: '50vh'},
      });
    } else {
      message.info({
        content: `数据保存成功！`,
        duration: 1,
        style: {marginTop: '50vh'},
      });
    }
  };
  // 取消模板编辑
  const cancleTempEdit = () => {
    history.push('/zentao/templateList');
  };

  /* endregion  模板保存 */

  /* region 初始化界面数据 */
  const templeType = useRequest(() => getTemTypeSelect()).data;
  selectOptions.addType = useRequest(() => getAddTypeSelect()).data;
  selectOptions.assignedTo = useRequest(() => getAssignedToSelect()).data;
  selectOptions.priority = useRequest(() => getPrioritySelect()).data;
  selectOptions.taskType = useRequest(() => getTaskTypeSelect()).data;
  selectOptions.side = useRequest(() => getSideSelect()).data;
  selectOptions.taskSource = useRequest(() => getTaskSourceSelect()).data;

  const showInitPages = async () => {
    if (template.id) {
      const dt = await getTemplateDetails(template.id);
      setGridData(dt);
      gridDataForTableComponent = dt;
      formForTemplate.setFieldsValue({
        tempName: template.name,
        tempType: `${template.type}&${template.type_name}`,
      });
    } else {
      //   如果为空，则要设置一行
      setGridData([{add_type_name: "新增"}]);
      gridDataForTableComponent = [{add_type_name: "新增"}];
    }
  };
  useEffect(() => {
    showInitPages();
  }, [1]);
  /* endregion 初始化界面数据 */

  return (
    <div style={{width: '100%', height: '100%', marginTop: '-20px'}}>
      <Header templateInfo={template}/>
      <div className={'content'} style={{marginTop: 5}}>
        <div style={{background: 'white', height: 36, paddingTop: 2}}>
          <Form form={formForTemplate} autoComplete="off" style={{marginLeft: 5}}>
            <Row>
              <Col span={8}>
                <Form.Item label="模板名称:" name="tempName" required={true}>
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="模板类型:"
                  name="tempType"
                  required={true}
                  style={{marginLeft: 5}}
                >
                  <Select showSearch style={{width: '100%'}}>
                    {templeType}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Upload beforeUpload={importTemplate}>
                  <Button
                    type="text"
                    style={{color: '#46A0FC'}}
                    icon={<ImportOutlined/>}
                    size={'middle'}
                  >
                    导入Excel任务
                  </Button>
                </Upload>
              </Col>
              <Col span={4}>
                <Button
                  type="text"
                  icon={<DeleteTwoTone/>}
                  size={'middle'}
                  style={{float: 'right'}}
                  onClick={delTemplateRow}
                >
                  删除
                </Button>
              </Col>
            </Row>
          </Form>
        </div>

        {/* 模板列表 */}
        <div style={{marginTop: 5}}>
          <div className="ag-theme-alpine" style={{height: gridHeight - 20, width: '100%'}}>
            <AgGridReact
              columnDefs={getTempColumns()} // 定义列
              rowData={gridData} // 数据绑定
              defaultColDef={{
                resizable: true, suppressMenu: true, cellStyle: {'line-height': '28px'}
              }}
              rowHeight={28}
              headerHeight={30}
              suppressRowTransform={true}
              rowSelection={'multiple'}
              onGridReady={onGridReady}
              frameworkComponents={{
                addTypeRender: (props: any) => {
                  return (
                    <Select
                      size={'small'} defaultValue={props.value}
                      bordered={false} style={{width: '120%'}}
                      onChange={(currentValue: any) => {
                        gridSelectChanged(props.rowIndex, 'add_type_name', currentValue);
                      }}
                    >
                      {selectOptions.addType}
                    </Select>
                  );
                },
                assignedToRender: (props: any) => {
                  return (
                    <Select
                      size={'small'} defaultValue={props.value}
                      bordered={false} style={{width: '120%'}} showSearch
                      onChange={(currentValue: any) => {
                        gridSelectChanged(props.rowIndex, 'assigned_person_name', currentValue);
                      }}
                    >
                      {selectOptions.assignedTo}
                    </Select>
                  );
                },
                priorityRender: (props: any) => {
                  return (
                    <Select
                      size={'small'} defaultValue={props.value}
                      bordered={false} style={{width: '120%'}}
                      onChange={(currentValue: any) => {
                        gridSelectChanged(props.rowIndex, 'priority', currentValue);
                      }}
                    >
                      {selectOptions.priority}
                    </Select>
                  );
                },
                taskTypeRender: (props: any) => {
                  return (
                    <Select
                      size={'small'} defaultValue={props.value}
                      bordered={false} showSearch style={{width: '120%'}}
                      onChange={(currentValue: any) => {
                        gridSelectChanged(props.rowIndex, 'task_type_name', currentValue);
                      }}
                    >
                      {selectOptions.taskType}
                    </Select>
                  );
                },
                belongsSideRender: (props: any) => {
                  return (
                    <Select
                      size={'small'} defaultValue={props.value}
                      bordered={false} style={{width: '120%'}}
                      onChange={(currentValue: any) => {
                        gridSelectChanged(props.rowIndex, 'belongs_name', currentValue);
                      }}
                    >
                      {selectOptions.side}
                    </Select>
                  );
                },
                taskSourceRender: (props: any) => {
                  return (
                    <Select
                      size={'small'} defaultValue={props.value}
                      bordered={false} style={{width: '120%'}}
                      onChange={(currentValue: any) => {
                        gridSelectChanged(props.rowIndex, 'tasksource_name', currentValue);
                      }}
                      showSearch
                    >
                      {selectOptions.taskSource}
                    </Select>
                  );
                },
                cutRender: (props: any) => {
                  let currentValue = props.value
                  if (!currentValue) {
                    currentValue = "否"
                  }
                  return (
                    <Select
                      size={'small'} defaultValue={currentValue}
                      bordered={false} style={{width: '120%'}}
                      onChange={(selectedValue: any) => {
                        gridSelectChanged(props.rowIndex, 'is_tailoring', selectedValue);
                      }}
                    >
                      <Option key={'yes'} value={'yes'}>{'是'}</Option>
                      <Option key={'no'} value={'no'}>{'否'}</Option>
                    </Select>
                  );
                },
              }}
              onCellEditingStopped={(params: any) => {
                gridSelectChanged(params.rowIndex, params.colDef.field, params.newValue);
              }}
            >
            </AgGridReact>
          </div>
        </div>

        <div style={{marginTop: 10}}>
          <Button
            type="primary"
            style={{
              float: 'right', color: '#46A0FC', backgroundColor: '#ECF5FF', borderRadius: 5, marginLeft: 20,
            }}
            onClick={saveTemplate}
          >
            保存
          </Button>
          <Button style={{float: 'right', borderRadius: 5}} onClick={cancleTempEdit}>
            取消
          </Button>
        </div>

        <Modal
          title={'删除行'}
          visible={isdelModalVisible.showFalg}
          onCancel={delFormCancle}
          centered={true}
          footer={null}
          width={400}
        >
          <Form>
            <Form.Item>
              <label>确定删除选中的数据吗？</label>
            </Form.Item>

            <Form.Item>
              <Button type="primary" style={{marginLeft: '110px'}} onClick={delTempRow}>
                确定
              </Button>
              <Button type="primary" style={{marginLeft: '30px'}} onClick={delFormCancle}>
                取消
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default EditTemplateList;

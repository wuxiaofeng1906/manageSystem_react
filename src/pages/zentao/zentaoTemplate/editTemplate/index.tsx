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
  saveTempList, vertifyTaskName, calParentTask
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
        // 如果导入数据之前只有一条默认的新增数据，则不要那条数据。
        const rowData = node.data;
        const dataLength = Object.keys(rowData).length;
        if (dataLength > 1) {
          oraData.push(node.data);
        }
      });

      setGridData(oraData.concat(newDatas));
    });
  };

  // 新增行
  (window as any).addTemplateRow = async (rowIndex: any, rowData: any) => {

    const gridDatas: any = [];
    // 遍历列表中的数据
    gridApi.current?.forEachNode((node: any) => {
      gridDatas.push(node.data);
    });
    // 获取表格中所有的数据，不能直接用gridData，因为在数据变化时没有更新到set gridData。
    const addData = columnsAdd(rowIndex, rowData, gridDatas);
    // gridApi.current?.updateRowData({add: [addData.row], addIndex: addData.position});

    const testData: any = [...gridDatas];  // 克隆的时候改变地址,数组如果引用地址不变，是不触发重新渲染的，但是值是设置进去了
    testData.splice(addData.position, 0, addData.row);
    setGridData(testData)

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
  const gridSelectChanged = (props: any, value: any) => {
    // 重设某行的值
    const rowNode = gridApi.current?.getRowNode(props.rowIndex);
    rowNode?.setData({
      ...props.data,
      [props.column.colId]: value
    });
  };

  // 表格停止编辑
  const cellEditingStopped = (params: any) => {
    // 如果是任务名称，则需要判断输入格式。
    if (params.column.colId === "task_name") {
      if (params.newValue) {
        const vertifyMessage = vertifyTaskName(params.data?.add_type_name, params.newValue);
        if (vertifyMessage) {
          message.error({
            content: `错误：${vertifyMessage}`,
            duration: 1,
            style: {marginTop: '50vh'},
          });

          // 还原之前的数据
          gridSelectChanged(params, params.oldValue);
          // const rowNode = gridApi.current?.getRowNode(params.rowIndex);
          // rowNode?.setData({
          //   ...params.data,
          //   task_name: params.oldValue
          // });
          return;
        }
      }
    }

    gridSelectChanged(params, params.newValue);

    // 如果是修改的最初预计，则需要判断是不是子任务，当前子任务的父任务的最初预计时长需要计算为子子任务最初预计时间之和。
    if (params.column.colId === "estimate" && params.data?.add_type_name === "子任务") {
      const tabData: any = [];
      gridApi.current?.forEachNode((node: any) => {
        tabData.push(node.data);
      });
      const parentInfo = calParentTask(tabData, params);
      const rowNode = gridApi.current?.getRowNode((parentInfo.parentIndex).toString());
      rowNode?.setData({
        ...tabData[parentInfo.parentIndex],
        "estimate": parentInfo.parentValue
      })
    }
  }

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

      // 如果是新增，保存成功之后需要跳转回主界面。
      if (!template.id) {
        history.push('/zentao/templateList');
      }

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
    let gridDt: any = [{add_type_name: "新增"}];
    if (template.id) {
      formForTemplate.setFieldsValue({
        tempName: template.name,
        tempType: `${template.type}&${template.type_name}`,
      });
      gridDt = await getTemplateDetails(template.id);
    }
    setGridData(gridDt);
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
                        // 如果修改的是增加类型，需要判断任务名称是否符合
                        // const vertifyMessage = vertifyAddType(currentValue, props.data?.task_name);
                        // if (vertifyMessage) {
                        //   message.error({
                        //     content: `错误：${vertifyMessage}`,
                        //     duration: 1,
                        //     style: {marginTop: '50vh'},
                        //   });
                        //
                        //   // 还原之前的数据
                        //   const rowNode = gridApi.current?.getRowNode(props.rowIndex);
                        //   rowNode?.setData(props.data);
                        //   return;
                        // }

                        gridSelectChanged(props, currentValue);
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
                        gridSelectChanged(props, currentValue);
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
                        gridSelectChanged(props, currentValue);
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
                        gridSelectChanged(props, currentValue);
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
                        gridSelectChanged(props, currentValue);
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
                        gridSelectChanged(props, currentValue);
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
                        gridSelectChanged(props, selectedValue);
                      }}
                    >
                      <Option key={'yes'} value={'yes'}>{'是'}</Option>
                      <Option key={'no'} value={'no'}>{'否'}</Option>
                    </Select>
                  );
                },
              }}
              onCellEditingStopped={cellEditingStopped}
            >
            </AgGridReact>
          </div>
        </div>

        {/* 模板保存和取消按钮 */}
        <div style={{marginTop: 10}}>
          <Button
            type="primary"
            style={{
              float: 'right', color: '#46A0FC', backgroundColor: '#ECF5FF', borderRadius: 5, marginLeft: 20,
            }}
            onClick={saveTemplate}>保存</Button>
          <Button style={{float: 'right', borderRadius: 5}} onClick={cancleTempEdit}>取消</Button>
        </div>

        {/* 删除弹窗 */}
        <Modal
          title={'删除确认'}
          visible={isdelModalVisible.showFalg}
          onCancel={delFormCancle}
          centered={true}
          footer={[
            <Button type="primary" style={{marginLeft: '110px'}} onClick={delTempRow}>
              确定
            </Button>,
            <Button type="primary" style={{marginLeft: '30px'}} onClick={delFormCancle}>
              取消
            </Button>
          ]}
          width={400}
        >您确定要删除选中的数据吗？</Modal>
      </div>
    </div>
  );
};

export default EditTemplateList;
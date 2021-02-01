import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';
import moment from 'moment';
import {Button, Input, Form, DatePicker, Select, Modal} from 'antd';
import {FolderAddTwoTone, EditTwoTone, DeleteTwoTone} from '@ant-design/icons';

const {RangePicker} = DatePicker;
const {Option} = Select;

const queryCondition: any = {
  projectName: "",
  projectType: [],
  dateRange: [],
  projectStatus: [],
};


const datasTest = [
  {
    id: 1,
    prjname: "测试1",
    sourceType: "测试1"
  }, {
    id: 2,
    prjname: "测试2",
    sourceType: "测试2"
  }, {
    id: 3,
    prjname: "测试3",
    sourceType: "测试3"
  }, {
    id: 4,
    prjname: "测试4",
    sourceType: "测试4"
  }];
// 定义列名
const colums = () => {
  const component = new Array();
  component.push(
    {
      headerName: '序号',
      field: 'id',
    },
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      maxWidth: 50,
      'pinned': 'left'
    },
    {
      headerName: '项目名称',
      field: 'prjname',
      cellRenderer: (params: any) => {
        return `<a target="_blank" style="color:blue;text-decoration: underline" href='http://172.31.1.219:8384/zentao/project-task-269-unclosed.html'>${params.value}</a>`;
      },

    },
    {
      headerName: '来源类型',
      field: 'sourceType',
    }, {
      headerName: '开始时间',
      field: 'user.realname',
    },
    {
      headerName: '提测截止日期',
      field: 'user.realname',
    }, {
      headerName: '测试完成日期',
      field: 'user.realname',
    }, {
      headerName: '计划灰度日期',
      field: 'user.realname',
    }, {
      headerName: '计划上线日期',
      field: 'user.realname',
    }, {
      headerName: '创建日期',
      field: 'user.realname',
    }, {
      headerName: '创建人',
      field: 'user.realname',
    }, {
      headerName: '项目状态',
      field: 'user.realname',
    }, {
      headerName: '访问禅道',
      field: 'user.realname',
      cellRenderer: (params: any) => {
        return `<a target="_blank" style="color:blue;text-decoration: underline" href='http://172.31.1.219:8384/zentao/project-task-269-unclosed.html'>${params.value}</a>`;
      }
    },
  );

  return component;
};

// 查询数据
const queryDevelopViews = async (client: GqlClient<object>, params: any) => {
  console.log(params.projectName, params.projectType, params.dateRange, params.projectStatus);
  return [];
};

// 组件初始化
const SprintList: React.FC<any> = () => {
  const gridApi = useRef<GridApi>();   // 绑定ag-grid 组件
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() =>
    queryDevelopViews(gqlClient, queryCondition),
  );
  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  if (gridApi.current) {
    if (loading) gridApi.current.showLoadingOverlay();
    else gridApi.current.hideOverlay();
  }

  let prjName = "";
  // 项目名称输入事件
  const inputOnChange = (e: any) => {
    prjName = e.nativeEvent.data;
    queryCondition.projectName = prjName;
    // console.log("项目名",e.nativeEvent.data);
    // console.log("参数项目名：", prjName);
    // 请求数据

    // 绑定数据
    gridApi.current?.setRowData(datasTest);

  };

  let prjType = new Array();
  // 项目类型选择事件
  const prjTypeHandleChange = (value: any, params: any) => {
    console.log(params);
    prjType = value;


    // console.log(`选择的项目类型`, prjName, prjType);
    // 请求数据

    // 绑定数据
    gridApi.current?.setRowData(datasTest);

  };

  let starttime = "";
  let endtime = "";
  // 时间选择事件
  const onTimeSelected = (params: any) => {
    starttime = moment(params[0]).format('YYYY-MM-DD');
    endtime = moment(params[1]).format('YYYY-MM-DD');

    console.log("选择的times", starttime, endtime);
    // 请求数据

  };

  let prjStatus = "";
  // 选择项目状态
  const prjStatusHandleChange = (value: any, params: any) => {

    console.log(params);
    prjStatus = value;
    console.log(`selected ${prjStatus}`);

    console.log(prjName, prjType, starttime, endtime, prjStatus);

    // 请求数据

  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (

    <PageContainer>
      <div style={{width: "100%", overflow: "auto", whiteSpace: "nowrap"}}>

        <Form.Item name="prjName">
          <label style={{marginLeft: "10px"}}>项目名称：</label>
          <Input placeholder="请输入" style={{"width": "18%"}} allowClear={true} onChange={inputOnChange}/>

          <label style={{marginLeft: "10px"}}>项目类型：</label>
          <Select placeholder="请选择" mode="tags" style={{width: '18%'}} onChange={prjTypeHandleChange}
                  tokenSeparators={[',']}> {
            [
              <Option key={"sprint"} value={"sprint"}>sprint </Option>,
              <Option key={"hotfix"} value={"hotfix"}>hotfix </Option>,
              <Option key={"emergency"} value={"emergency"}>emergency </Option>,
            ]
          }
          </Select>

          <label style={{marginLeft: "10px"}}>时间：</label>
          <RangePicker className={"times"} style={{width: '18%'}} onChange={onTimeSelected}/>


          <label style={{marginLeft: "10px"}}>项目状态：</label>
          <Select placeholder="请选择" mode="tags" style={{width: '18%'}} onChange={prjStatusHandleChange}
                  tokenSeparators={[',']}>{
            [
              <Option key={"closed"} value={"closed"}>已关闭 </Option>,
              <Option key={"doing"} value={"doing"}>进行中 </Option>,
              <Option key={"suspended"} value={"suspended"}>已暂停 </Option>,
              <Option key={"wait"} value={"wait"}>未开始 </Option>
            ]
          }
          </Select>
        </Form.Item>
      </div>

      <div style={{"background": "white"}}> {/* 使用一个图标就要导入一个图标 */}
        <Button type="text" style={{"color": "black"}} disabled={true} size={"large"}> 默认：近1月未关闭的 </Button>

        <Button type="text" style={{"color": "black", float: "right"}} icon={<FolderAddTwoTone/>}
                size={"large"}>删除 </Button>

        <Button type="text" style={{"color": "black", float: "right"}} icon={<EditTwoTone/>}
                size={"large"}> 修改 </Button>

        <Button type="text" style={{"color": "black", float: "right"}} icon={<DeleteTwoTone/>}
                size={"large"} onClick={showModal}> 新增 </Button>
      </div>

      <div className="ag-theme-alpine" style={{height: 1000, width: '100%'}}>

        <AgGridReact
          columnDefs={colums()} // 定义列
          rowData={data} // 数据绑定
          defaultColDef={{
            resizable: true,
            sortable: true,
            // floatingFilter: true,
            filter: true,
            flex: 1,
            minWidth: 100,
          }}
          autoGroupColumnDef={{
            minWidth: 100,
          }}
          groupDefaultExpanded={9} // 展开分组
          // suppressDragLeaveHidesColumns // 取消分组时，例如单击删除区域中某一列上的“ x” ，该列将不可见
          // suppressMakeColumnVisibleAfterUnGroup // 如果用户在移动列时不小心将列移出了网格，但并不打算将其隐藏，那么这就很方便。
          // rowGroupPanelShow="always"
          onGridReady={onGridReady}
        >
        </AgGridReact>
      </div>

      <Modal title="新增项目" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}
             centered={true} footer={null} width={700}>
        <Form>
          <Form.Item>
            <label style={{marginLeft: "10px"}}>项目名称：</label>
            <Select placeholder="请选择类型" mode="tags" style={{width: '150px'}} onChange={prjTypeHandleChange}
                    tokenSeparators={[',']}> {
              [
                <Option key={"sprint"} value={"sprint"}>sprint </Option>,
                <Option key={"hotfix"} value={"hotfix"}>hotfix </Option>,
                <Option key={"emergency"} value={"emergency"}>emergency </Option>,
              ]
            }
            </Select>
            <DatePicker/>
          </Form.Item>

          <Form.Item>
            <label style={{marginLeft: "10px", width: "20px"}}>开始时间：</label>
            <DatePicker/>

            <label style={{marginLeft: "160px", width: "20px"}}>提测截止：</label>
            <DatePicker/>
          </Form.Item>

          <Form.Item>
            <label style={{marginLeft: "10px", width: "20px"}}>测试截止：</label>
            <DatePicker/>

            <label style={{marginLeft: "160px", width: "20px"}}>计划灰度：</label>
            <DatePicker/>
          </Form.Item>

          <Form.Item>
            <label style={{marginLeft: "10px", width: "20px"}}>计划上线：</label>
            <DatePicker/>

            <label style={{marginLeft: "160px"}}>项目状态：</label>
            <Select placeholder="请选择" mode="tags" style={{width: "150px"}} onChange={prjStatusHandleChange}
                    tokenSeparators={[',']}>{
              [
                <Option key={"closed"} value={"closed"}>已关闭 </Option>,
                <Option key={"doing"} value={"doing"}>进行中 </Option>,
                <Option key={"suspended"} value={"suspended"}>已暂停 </Option>,
                <Option key={"wait"} value={"wait"}>未开始 </Option>
              ]
            }
            </Select>
          </Form.Item>

          <Form.Item style={{marginTop:"50px"}}>
            <Button type="primary" style={{marginLeft: "250px"}}>确定</Button>
            <Button type="primary" style={{marginLeft: "20px"}}>取消</Button>
          </Form.Item>
        </Form>

      </Modal>



    </PageContainer>
  );
};


export default SprintList;

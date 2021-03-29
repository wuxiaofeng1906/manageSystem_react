import React, {useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';
import moment from 'moment';
import {Button, Col, DatePicker, Form, Row} from 'antd';
import {getCurrentQuarterTime} from '@/publicMethods/timeMethods';
import {moduleChange} from "@/publicMethods/cellRenderer";
import {history} from 'umi';
import {SaveTwoTone} from '@ant-design/icons';

const {RangePicker} = DatePicker;
const quarRange = getCurrentQuarterTime();
let timeRg = `[${quarRange.start},${quarRange.end}]`;


const converseFormatForAgGrid = (oraDatas: any) => {
  const arrays: any[] = [];
  if (oraDatas === null) {
    return arrays;
  }

  for (let index = 0; index < oraDatas.length; index += 1) {
    const usersData = oraDatas[index].users;
    if (usersData !== null) {
      for (let m = 0; m < usersData.length; m += 1) {
        const username = usersData[m].userName;
        if (username !== '李鲲' && username !== '宋永强' && username !== '王润燕' && username !== '陈诺') {

          if (oraDatas[index].parent.deptName === "北京研发中心" || oraDatas[index].parent.deptName === "成都研发中心") {
            arrays.push({
              dept: oraDatas[index].deptName,
              module: moduleChange(usersData[m].tech),
              "username": username,
            });
          } else {
            arrays.push({
              dept: oraDatas[index].parent.deptName,
              group: oraDatas[index].deptName,
              module: moduleChange(usersData[m].tech),
              "username": username,
            });
          }

        }


      }
    }
  }

  return arrays;
};

const converseArrayToOne = (data: any) => {
  const resultData = new Array();
  for (let index = 0; index < data.length; index += 1) {
    let repeatFlag = false;

    for (let m = 0; m < resultData.length; m += 1) {
      if (resultData[m].dept === data[index].dept && resultData[m].group === data[index].group && resultData[m].module === data[index].module) {
        repeatFlag = true;
        break;
      }
    }

    if (repeatFlag === false) {
      const users: object = {
        dept: data[index].dept,
        group: data[index].group,
        module: data[index].module,
      };
      const {dept} = data[index];
      const {group} = data[index];
      const {module} = data[index];
      let num = 0;
      for (let i = 0; i < data.length; i += 1) {
        const dept2 = data[i].dept;
        const group2 = data[i].group;
        const module2 = data[i].module;

        if (dept === dept2 && group === group2 && module === module2) {

          users[`username${num}`] = data[i].username;
          num += 1;
        }
      }
      resultData.push(users);
    }
  }

  return resultData;
};
// 查询数据
const queryDevelopViews = async (client: GqlClient<object>) => {
  const {data} = await client.query(`
      {
          kpiDeptAndUsers{
            dept
            deptName
            parent{
              dept
              deptName
            }
            users{
              id
              userName
              tech
            }
          }
        }
  `);

  const result: any = converseFormatForAgGrid(data?.kpiDeptAndUsers);

  return converseArrayToOne(result);
};


// 组件初始化
const SprintList: React.FC<any> = () => {
  const cellRender = (params: any) => {
    if (params.value === undefined) {
      return "";
    }
    return `<a  style="color:blue;text-decoration: underline" >${params.value}</a>`;
  };

  const cellRenderLink = (params: any) => {
    history.push(`/kpi/reportDetails?range=${timeRg}&name=${params.value}`);
  };

  // 定义列名
  const colums = () => {
    const component = new Array();
    component.push(
      {
        headerName: '部门',
        field: 'dept',
        minWidth: 100,
        rowGroup: true,
        hide: true,
        cellRenderer: cellRender,
        onCellClicked: cellRenderLink

      },
      {
        headerName: '组名',
        field: 'group',
        rowGroup: true,
        hide: true,
      },
      {
        headerName: '所属端',
        field: 'module',
      },
      {
        headerName: '姓名1',
        field: 'username0',
        cellRenderer: cellRender,
        onCellClicked: cellRenderLink
      }, {
        headerName: '姓名2',
        field: 'username1',
        cellRenderer: cellRender,
        onCellClicked: cellRenderLink
      }, {
        headerName: '姓名3',
        field: 'username2',
        cellRenderer: cellRender,
        onCellClicked: cellRenderLink
      }, {
        headerName: '姓名4',
        field: 'username3',
        cellRenderer: cellRender,
        onCellClicked: cellRenderLink
      }, {
        headerName: '姓名5',
        field: 'username4',
        cellRenderer: cellRender,
        onCellClicked: cellRenderLink
      }, {
        headerName: '姓名6',
        field: 'username5',
        cellRenderer: cellRender,
        onCellClicked: cellRenderLink
      }, {
        headerName: '姓名7',
        field: 'username6',
        cellRenderer: cellRender,
        onCellClicked: cellRenderLink
      }, {
        headerName: '姓名8',
        field: 'username7',
        cellRenderer: cellRender,
        onCellClicked: cellRenderLink
      }, {
        headerName: '姓名9',
        field: 'username8',
        cellRenderer: cellRender,
        onCellClicked: cellRenderLink
      }, {
        headerName: '姓名10',
        field: 'username9',
        cellRenderer: cellRender,
        onCellClicked: cellRenderLink
      }, {
        headerName: '姓名11',
        field: 'username10',
        cellRenderer: cellRender,
        onCellClicked: cellRenderLink
      }, {
        headerName: '姓名12',
        field: 'username11',
        cellRenderer: cellRender,
        onCellClicked: cellRenderLink
      }
    );

    return component;
  };

  /* region  表格相关事件 */
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() => queryDevelopViews(gqlClient));

  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  if (gridApi.current) {
    if (loading) gridApi.current.showLoadingOverlay();
    else gridApi.current.hideOverlay();
  }

  /* endregion */


  const [formCondition] = Form.useForm();
  // 时间选择事件
  const onTimeSelected = async (dates: any, dateStrings: any) => {
    timeRg = `[${dateStrings[0]},${dateStrings[1]}]`;

  };

  const showDefalultValue = async () => {
    timeRg = `[${quarRange.start},${quarRange.end}]`;
    formCondition.setFieldsValue({
      timefilter: [moment(quarRange.start), moment(quarRange.end)],

    });

  };


  // 返回渲染的组件
  return (
    <PageContainer>

      <div style={{background: 'white', marginBottom: "20px", height: "55px"}}>

        <Form form={formCondition} style={{paddingTop: "10px", height: "20px"}}>
          <Row gutter={16}>
            <Col className="gutter-row">
              <Button type="text" style={{color: 'black'}} icon={<SaveTwoTone/>} size={'large'}
                      onClick={showDefalultValue}>默认当前季度</Button>
            </Col>

            <Col className="gutter-row" style={{width: '60%'}}>
              <Form.Item name="timefilter" label="筛选周期：" style={{marginTop: "5px", fontSize: "16px", color: 'black'}}>
                <RangePicker
                  defaultValue={[moment(quarRange.start), moment(quarRange.end)]}
                  onChange={onTimeSelected}
                  style={{width: '50%'}}
                />
              </Form.Item>
            </Col>
          </Row>

        </Form>

      </div>

      {/* ag-grid 表格定义 */}
      <div className="ag-theme-alpine" style={{height: 1000, width: '100%'}}>
        <AgGridReact
          columnDefs={colums()} // 定义列
          rowData={data} // 数据绑定
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            flex: 1,
            minWidth: 100,
          }}
          autoGroupColumnDef={{
            minWidth: 100,
          }}
          groupDefaultExpanded={9} // 展开分组
          onGridReady={onGridReady}
          groupHideOpenParents={true}

        >

        </AgGridReact>
      </div>


    </PageContainer>
  );
};
export default SprintList;

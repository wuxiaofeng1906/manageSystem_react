import React, {useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';
import {history} from "../../../../.umi/core/history";
import {Button, Col, DatePicker, Form, Row} from 'antd';
import {SaveTwoTone} from "@ant-design/icons";
import moment from "moment";
import {getCurrentQuarterTime, getRecentMonth} from "@/publicMethods/timeMethods";

const {RangePicker} = DatePicker;
// import axios from 'axios';


// 查询数据
const queryDevelopViews = async (client: GqlClient<object>, params: any) => {


  // const {data} = await client.query(`
  //     {
  //
  //     }
  // `);

  console.log(client, params);
  return [
    {
      name1: "title",
      name2: 2,
      name3: 3,
      name4: 4,
      name5: 5,
      name6: 6,
    },
    {
      name1: "title3",
      name6: 88,
    }
  ];
};


// 组件初始化
const SprintList: React.FC<any> = () => {
  const [formCondition] = Form.useForm();

  // 定义列名
  const colums = () => {
    const component = new Array();
    component.push(
      {
        headerName: '指标名称',
        field: 'name1',
        colSpan: (params: any) => {
          return params.data.name1 === 'title3' ? 5 : 1;
        }

      },
      {
        headerName: '权重',
        field: 'name2',
      },
      {
        headerName: '目标值',
        field: 'name3',
      },
      {
        headerName: '实际值',
        field: 'name4',
      },
      {
        headerName: '目标完成率',
        field: 'name5',
      },
      {
        headerName: '单项指标得分',
        field: 'name6',
      }
    );

    return component;
  };
  const condition: any = {
    users: "",
    starttime: "",
    endtime: ""
  };

  const location = history.location.query;
  if (location !== undefined && location.projectid !== null) {

    condition.users = location.name === null ? '' : location.name.toString();
    if (location.range !== null) {
      const ranges = location.range.toString().replace("[", "").replace("]", "").trim().split(",");
      condition.starttime = ranges[0].toString();
      condition.endtime = ranges[1].toString();
      formCondition.setFieldsValue({
        timefilter: [moment(ranges[0].toString()), moment(ranges[1].toString())],

      });
    }

    console.log(condition);
  }

  /* region  表格相关事件 */
  const gridApi = useRef<GridApi>(); // 绑定ag-grid 组件
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() => queryDevelopViews(gqlClient, condition));

  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();

  };

  if (gridApi.current) {
    if (loading) gridApi.current.showLoadingOverlay();
    else gridApi.current.hideOverlay();
  }

  /* endregion */


  const showDefalultValue = async () => {
    const quarRange = getCurrentQuarterTime();
    const starts = quarRange.start;
    const ends = quarRange.end;
    console.log(starts, ends);
    formCondition.setFieldsValue({
      timefilter: [moment(quarRange.start), moment(quarRange.end)],

    });

    // 查询数据
    const newDatas = await queryDevelopViews(gqlClient, "");
    // 赋值
    gridApi.current?.setRowData(newDatas);
  };

  const onTimeSelected = async (dates: any, dateStrings: any) => {
    const start = dateStrings[0];
    const end = dateStrings[1];
    console.log(start, end);

    // 查询数据
    const newDatas = await queryDevelopViews(gqlClient, "");
    // 赋值
    gridApi.current?.setRowData(newDatas);

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
                  defaultValue={[moment(getRecentMonth().start), moment()]}
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

        >

        </AgGridReact>
      </div>

    </PageContainer>
  );
};
export default SprintList;

import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import './style.css';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import type {GridApi, GridReadyEvent} from 'ag-grid-community';
import type {GqlClient} from '@/hooks';
import {useGqlClient, useQuery} from '@/hooks';
import {Button, DatePicker, Form, Select} from 'antd';
import {LogoutOutlined} from '@ant-design/icons';
import {getHeight} from '@/publicMethods/pageSet';
import moment from "moment";
import {useRequest} from "ahooks";
import dayjs from 'dayjs';


const {RangePicker} = DatePicker;
const {Option} = Select;

// 格式化单元格内容
const cellFormat = (params: any) => {

  if (Number(params.value)) {
    const numbers = params.value.toString();
    if (numbers.indexOf(".") > -1) { // 判断有无小数点
      return Number(params.value).toFixed(2);
    }
    return Number(params.value);
  }
  return 0;
};


// 定义列名
const getSourceColums = () => {
  // 定义基础字段
  const Fields: any = [
    {
      headerName: "",
      children: [
        {
          headerName: '创建日期',
          field: 'createAt',
          minWidth: 110,
          pinned: 'left',
          rowSpan: (params: any) => {

            if (params.data.createAt !== "") {
              return 6;
            }
            return 1;

          },
          cellClassRules: {
            'cell-span': "value !== null"
          },
          cellRenderer: (params: any) => {
            return `<div style="margin-top: 75px">${params.value} </div>`;

          }
        },
        {
          headerName: '新增',
          field: 'newAdd',
          minWidth: 63,
          pinned: 'left',
          rowSpan: (params: any) => {

            if (params.data.createAt !== "") {
              return 6;
            }
            return 1;

          },
          cellClassRules: {
            'cell-span': "value !== null"
          },
          cellRenderer: (params: any) => {
            return `<div style="margin-top: 75px">${params.value} </div>`;

          }
        },
        {
          headerName: '状态',
          field: 'status',
          minWidth: 80,
          pinned: 'left',
          rowSpan: (params: any) => {

            if (params.data.status === '激活') {
              return 4;
            }
            return 1;

          },
          cellClassRules: {
            'cell-span': "value === '激活'"
          },
          cellRenderer: (params: any) => {
            if (params.value === "激活") {
              return `<div style="margin-top: 50px">${params.value} </div>`;

            }
            return `<div>${params.value} </div>`;

          }

        },
        {
          headerName: '级别',
          field: 'pri',
          minWidth: 80,
          pinned: 'left',
        },
        {
          headerName: '初始',
          field: 'orain',
          minWidth: 63,
          pinned: 'left',
        }]
    }
  ];

  for (let index = 7; index > 0; index -= 1) {
    const current = dayjs().subtract(index, 'day');
    Fields.push({
      headerName: current.format("MM月DD日"),
      children: [{
        headerName: `变化`,
        field: `${current.format("MMDD")}变化`,
        minWidth: 63,
      }, {
        headerName: `余量`,
        field: `${current.format("MMDD")}余量`,
        minWidth: 63,
      }]
    });
  }

  return Fields;
};

// 公共查询方法
const queryFrontData = async (client: GqlClient<object>, params: any) => {

  const {data} = await client.query(`{
          dashFront(start:"${params.start}",end:"${params.end}"){

          }

      }
  `);


  return data?.dashFront;
};

const GetSprintProject = () => {
  const projectArray = [];

  const {data: {project = []} = {}} = useQuery(`{
        project(range:{start:"", end:""},,order:DESC){
        id
        name
      }
    }`);

  for (let index = 0; index < project.length; index += 1) {
    projectArray.push(
      <Option key={project[index].id.toString()} value={project[index].id.toString()}> {project[index].name}</Option>,
    );
  }
  return projectArray;
};

const FrontTableList: React.FC<any> = () => {
  const g_currentMonth_range = {
    // start: dayjs().startOf('week').add(1,'day').format("YYYY-MM-DD"),
    // end: dayjs().startOf('week').subtract(5,'day').format("YYYY-MM-DD")
    start: dayjs().subtract(6, 'day').format("YYYY-MM-DD"),
    showEnd: dayjs().format("YYYY-MM-DD"),
    end: dayjs().add(1, 'day').format("YYYY-MM-DD"),
  };

  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() => queryFrontData(gqlClient, g_currentMonth_range),);
  const gridApiForFront = useRef<GridApi>();
  const onSourceGridReady = (params: GridReadyEvent) => {
    gridApiForFront.current = params.api;
    params.api.sizeColumnsToFit();
  };

  if (gridApiForFront.current) {
    if (loading) gridApiForFront.current.showLoadingOverlay();
    else gridApiForFront.current.hideOverlay();
  }

  // 表格的屏幕大小自适应
  const [sourceGridHeight, setGridHeight] = useState(Number(getHeight()));
  window.onresize = function () {
    setGridHeight(Number(getHeight()) - 64);
    gridApiForFront.current?.sizeColumnsToFit();
  };

  const [choicedCondition, setQueryConditionForSource] = useState({
    prjName: [],
    start: g_currentMonth_range.start,
    end: g_currentMonth_range.end,
    showEnd:g_currentMonth_range.showEnd
  });

  //  默认显示
  const showSourceDefaultData = async () => {
    setQueryConditionForSource({
      prjName: [],
      start: g_currentMonth_range.start,
      end: g_currentMonth_range.end,
      showEnd:g_currentMonth_range.showEnd
    });
    const datas: any = await queryFrontData(gqlClient, g_currentMonth_range);
    gridApiForFront.current?.setRowData(datas);
  };

  // 时间选择事件： 查询范围：选中的时间中开始时间的周一，和结束时间的周末
  const onSourceTimeSelected = async (params: any, dateString: any) => {

    setQueryConditionForSource({
      ...choicedCondition,
      start: dateString[0],
      end: dateString[1]
    });

    const range = {
      prjNames: choicedCondition.prjName,
      start: dateString[0],
      end: dateString[1]
    };

    const datas: any = await queryFrontData(gqlClient, range);
    gridApiForFront.current?.setRowData(datas);

  };

  // 项目名称选择事件
  const prjNameChanged = async (value: any, params: any) => {


    const range = {
      prjNames: value,
      start: choicedCondition.start,
      end: choicedCondition.end
    };

    const datas: any = await queryFrontData(gqlClient, range);
    gridApiForFront.current?.setRowData(datas);

  };


  const testData = [
    {
      createAt: "2021-08-31",
      newAdd: 100,
      status: "激活",
      pri: "P0",
      orain: "0"

    },
    {
      createAt: "",
      newAdd: 100,
      status: "",
      pri: "P1",
      orain: "0"

    },
    {
      createAt: "",
      newAdd: 100,
      status: "",
      pri: "P2",
      orain: "0"

    }, {
      createAt: "",
      newAdd: 100,
      status: "",
      pri: ">=P3",
      orain: "0"

    }, {
      createAt: "",
      newAdd: 100,
      status: "已解决",
      pri: ">=P0",
      orain: "0"

    }, {
      createAt: "",
      newAdd: 100,
      status: "已关闭",
      pri: ">=P0",
      orain: "0"
    },
    {
      createAt: "2021-08-30",
      newAdd: 100,
      status: "激活",
      pri: "P0",
      orain: "0"

    },
    {
      createAt: "",
      newAdd: 100,
      status: "",
      pri: "P1",
      orain: "0"

    },
    {
      createAt: "",
      newAdd: 100,
      status: "",
      pri: "P2",
      orain: "0"

    }, {
      createAt: "",
      newAdd: 100,
      status: "",
      pri: ">=P3",
      orain: "0"

    }, {
      createAt: "",
      newAdd: 100,
      status: "已解决",
      pri: ">=P0",
      orain: "0"

    }, {
      createAt: "",
      newAdd: 100,
      status: "已关闭",
      pri: ">=P0",
      orain: "0"
    }, {
      createAt: "2021-08-29",
      newAdd: 100,
      status: "激活",
      pri: "P0",
      orain: "0"

    },
    {
      createAt: "",
      newAdd: 100,
      status: "",
      pri: "P1",
      orain: "0"

    },
    {
      createAt: "",
      newAdd: 100,
      status: "",
      pri: "P2",
      orain: "0"

    }, {
      createAt: "",
      newAdd: 100,
      status: "",
      pri: ">=P3",
      orain: "0"

    }, {
      createAt: "",
      newAdd: 100,
      status: "已解决",
      pri: ">=P0",
      orain: "0"

    }, {
      createAt: "",
      newAdd: 100,
      status: "已关闭",
      pri: ">=P0",
      orain: "0"
    },
    {
      createAt: "2021-08-28",
      newAdd: 100,
      status: "激活",
      pri: "P0",
      orain: "0"

    },
    {
      createAt: "",
      newAdd: 100,
      status: "",
      pri: "P1",
      orain: "0"

    },
    {
      createAt: "",
      newAdd: 100,
      status: "",
      pri: "P2",
      orain: "0"

    }, {
      createAt: "",
      newAdd: 100,
      status: "",
      pri: ">=P3",
      orain: "0"

    }, {
      createAt: "",
      newAdd: 100,
      status: "已解决",
      pri: ">=P0",
      orain: "0"

    }, {
      createAt: "",
      newAdd: 100,
      status: "已关闭",
      pri: ">=P0",
      orain: "0"
    }, {
      createAt: "2021-08-27",
      newAdd: 100,
      status: "激活",
      pri: "P0",
      orain: "0"

    },
    {
      createAt: "",
      newAdd: 100,
      status: "",
      pri: "P1",
      orain: "0"

    },
    {
      createAt: "",
      newAdd: 100,
      status: "",
      pri: "P2",
      orain: "0"

    }, {
      createAt: "",
      newAdd: 100,
      status: "",
      pri: ">=P3",
      orain: "0"

    }, {
      createAt: "",
      newAdd: 100,
      status: "已解决",
      pri: ">=P0",
      orain: "0"

    }, {
      createAt: "",
      newAdd: 100,
      status: "已关闭",
      pri: ">=P0",
      orain: "0"
    }, {
      createAt: "2021-08-26",
      newAdd: 100,
      status: "激活",
      pri: "P0",
      orain: "0"

    },
    {
      createAt: "",
      newAdd: 100,
      status: "",
      pri: "P1",
      orain: "0"

    },
    {
      createAt: "",
      newAdd: 100,
      status: "",
      pri: "P2",
      orain: "0"

    }, {
      createAt: "",
      newAdd: 100,
      status: "",
      pri: ">=P3",
      orain: "0"

    }, {
      createAt: "",
      newAdd: 100,
      status: "已解决",
      pri: ">=P0",
      orain: "0"

    }, {
      createAt: "",
      newAdd: 100,
      status: "已关闭",
      pri: ">=P0",
      orain: "0"
    }, {
      createAt: "2021-08-25",
      newAdd: 100,
      status: "激活",
      pri: "P0",
      orain: "0"

    },
    {
      createAt: "",
      newAdd: 100,
      status: "",
      pri: "P1",
      orain: "0"

    },
    {
      createAt: "",
      newAdd: 100,
      status: "",
      pri: "P2",
      orain: "0"

    }, {
      createAt: "",
      newAdd: 100,
      status: "",
      pri: ">=P3",
      orain: "0"

    }, {
      createAt: "",
      newAdd: 100,
      status: "已解决",
      pri: ">=P0",
      orain: "0"

    }, {
      createAt: "",
      newAdd: 100,
      status: "已关闭",
      pri: ">=P0",
      orain: "0"
    },
  ]
  return (
    <PageContainer>

      <div>
        {/* 查询条件 */}
        <div style={{width: '100%', height: 45, marginTop: 5, backgroundColor: "white"}}>
          <Form.Item>

            <label style={{marginLeft: '10px'}}>项目名称：</label>
            <Select placeholder="请选择" style={{width: '20%'}} mode="multiple" maxTagCount={'responsive'} showSearch
                    optionFilterProp="children"
                    onChange={prjNameChanged}>
              {GetSprintProject()}
            </Select>

            <label style={{marginLeft: "20px", marginTop: 7}}>查询周期：</label>
            <RangePicker
              style={{width: '20%', marginTop: 7}} onChange={onSourceTimeSelected}
              value={[choicedCondition.start === "" ? null : moment(choicedCondition.start),
                choicedCondition.end === "" ? null : moment(choicedCondition.showEnd)]}
            />

            <Button type="text" style={{marginLeft: "20px", color: 'black'}}
                    icon={<LogoutOutlined/>} size={'small'} onClick={showSourceDefaultData}>
              默认：</Button>
            <label style={{marginLeft: "-10px", color: 'black'}}> 默认1周</label>

          </Form.Item>

        </div>

        {/* 数据表格 */}
        <div className="ag-theme-alpine" style={{height: sourceGridHeight, width: '100%', marginTop: 10}}>
          <AgGridReact
            columnDefs={getSourceColums()} // 定义列
            rowData={testData} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              flex: 1,
              cellStyle: {"line-height": "28px", "border-left": "1px solid lightgrey"},
              suppressMenu: true,
            }}
            rowHeight={30}
            headerHeight={35}
            suppressRowTransform={true}
            onGridReady={onSourceGridReady}

          >

          </AgGridReact>
        </div>

      </div>

    </PageContainer>
  );
};

export default FrontTableList;

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
// const cellFormat = (params: any) => {
//
//   if (Number(params.value)) {
//     const numbers = params.value.toString();
//     if (numbers.indexOf(".") > -1) { // 判断有无小数点
//       return Number(params.value).toFixed(2);
//     }
//     return Number(params.value);
//   }
//   return 0;
// };


// 定义列名
const getSourceColums = (starttime: any, endTime: any) => {
  debugger;
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
          headerName: "新增",
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
          field: 'level',
          minWidth: 80,
          pinned: 'left',
        },
        {
          headerName: '初始',
          field: 'initial',
          minWidth: 63,
          pinned: 'left',
        }]
    }
  ];

  const dayDiff = Number(dayjs(endTime).diff(dayjs(starttime), 'day')) + 1;

  for (let index = 0; index < dayDiff; index += 1) {

    const current = dayjs(starttime).add(index, 'day');
    Fields.push({
      headerName: current.format("MM月DD日"),
      children: [{
        headerName: `变化`,
        field: `${current.format("YYYYMMDD")}变化`,
        minWidth: 63,
      }, {
        headerName: `余量`,
        field: `${current.format("YYYYMMDD")}余量`,
        minWidth: 63,
      }]
    });
  }

  return Fields;
};

const alaysisData = (data: any) => {
  let results: any = [];
  if (data !== null) {
    data.forEach((eve_datas: any) => {

      const baseData = [{
        createAt: dayjs(eve_datas.date).format("MM月DD日"),
        newAdd: eve_datas.init.total,
        status: "激活",
        level: "P0",
        initial: eve_datas.init.p0
      }, {
        createAt: "",
        newAdd: "",
        status: "",
        level: "P1",
        initial: eve_datas.init.p1
      }, {
        createAt: "",
        newAdd: "",
        status: "",
        level: "P2",
        initial: eve_datas.init.p2
      }, {
        createAt: "",
        newAdd: "",
        status: "",
        level: ">=P3",
        initial: eve_datas.init.p3
      }, {
        createAt: "",
        newAdd: "",
        status: "已解决",
        level: ">=P0",
        initial: eve_datas.init.resolved
      }, {
        createAt: "",
        newAdd: "",
        status: "已关闭",
        level: ">=P0",
        initial: eve_datas.init.closed
      }];

      const details = eve_datas.data;
      details.forEach((day_datas: any) => {
        const days = day_datas.date;

        // 激活-p0行的数据
        baseData[0][`${days}变化`] = day_datas.data.p0;
        baseData[0][`${days}余量`] = day_datas.data.p0;

        // 激活-p1行的数据
        baseData[1][`${days}变化`] = day_datas.data.p1;
        baseData[1][`${days}余量`] = day_datas.data.p1;

        // 激活-p2行的数据
        baseData[2][`${days}变化`] = day_datas.data.p2;
        baseData[2][`${days}余量`] = day_datas.data.p2;

        // 激活-p3行的数据
        baseData[3][`${days}变化`] = day_datas.data.p3;
        baseData[3][`${days}余量`] = day_datas.data.p3;

        // 已解决  >=P0行的数据
        baseData[4][`${days}变化`] = day_datas.data.resolved;
        baseData[4][`${days}余量`] = day_datas.data.resolved;

        // 已关闭 >=P0 行的数据
        baseData[5][`${days}变化`] = day_datas.data.closed;
        baseData[5][`${days}余量`] = day_datas.data.closed;

      });
      results = results.concat(baseData);
    });
  }


  return results;

};
// 公共查询方法
const queryFrontData = async (client: GqlClient<object>, params: any) => {
  debugger;
  let conditionStr = `start:"${params.start}", end:"${params.end}"`;

  if (params.projects.length > 0) {
    const projectArray: any = [];
    conditionStr = `${conditionStr},projects:${projectArray}`
  }

  const {data} = await client.query(`{
        moEfficiency(${conditionStr}) {
          date
          init{
            p0
            p1
            p2
            p3
            resolved
            closed
            total
          }
          data{
            date
            data{
              p0
              p1
              p2
              p3
              resolved
              closed
            }
          }
        }

      }
  `);


  return alaysisData(data?.moEfficiency);
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
  const {data, loading} = useRequest(() => queryFrontData(gqlClient, {
    projects: [],
    start: g_currentMonth_range.start,
    end: g_currentMonth_range.end
  }));
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
    showEnd: g_currentMonth_range.showEnd
  });

  //  默认显示
  const showSourceDefaultData = async () => {
    setQueryConditionForSource({
      prjName: [],
      start: g_currentMonth_range.start,
      end: g_currentMonth_range.end,
      showEnd: g_currentMonth_range.showEnd
    });

    // 获取动态列名
    const cloumnName = getSourceColums(g_currentMonth_range.start, g_currentMonth_range.end);
    gridApiForFront.current?.setColumnDefs(cloumnName);

    const datas: any = await queryFrontData(gqlClient, {
      projects: [],
      start: g_currentMonth_range.start,
      end: g_currentMonth_range.end
    });

    gridApiForFront.current?.setRowData(datas);
  };

  // 时间选择事件： 查询范围：选中的时间中开始时间的周一，和结束时间的周末
  const onSourceTimeSelected = async (params: any, dateString: any) => {

    setQueryConditionForSource({
      ...choicedCondition,
      start: dateString[0],
      end: dayjs(dateString[1]).add(1, 'day').format("YYYY-MM-DD"),
      showEnd: dateString[1]
    });

    const range = {
      projects: choicedCondition.prjName,
      start: dateString[0],
      end: dayjs(dateString[1]).add(1, 'day').format("YYYY-MM-DD"),
    };

    const cloumnName = getSourceColums(dateString[0], dateString[1]);
    gridApiForFront.current?.setColumnDefs(cloumnName);

    const datas: any = await queryFrontData(gqlClient, range);
    gridApiForFront.current?.setRowData(datas);

  };

  // 项目名称选择事件
  const prjNameChanged = async (value: any, params: any) => {
    console.log(params);

    const range = {
      projects: value,
      start: choicedCondition.start,
      end: choicedCondition.end
    };

    const datas: any = await queryFrontData(gqlClient, range);
    gridApiForFront.current?.setRowData(datas);

  };

  //
  // const testData = [
  //   {
  //     createAt: "2021-08-31",
  //     newAdd: 100,
  //     status: "激活",
  //     pri: "P0",
  //     orain: "0"
  //
  //   },
  //   {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "",
  //     pri: "P1",
  //     orain: "0"
  //
  //   },
  //   {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "",
  //     pri: "P2",
  //     orain: "0"
  //
  //   }, {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "",
  //     pri: ">=P3",
  //     orain: "0"
  //
  //   }, {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "已解决",
  //     pri: ">=P0",
  //     orain: "0"
  //
  //   }, {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "已关闭",
  //     pri: ">=P0",
  //     orain: "0"
  //   },
  //   {
  //     createAt: "2021-08-30",
  //     newAdd: 100,
  //     status: "激活",
  //     pri: "P0",
  //     orain: "0"
  //
  //   },
  //   {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "",
  //     pri: "P1",
  //     orain: "0"
  //
  //   },
  //   {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "",
  //     pri: "P2",
  //     orain: "0"
  //
  //   }, {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "",
  //     pri: ">=P3",
  //     orain: "0"
  //
  //   }, {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "已解决",
  //     pri: ">=P0",
  //     orain: "0"
  //
  //   }, {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "已关闭",
  //     pri: ">=P0",
  //     orain: "0"
  //   }, {
  //     createAt: "2021-08-29",
  //     newAdd: 100,
  //     status: "激活",
  //     pri: "P0",
  //     orain: "0"
  //
  //   },
  //   {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "",
  //     pri: "P1",
  //     orain: "0"
  //
  //   },
  //   {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "",
  //     pri: "P2",
  //     orain: "0"
  //
  //   }, {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "",
  //     pri: ">=P3",
  //     orain: "0"
  //
  //   }, {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "已解决",
  //     pri: ">=P0",
  //     orain: "0"
  //
  //   }, {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "已关闭",
  //     pri: ">=P0",
  //     orain: "0"
  //   },
  //   {
  //     createAt: "2021-08-28",
  //     newAdd: 100,
  //     status: "激活",
  //     pri: "P0",
  //     orain: "0"
  //
  //   },
  //   {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "",
  //     pri: "P1",
  //     orain: "0"
  //
  //   },
  //   {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "",
  //     pri: "P2",
  //     orain: "0"
  //
  //   }, {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "",
  //     pri: ">=P3",
  //     orain: "0"
  //
  //   }, {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "已解决",
  //     pri: ">=P0",
  //     orain: "0"
  //
  //   }, {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "已关闭",
  //     pri: ">=P0",
  //     orain: "0"
  //   }, {
  //     createAt: "2021-08-27",
  //     newAdd: 100,
  //     status: "激活",
  //     pri: "P0",
  //     orain: "0"
  //
  //   },
  //   {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "",
  //     pri: "P1",
  //     orain: "0"
  //
  //   },
  //   {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "",
  //     pri: "P2",
  //     orain: "0"
  //
  //   }, {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "",
  //     pri: ">=P3",
  //     orain: "0"
  //
  //   }, {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "已解决",
  //     pri: ">=P0",
  //     orain: "0"
  //
  //   }, {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "已关闭",
  //     pri: ">=P0",
  //     orain: "0"
  //   }, {
  //     createAt: "2021-08-26",
  //     newAdd: 100,
  //     status: "激活",
  //     pri: "P0",
  //     orain: "0"
  //
  //   },
  //   {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "",
  //     pri: "P1",
  //     orain: "0"
  //
  //   },
  //   {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "",
  //     pri: "P2",
  //     orain: "0"
  //
  //   }, {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "",
  //     pri: ">=P3",
  //     orain: "0"
  //
  //   }, {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "已解决",
  //     pri: ">=P0",
  //     orain: "0"
  //
  //   }, {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "已关闭",
  //     pri: ">=P0",
  //     orain: "0"
  //   }, {
  //     createAt: "2021-08-25",
  //     newAdd: 100,
  //     status: "激活",
  //     pri: "P0",
  //     orain: "0"
  //
  //   },
  //   {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "",
  //     pri: "P1",
  //     orain: "0"
  //
  //   },
  //   {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "",
  //     pri: "P2",
  //     orain: "0"
  //
  //   }, {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "",
  //     pri: ">=P3",
  //     orain: "0"
  //
  //   }, {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "已解决",
  //     pri: ">=P0",
  //     orain: "0"
  //
  //   }, {
  //     createAt: "",
  //     newAdd: 100,
  //     status: "已关闭",
  //     pri: ">=P0",
  //     orain: "0"
  //   },
  // ];

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
            columnDefs={getSourceColums(g_currentMonth_range.start, g_currentMonth_range.showEnd)} // 定义列
            rowData={data} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              flex: 1,
              cellStyle: {"line-height": "28px", "border-left": "1px solid lightgrey"},
              suppressMenu: true,
              headerComponentParams: (params: any) => {

                const columnName = params.column.colId;
                const weekday = dayjs(columnName.substring(0, 8)).day();

                // 如果是周六或者周天的话，title要显示成紫色的
                if (weekday === 0 || weekday === 6) {

                  return {
                    // menuIcon: 'fa-bars',
                    template:
                      '<div class="ag-cell-label-container" role="presentation">' +
                      '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
                      '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
                      '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
                      '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
                      '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
                      '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
                      '      <span style="color: mediumpurple" ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
                      '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
                      '  </div>' +
                      '</div>'
                  };
                }
                return {
                  // menuIcon: 'fa-bars',
                  template:
                    '<div  class="ag-cell-label-container" role="presentation">' +
                    '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
                    '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
                    '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
                    '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
                    '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
                    '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
                    '    <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
                    '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
                    '  </div>' +
                    '</div>'
                };
              }

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

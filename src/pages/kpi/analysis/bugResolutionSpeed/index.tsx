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


const ragCellClassRules = {
  'cell-span-total': (params: any) => {
    return params.data.createAt === '合计' || params.data.createAt === '合计列';
  },

  'cell-span': (params: any) => {
    return params.data.createAt !== '合计';
  }

};
// 定义列名
const getSourceColums = (starttime: any, endTime: any) => {

  // 定义基础字段
  const Fields: any = [
    {
      headerName: "",
      children: [
        {
          headerName: '创建日期',
          field: 'createAt',
          minWidth: 85,
          pinned: 'left',
          rowSpan: (params: any) => {
            if (params.data.createAt === "合计") {
              return 7;
            }

            if (params.data.createAt !== "" && params.data.createAt !== "合计列") {
              return 6;
            }
            return 1;

          },
          cellClassRules: ragCellClassRules,
          cellRenderer: (params: any) => {
            return `<div style="margin-left: -5px;margin-top: 70px ">${params.value} </div>`;
          }
        },
        {
          headerName: "新增",
          field: 'newAdd',
          minWidth: 60,
          pinned: 'left',
          rowSpan: (params: any) => {
            if (params.data.createAt === "合计") {
              return 7;
            }

            if (params.data.createAt !== "" && params.data.createAt !== "合计列") {
              return 6;
            }
            return 1;

          },
          cellClassRules: ragCellClassRules,
          cellRenderer: (params: any) => {
            return `<div style="margin-top: 70px">${params.value} </div>`;
          }
        },
        {
          headerName: '状态',
          field: 'status',
          minWidth: 68,
          pinned: 'left',

          rowSpan: (params: any) => {

            if (params.data.createAt === "合计" && params.data.status === '激活') {
              return 5;
            }

            if (params.data.status === '激活') {
              return 4;
            }
            return 1;

          },
          cellClassRules: ragCellClassRules,
          cellRenderer: (params: any) => {
            if (params.value === "激活") {
              return `<div style="margin-top: 40px">${params.value} </div>`;
            }
            return `<div>${params.value} </div>`;
          }
        },
        {
          headerName: '级别',
          field: 'level',
          minWidth: 75,
          pinned: 'left',
        },
        {
          headerName: '初始',
          field: 'initial',
          minWidth: 70,
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
        minWidth: 65,
      }, {
        headerName: `余量`,
        field: `${current.format("YYYYMMDD")}余量`,
        minWidth: 65,
      }]
    });
  }

  return Fields;
};

// 解析明细数据
const alaysisDetails = (detailInfo: any) => {

  let detailsResult: any = [];
  if (detailInfo !== null) {
    detailInfo.forEach((eve_datas: any) => {

      const baseData = [
        {
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
        const P0 = day_datas.data.p0;
        baseData[0][`${days}变化`] = P0[0].toString();
        baseData[0][`${days}余量`] = P0[1].toString();

        // 激活-p1行的数据
        const P1 = day_datas.data.p1;
        baseData[1][`${days}变化`] = P1[0].toString();
        baseData[1][`${days}余量`] = P1[1].toString();

        // 激活-p2行的数据
        const P2 = day_datas.data.p2;
        baseData[2][`${days}变化`] = P2[0].toString();
        baseData[2][`${days}余量`] = P2[1].toString();

        // 激活-p3行的数据
        const P3 = day_datas.data.p3;
        baseData[3][`${days}变化`] = P3[0].toString();
        baseData[3][`${days}余量`] = P3[1].toString();

        // 已解决  >=P0行的数据
        const {resolved} = day_datas.data;
        baseData[4][`${days}变化`] = resolved[0].toString();
        baseData[4][`${days}余量`] = resolved[1].toString();

        // 已关闭 >=P0 行的数据
        const {closed} = day_datas.data;
        baseData[5][`${days}变化`] = closed[0].toString();
        baseData[5][`${days}余量`] = closed[1].toString();

      });
      detailsResult = detailsResult.concat(baseData);
    });
  }

  return detailsResult;
};

// 解析合计数据
const alaysisTotals = (totalInfo: any) => {
  let totalResult: any = [];
  if (totalInfo !== null) {

    // 统计初始值
    const initTotal = totalInfo.total;
    const baseData = [
      {
        createAt: '合计',
        newAdd: initTotal.total,
        status: "激活",
        level: "合计",
        initial: initTotal.total
      },
      {
        createAt: '合计列',
        newAdd: "",
        status: "",
        level: "P0",
        initial: initTotal.p0
      }, {
        createAt: "合计列",
        newAdd: "",
        status: "",
        level: "P1",
        initial: initTotal.p1
      }, {
        createAt: "合计列",
        newAdd: "",
        status: "",
        level: "P2",
        initial: initTotal.p2
      }, {
        createAt: "合计列",
        newAdd: "",
        status: "",
        level: ">=P3",
        initial: initTotal.p3
      }, {
        createAt: "合计列",
        newAdd: "",
        status: "已解决",
        level: ">=P0",
        initial: initTotal.resolved
      }, {
        createAt: "合计列",
        newAdd: "",
        status: "已关闭",
        level: ">=P0",
        initial: initTotal.closed
      }];

    // 统计明细项
    const detailsTotal = totalInfo.data;
    detailsTotal.forEach((totalDts: any) => {
      const days = totalDts.date;

      // 合计-合计行的数据
      baseData[0][`${days}变化`] = totalDts.total;
      baseData[0][`${days}余量`] = totalDts.surplus;

      // 激活-p0行的数据
      const P0 = totalDts.data.p0;
      baseData[1][`${days}变化`] = P0[0].toString();
      baseData[1][`${days}余量`] = P0[1].toString();

      // 激活-p1行的数据
      const P1 = totalDts.data.p1;
      baseData[2][`${days}变化`] = P1[0].toString();
      baseData[2][`${days}余量`] = P1[1].toString();

      // 激活-p2行的数据
      const P2 = totalDts.data.p2;
      baseData[3][`${days}变化`] = P2[0].toString();
      baseData[3][`${days}余量`] = P2[1].toString();

      // 激活-p3行的数据
      const P3 = totalDts.data.p3;
      baseData[4][`${days}变化`] = P3[0].toString();
      baseData[4][`${days}余量`] = P3[1].toString();

      // 已解决  >=P0行的数据
      const {resolved} = totalDts.data;
      baseData[5][`${days}变化`] = resolved === null ? 0 : resolved[0].toString();
      baseData[5][`${days}余量`] = resolved === null ? 0 : resolved[1].toString();

      // 已关闭 >=P0 行的数据
      const {closed} = totalDts.data;
      baseData[6][`${days}变化`] = closed === null ? 0 : closed[0].toString();
      baseData[6][`${days}余量`] = closed === null ? 0 : closed[1].toString();

    });
    totalResult = totalResult.concat(baseData);

  }

  return totalResult;

};

// 解析数据
const alaysisData = (sorceData: any) => {

  if (sorceData === null) {
    return {details: [], totals: []};
  }

  // 合计信息
  const totalInfo = sorceData.totalize;
  const TotalResult = alaysisTotals(totalInfo);
  // 明细信息
  const detailInfo = sorceData.custom;
  const detailsresult = alaysisDetails(detailInfo);

  // 有明细数据才显示合计，没有的话，连合计也不显示
  if (detailsresult.length > 0) {
    return {details: detailsresult, totals: TotalResult};
  }

  return {details: [], totals: []};

};

// 公共查询方法
const queryFrontData = async (client: GqlClient<object>, params: any) => {

  let conditionStr = `start:"${params.start}", end:"${params.end}"`;

  if (params.projects.length > 0) {

    // 连接project为数组
    let projectArray = "";
    (params.projects).forEach((ele: any) => {
      projectArray = projectArray === "" ? `${ele}` : `${projectArray},${ele}`;
    });

    conditionStr = `${conditionStr},projects:[${projectArray}]`
  }

  const {data} = await client.query(`{
        moEfficiency(${conditionStr}) {
          totalize{
            total{
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
              total
              surplus
            }
          }
          custom{
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

      }
  `);
  return alaysisData(data?.moEfficiency);
};

// 获取下拉框项目
const GetProjects = () => {
  const projectArray = [];

  const {data: {ztProjectList = []} = {}} = useQuery(`{
      ztProjectList{
          pId
          pName
          pOpenedat
          product
        }
    }`);

  for (let index = 0; index < ztProjectList.length; index += 1) {
    projectArray.push(
      <Option key={ztProjectList[index].pId.toString()}
              value={ztProjectList[index].pId.toString()}> {ztProjectList[index].pName}</Option>,
    );
  }
  return projectArray;
};

const FrontTableList: React.FC<any> = () => {
  const g_currentMonth_range = {
    // start: dayjs().startOf('week').add(1,'day').format("YYYY-MM-DD"),
    // end: dayjs().startOf('week').subtract(5,'day').format("YYYY-MM-DD")
    start: dayjs().subtract(6, 'day').format("YYYY-MM-DD"),
    end: dayjs().format("YYYY-MM-DD"),
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
  const [sourceGridHeight, setGridHeight] = useState(Number(getHeight()) + 10);
  window.onresize = function () {
    setGridHeight(Number(getHeight()) + 10);
    gridApiForFront.current?.sizeColumnsToFit();
  };

  const [choicedCondition, setQueryConditionForSource] = useState({
    projects: [],
    start: g_currentMonth_range.start,
    end: g_currentMonth_range.end,
  });

  //  点击默认显示按钮触发事件
  const showSourceDefaultData = async () => {
    setQueryConditionForSource({
      projects: [],
      start: g_currentMonth_range.start,
      end: g_currentMonth_range.end,

    });

    // 获取动态列名
    const cloumnName = getSourceColums(g_currentMonth_range.start, g_currentMonth_range.end);
    // 重新设置列名前清空列，并且设置列名后调用sizeColumnsToFit适应表格
    gridApiForFront.current?.setColumnDefs([]);
    gridApiForFront.current?.setColumnDefs(cloumnName);
    gridApiForFront.current?.sizeColumnsToFit();

    const datas: any = await queryFrontData(gqlClient, {
      projects: [],
      start: g_currentMonth_range.start,
      end: g_currentMonth_range.end
    });

    gridApiForFront.current?.setRowData([]);
    gridApiForFront.current?.setPinnedTopRowData([])
    gridApiForFront.current?.setRowData(datas.details);
    gridApiForFront.current?.setPinnedTopRowData(datas.totals)
  };

  // 时间选择事件： 查询范围：选中的时间中开始时间的周一，和结束时间的周末
  const onSourceTimeSelected = async (params: any, dateString: any) => {

    setQueryConditionForSource({
      ...choicedCondition,
      start: dateString[0],
      end: dateString[1],

    });

    const range = {
      projects: choicedCondition.projects,
      start: dateString[0],
      end: dateString[1],
    };

    const cloumnName = getSourceColums(dateString[0], dateString[1]);

    // 重新设置列名前清空列，并且设置列名后调用sizeColumnsToFit适应表格
    gridApiForFront.current?.setColumnDefs([]);
    gridApiForFront.current?.setColumnDefs(cloumnName);
    gridApiForFront.current?.sizeColumnsToFit();

    const datas: any = await queryFrontData(gqlClient, range);
    gridApiForFront.current?.setRowData([]);
    gridApiForFront.current?.setPinnedTopRowData([])  // 重新赋值之前最好也进行清空
    gridApiForFront.current?.setRowData(datas.details);
    gridApiForFront.current?.setPinnedTopRowData(datas.totals)


  };

  // 项目名称选择事件
  const prjNameChanged = async (value: any, params: any) => {
    console.log(params);

    const range = {
      projects: value,
      start: choicedCondition.start,
      end: choicedCondition.end
    };


    setQueryConditionForSource({
      ...choicedCondition,
      projects: value
    });
    const datas: any = await queryFrontData(gqlClient, range);
    gridApiForFront.current?.setRowData([]);
    gridApiForFront.current?.setPinnedTopRowData([])  // 重新赋值之前最好也进行清空
    gridApiForFront.current?.setRowData(datas.details);
    gridApiForFront.current?.setPinnedTopRowData(datas.totals)


  };


  const changRowColor = (param: any) => {

    if (param.data.createAt === "合计" || param.data.createAt === "合计列") {
      return {
        'background-color': '#F8F8F8'
      }
    }
    return {
      'background-color': 'white'
    }

  };
  return (
    <PageContainer style={{marginTop: -30}}>

      <div style={{marginTop: -20}}>
        {/* 查询条件 */}
        <div style={{width: '100%', height: 45, marginTop: 5, backgroundColor: "white"}}>
          <Form.Item>

            <label style={{marginLeft: '10px'}}>项目名称：</label>
            <Select placeholder="请选择" style={{width: '20%'}} mode="multiple" maxTagCount={'responsive'} showSearch
                    optionFilterProp="children" value={choicedCondition.projects}
                    onChange={prjNameChanged}>
              {GetProjects()}
            </Select>

            <label style={{marginLeft: "20px", marginTop: 7}}>查询周期：</label>
            <RangePicker
              style={{width: '20%', marginTop: 7}} onChange={onSourceTimeSelected} allowClear={false}
              value={[choicedCondition.start === "" ? null : moment(choicedCondition.start),
                choicedCondition.end === "" ? null : moment(choicedCondition.end)]}
            />

            <Button type="text" style={{marginLeft: "20px", color: 'black'}}
                    icon={<LogoutOutlined/>} size={'small'} onClick={showSourceDefaultData}>
              默认：</Button>
            <label style={{marginLeft: "-10px", color: 'black'}}> 最近7天</label>

          </Form.Item>

        </div>

        {/* 数据表格 */}
        <div className="ag-theme-alpine" style={{height: sourceGridHeight, width: '100%', marginTop: 5}}>
          <AgGridReact
            columnDefs={getSourceColums(g_currentMonth_range.start, g_currentMonth_range.end)} // 定义列
            rowData={data?.details} // 数据绑定
            pinnedTopRowData={data?.totals}
            defaultColDef={{
              resizable: true,
              sortable: false,
              filter: true,
              flex: 1,
              cellStyle: {
                "line-height": "25px",
                "border-left": "1px solid lightgrey",
                "text-align": "center"
              },
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
                      '      <span style="color: gray" ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
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
            rowHeight={25}
            headerHeight={30}
            suppressRowTransform={true}
            onGridReady={onSourceGridReady}
            getRowStyle={changRowColor}
          >

          </AgGridReact>
        </div>

      </div>

    </PageContainer>
  );
};

export default FrontTableList;

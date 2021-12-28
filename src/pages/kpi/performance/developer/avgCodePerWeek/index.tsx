import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';
import {
  getWeeksRange, getMonthWeek, getTwelveMonthTime, getFourQuarterTime,
  getYearsTime, getParamsByType
} from '@/publicMethods/timeMethods';
import {customRound, getHeight} from '@/publicMethods/pageSet';
import {Button, Drawer} from "antd";
import {
  ScheduleTwoTone,
  CalendarTwoTone,
  ProfileTwoTone,
  QuestionCircleTwoTone,
  AppstoreTwoTone
} from "@ant-design/icons";


// 获取近四周的时间范围
const weekRanges = getWeeksRange(8);
const monthRanges = getTwelveMonthTime();
const quarterTime = getFourQuarterTime();

/* region 动态定义列 */
const dataRender = (params: any) => {

  let result = "0";
  if (params.value) {
    result = customRound(params.value, 2);
  }

  const node = params.data;
  if (node.isDept === true) {
    return `<span style="font-weight: bold"> ${result}</span>`;
  }

  return `<span> ${result}</span>`

}

const columsForWeeks = () => {
  const component = new Array();
  for (let index = weekRanges.length - 1; index >= 0; index -= 1) {
    const starttime = weekRanges[index].from;
    const weekName = getMonthWeek(starttime);
    component.push({
      headerName: weekName,
      field: starttime.toString(),
      cellRenderer: dataRender,
      minWidth: 100
    });

  }
  return component;
};

const columsForMonths = () => {
  const component = new Array();
  for (let index = 0; index < monthRanges.length; index += 1) {
    component.push({
      headerName: monthRanges[index].title,
      field: monthRanges[index].start,
      cellRenderer: dataRender,
      minWidth: 110
    });

  }
  return component;
};

const columsForQuarters = () => {
  const component = new Array();
  for (let index = 0; index < quarterTime.length; index += 1) {
    component.push({
      headerName: quarterTime[index].title,
      field: quarterTime[index].start,
      cellRenderer: dataRender
    });

  }
  return component;
};

const columsForYears = () => {
  const yearsTime = getYearsTime();
  const component = new Array();
  for (let index = 0; index < yearsTime.length; index += 1) {
    component.push({
      headerName: yearsTime[index].title,
      field: yearsTime[index].start,
      cellRenderer: dataRender
    });

  }
  return component;
};

/* endregion */

/* region 数据处理 */

const converseArrayToOne = (data: any) => {

  const resultData = new Array();
  for (let index = 0; index < data.length; index += 1) {
    let repeatFlag = false;
    // 判断原有数组是否包含有名字
    for (let m = 0; m < resultData.length; m += 1) {
      if (JSON.stringify(resultData[m].Group) === JSON.stringify(data[index].Group)) {
        repeatFlag = true;
        break;
      }
    }

    if (repeatFlag === false) {
      const tempData = {};
      for (let index2 = 0; index2 < data.length; index2 += 1) {
        tempData["Group"] = data[index].Group;

        if (JSON.stringify(data[index].Group) === JSON.stringify(data[index2].Group)) {
          const key = Object.keys(data[index2]);  // 获取所有的Key值
          key.forEach(function (item) {
            tempData[item] = data[index2][item];
          });
        }
      }
      resultData.push(tempData);
    }
  }

  return resultData;
};

const findParent = (departDatas: any, depts: any, result: any) => {
  const idx = depts.deptName;
  departDatas.forEach((item: any) => {
    if (idx === item['deptName']) {
      const pidName = item['parent'].deptName;
      result.unshift(pidName);
      findParent(departDatas, item['parent'], result);
    }
  });

}
// 转化为ag-grid能被显示的格式
const converseFormatForAgGrid = (oraDatas: any) => {

  if (!oraDatas) {
    return [];
  }

  const resultArray: any = [];

  oraDatas.forEach((elements: any) => {

    const starttime = elements.range.start;

    // 新增研发中心数据
    resultArray.push({
      Group: ['研发中心'],
      [starttime]: elements.total.kpi,
      isDept: true
    }, {
      Group: ['研发中心', '前端'],
      [starttime]: elements.side.front,
      isDept: true
    }, {
      Group: ['研发中心', '后端'],
      [starttime]: elements.side.backend,
      isDept: true
    });

    const departDatas = elements.datas;

    // 部门数据
    departDatas.forEach((depts: any) => {

      /* region 部门数据 */

      const groups: any = [depts.deptName];
      findParent(departDatas, depts, groups);

      // 新增部门
      resultArray.push({
        Group: groups,
        [starttime]: depts.kpi,
        isDept: true
      });


      // 需要判断部门有没有前后端：

      // 没有前端：应用架构部==>如果不是应用架构部，就添加前端数据
      if (depts.deptName !== "应用架构部") {
        // 新增部门的前端
        const frontGroup: any = JSON.parse(JSON.stringify(groups)); // 如果对原数组groups进行直接赋值，再对frontGroup进行修改，groups也会被修改（数组所指向的是内存地址，直接赋值会使它们指向同一地址）
        frontGroup.push("前端")
        resultArray.push({
          Group: frontGroup,
          [starttime]: depts.side.front,
          isDept: true
        });
      }

      // 没有后端：前端应用平台，基础技术=》如果不是前端应用平台和基础技术就添加后端数据
      if (depts.deptName !== "前端应用平台" && depts.deptName !== "基础技术") {
        // 新增部门的后端
        const backendGroup: any = JSON.parse(JSON.stringify(groups));
        backendGroup.push("后端")
        resultArray.push({
          Group: backendGroup,
          [starttime]: depts.side.backend,
          isDept: true
        });
      }
      /* endregion 部门数据 */

      /* region 人员数据 */

      const usersArray = depts.users;
      if (usersArray) {
        usersArray.forEach((user: any) => {

          const usersGroup = JSON.parse(JSON.stringify(groups));
          if (user.tech === "1") {
            usersGroup.push("前端");
          } else if (user.tech === "2") {
            usersGroup.push("后端");
          }
          usersGroup.push(user.userName);
          resultArray.push({
            Group: usersGroup,
            [starttime]: user.kpi,
            isDept: false
          });
        });
      }

      /* endregion 人员数据 */
    });

  });


  return resultArray;
};

const queryCodesCount = async (client: GqlClient<object>, params: string) => {

  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }

  // avgCodeDept(kind:"${condition.typeFlag}",ends:  ["2021-12-31"]) {
  // avgCodeDept(kind:"${condition.typeFlag}",ends:${condition.ends}) {
  const {data} = await client.query(`
      {

       avgCodeDept(kind:"${condition.typeFlag}",ends:${condition.ends}) {
          total {
            dept
            deptName
            kpi
          }
          range {
            start
            end
          }
          side{
            both
            front
            backend
          }
          datas {
            dept
            deptName
            kpi
            parent {
              dept
              deptName
            }
            side{
              both
              front
              backend
            }
            users {
              userId
              userName
              kpi
              tech
            }
          }
        }
      }
  `);

  const datas = converseFormatForAgGrid(data?.avgCodeDept);
  return converseArrayToOne(datas);
};

/* endregion */

const WeekCodeTableList: React.FC<any> = () => {

  /* region ag-grid */
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() =>
    queryCodesCount(gqlClient, 'quarter'),
  );
  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  if (gridApi.current) {
    if (loading) gridApi.current.showLoadingOverlay();
    else gridApi.current.hideOverlay();
  }

  // 表格的屏幕大小自适应
  const [gridHeight, setGridHeight] = useState(getHeight());
  window.onresize = function () {
    // console.log("新高度：", getHeight());
    setGridHeight(getHeight());
    gridApi.current?.sizeColumnsToFit();
  };

  /* endregion */

  // 按周统计
  const statisticsByWeeks = async () => {
    /* 八周 */
    gridApi.current?.setColumnDefs([]);
    const weekColums = columsForWeeks();
    gridApi.current?.setColumnDefs(weekColums);
    const datas: any = await queryCodesCount(gqlClient, 'week');
    gridApi.current?.setRowData(datas);

  };

  // 按月统计
  const statisticsByMonths = async () => {
    /* 12月 */
    gridApi.current?.setColumnDefs([]);
    const monthColums = columsForMonths();
    gridApi.current?.setColumnDefs(monthColums);
    const datas: any = await queryCodesCount(gqlClient, 'month');
    gridApi.current?.setRowData(datas);

  };

  // 按季度统计
  const statisticsByQuarters = async () => {
    /* 4季 */
    gridApi.current?.setColumnDefs([]);
    const quartersColums = columsForQuarters();
    gridApi.current?.setColumnDefs(quartersColums);
    const datas: any = await queryCodesCount(gqlClient, 'quarter');
    gridApi.current?.setRowData(datas);
  };

  // 按年统计
  const statisticsByYear = async () => {
    gridApi.current?.setColumnDefs([]);
    const yearColums = columsForYears();
    gridApi.current?.setColumnDefs(yearColums);
    const datas: any = await queryCodesCount(gqlClient, 'year');
    gridApi.current?.setRowData(datas);
  };

  /* region 提示规则显示 */
  const [messageVisible, setVisible] = useState(false);
  const showRules = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const cssIndent = {textIndent: '2em'};
  /* endregion */


  return (
    <PageContainer>

      <div style={{background: 'white'}}>
        <Button type="text" style={{color: 'black'}} icon={<ProfileTwoTone/>} size={'large'}
                onClick={statisticsByWeeks}>按周统计</Button>
        <Button type="text" style={{color: 'black'}} icon={<CalendarTwoTone/>} size={'large'}
                onClick={statisticsByMonths}>按月统计</Button>
        <Button type="text" style={{color: 'black'}} icon={<ScheduleTwoTone/>} size={'large'}
                onClick={statisticsByQuarters}>按季统计</Button>

        <Button type="text" style={{color: 'black'}} icon={<AppstoreTwoTone/>} size={'large'}
                onClick={statisticsByYear}>按年统计</Button>

        <Button type="text" style={{color: '#1890FF', float: 'right'}} icon={<QuestionCircleTwoTone/>}
                size={'large'} onClick={showRules}>计算规则</Button>
      </div>

      <div className="ag-theme-alpine" style={{height: gridHeight, width: '100%'}}>
        <AgGridReact
          columnDefs={columsForQuarters()} // 定义列
          rowData={data} // 数据绑定
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            flex: 1,
            suppressMenu: true
          }}
          autoGroupColumnDef={{
            minWidth: 280,
            headerName: '部门-人员',
            cellRendererParams: {suppressCount: true},
            pinned: 'left',
            suppressMenu: false
          }}

          rowHeight={32}
          headerHeight={35}
          onGridReady={onGridReady}
          treeData={true}
          animateRows={true}
          groupDefaultExpanded={-1}
          getDataPath={(source: any) => {
            return source.Group;
          }}
        >
        </AgGridReact>
      </div>


      <div>
        <Drawer title={<label style={{"fontWeight": 'bold', fontSize: 20}}>计算规则</label>}
                placement="right" width={"300px"} closable={false} onClose={onClose} visible={messageVisible}>
          <p><strong>1.统计周期</strong></p>
          <p style={cssIndent}>按周统计：代码提交日期为周一00:00:00--周日23:59:59的代码量；</p>
          <p style={cssIndent}>按月统计：代码提交日期为每月1号00:00:00--每月最后1天23:59:59；</p>
          <p style={cssIndent}>按季统计：代码提交日期每季第一个月1号00:00:00--每季第三个月最后1天23:59:59；</p>
          <p style={cssIndent}>特殊情况：当月或季度的开始日期或结束日期在周中（不为整数周）时，不计算该周周数和对应该周的代码量；</p>

          <p style={{color: "#1890FF"}}><strong>2.计算公式说明</strong></p>
          <p> 2.1 按人统计： </p>
          <p style={cssIndent}>周报：周一至周天代码量求和；</p>
          <p style={cssIndent}>月报：当月整周数对应的代码量之和/当月整周数；</p>
          <p style={cssIndent}>季报：当季整周数对应的代码量之和/当季整周数；</p>
          <p> 2.2 按端统计： </p>
          <p style={cssIndent}>周报：该端周一至周天代码量求和/该端人数；</p>
          <p style={cssIndent}>月报：该端所有人员当月整周数对应的代码量之和/当月整周数/该端所有人数；</p>
          <p style={cssIndent}>季报：该端所有人员当季整周数对应的代码量之和/当季整周数/该端所有人数；</p>
          <p> 2.3 按组统计： </p>
          <p style={cssIndent}>周报：该组周一至周天代码量求和/该组人数；</p>
          <p style={cssIndent}>月报：该组所有人员当月整周数对应的代码量之和/当月整周数/该组所有人数；</p>
          <p style={cssIndent}>季报：该组所有人员当季整周数对应的代码量之和/当季整周数/该组所有人数；</p>
          <p> 2.4 按部门统计： </p>
          <p style={cssIndent}>周报：该部门周一至周天代码量求和/该部门所有人数；</p>
          <p style={cssIndent}>月报：该部门所有人员当月整周数对应的代码量之和/当月整周数/该部门所有人数；</p>
          <p style={cssIndent}>季报：该部门所有人员当季整周数对应的代码量之和/当季整周数/该部门所有人数；</p>
          <p> 2.4 按研发中心统计： </p>
          <p style={cssIndent}>周报：该中心所有人员周一至周天代码量求和/该中心所有人数；</p>
          <p style={cssIndent}>月报：该中心所有人员当月整周数对应的代码量之和/当月整周数/该中心所有人数；</p>
          <p style={cssIndent}>季报：该中心所有人员当季整周数对应的代码量之和/当季整周数/该中心所有人数；</p>

        </Drawer>
      </div>

    </PageContainer>
  );
};

export default WeekCodeTableList;

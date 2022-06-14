import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';
import {getParamsByType} from '@/publicMethods/timeMethods';
import {Button, Drawer, Table} from "antd";
import {
  ScheduleTwoTone, CalendarTwoTone, ProfileTwoTone,
  QuestionCircleTwoTone, AppstoreTwoTone
} from "@ant-design/icons";
import {getHeight} from "@/publicMethods/pageSet";
import {converseDataForAgGrid_code} from "../testMethod/deptDataAnalyze";
import {columsForWeeks, columsForMonths, columsForQuarters, columsForYears} from "./gridConfigure/columns";
import {ruleColumns, ruleDatas} from "../testCommonRules/onlineBugRateRule";

/* region 数据获取和解析 */

const queryOnlineBugRate = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }

  const {data} = await client.query(`
      {
        newBugThousTestDept(kind: "${condition.typeFlag}", ends: ${condition.ends}, thous: TEST) {
            total {
              dept
              deptName
              kpi
            }
            code
            range {
              start
              end
            }
            datas {
              dept
              deptName
              codes
              kpi
              parent {
                dept
                deptName
              }
              users {
                userId
                userName
                kpi
              }
            }
          }

      }
  `);
  const datas = converseDataForAgGrid_code(data?.newBugThousTestDept);
  return datas;
};

/* endregion */

const TestBugRateTableList: React.FC<any> = () => {

  /* region ag-grid */
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() =>
    queryOnlineBugRate(gqlClient, 'quarter'),
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

  /* region 按钮事件 */
  // 按周统计
  const statisticsByWeeks = async () => {
    /* 八周 */
    gridApi.current?.setColumnDefs([]);
    const weekColums = columsForWeeks();
    gridApi.current?.setColumnDefs(weekColums);
    const datas: any = await queryOnlineBugRate(gqlClient, 'week');
    gridApi.current?.setRowData(datas);

  };

  // 按月统计
  const statisticsByMonths = async () => {
    /* 12月 */
    gridApi.current?.setColumnDefs([]);
    const monthColums = columsForMonths();
    gridApi.current?.setColumnDefs(monthColums);
    const datas: any = await queryOnlineBugRate(gqlClient, 'month');
    gridApi.current?.setRowData(datas);

  };

  // 按季度统计
  const statisticsByQuarters = async () => {
    /* 4季 */
    gridApi.current?.setColumnDefs([]);
    const quartersColums = columsForQuarters();
    gridApi.current?.setColumnDefs(quartersColums);
    const datas: any = await queryOnlineBugRate(gqlClient, 'quarter');
    gridApi.current?.setRowData(datas);
  };
  // 按年统计
  const statisticsByYear = async () => {
    gridApi.current?.setColumnDefs([]);
    const yearColums = columsForYears();
    gridApi.current?.setColumnDefs(yearColums);
    const datas: any = await queryOnlineBugRate(gqlClient, 'year');
    gridApi.current?.setRowData(datas);
  };

  /* endregion */

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
            minWidth: 240,
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

          onDisplayedColumnsChanged={onGridReady}
        >
        </AgGridReact>
      </div>

      <div>
        <Drawer title={<label style={{"fontWeight": 'bold', fontSize: 20}}>计算规则</label>}
                placement="right" width={300} closable={false} onClose={onClose} visible={messageVisible}>

          <p><strong>一.测试类线上有效bug</strong></p>
          <p>1.统计周期说明</p>

          <p>1.1 bug周期</p>
          <p style={cssIndent}>按周统计：bug创建日期为周一00:00:00--周日23:59:59；</p>
          <p style={cssIndent}>按月统计：bug创建日期为每月1号00:00:00--每月最后1天23:59:59；</p>
          <p style={cssIndent}>按季统计：bug创建日期每季第一个月1号00:00:00--每季第三个月最后1天23:59:59；</p>
          <p>1.2 代码量周期（修正后的代码量）</p>
          <p style={cssIndent}>按周统计：代码commit日期为周一00:00:00--周日23:59:59；</p>
          <p style={cssIndent}>按月统计：代码commit日期为每月的第一个整周的周一00:00:00--每月最后1个整周的周天23:59:59；</p>
          <p style={cssIndent}>按季统计：代码commit日期每季第一个月的第一个整周的周一00:00:00--每季第三个月的最后1个整周的周天23:59:59；</p>

          <p><strong>2.bug统计范围</strong></p>
          <p style={cssIndent}>2.1 产品为“1.0/1.0正式版--产品经理”“产品实施--实施顾问反馈”“前端平台”“经营会计”“后端平台”“供应链研发”； </p>
          <p style={cssIndent}>2.2 创建者为“顾问”“产品”“客服”； </p>
          <p style={cssIndent}>2.3 线上bug统计（按下面条件统计的bug结果要去重）：
            统计zt_bug.os in ('','onlinecodeerror','Online','online_compatibility') ；
            或者统计zt_bug.onlinebugtype in
            ('onlinecodeerror','online_wait','online_interface','online_tips','online_outofscope','online_compatibility'，'online_outofscope','online_pullin','online_tips')
            或者统计zt_bug.title 包含'线上存在'or'集群1'or'集群2'or'集群3'or'集群4'or'集群5'or'集群6'or'集群7'
          </p>

          <p style={cssIndent}>(特殊判定条件：
            当bug创建人的dept为3且os值为空时，仅查询所属执行名称包含hotfix或sprint或emergency或stage-emergency或线上需求池的bug；当openedBy='fuyang.li'时，需增加条件bug创建时间&gt;=2020-04-01
          </p>
          <p style={cssIndent}>2.4 解决方案为“空”“已解决”“延期处理”“后续版本”“转为需求”“代码未合并”的； </p>
          <p style={cssIndent}>2.5 统计测试人员查zt_user.address = '测试', 首先在zt_bug表中判断当前的assignedTo的值是不是测试，
            若是测试则该bug的用户名称则是该测试，若不是测试则在zt_action表中按降序挨个查id 在zt_history表中的old字段按时间倒序去查测试人员，
            查到的第一个测试人员则该bug的用户名称则是该测试,若old中仍查不到测试人员，则倒序查zt_action.actor的值，查到的第一个测试人员则将
            该bug的用户名称记录为该测试，若还查不到测试人员则名称记录为空。 </p>

          <p><strong>二.代码统计</strong></p>
          <Table columns={ruleColumns} dataSource={ruleDatas} size={"small"} pagination={false} bordered/>

          <p style={{color: "#1890FF"}}><strong>三.计算公式说明</strong></p>
          <p><strong>1.按人统计（以下人员都特指测试人员）</strong></p>
          <p style={cssIndent}>周报：周一至周天测试类线上有效bug求和/(当周周一至周天研发中心所有开发人员代码量之和/1000)；</p>
          <p style={cssIndent}>月报：按月统计bug求和/(按月统计研发中心所有开发人员代码量之和/1000)；</p>
          <p style={cssIndent}>季报：按季统计bug求和/(按季统计研发中心所有开发人员代码量之和/1000)；</p>

          <p><strong>2.按组统计</strong></p>
          <p style={cssIndent}>周报：该组所有人员周一至周天测试类线上有效bug求和/(当周周一至周天研发中心所有开发人员代码量之和/1000)；</p>
          <p style={cssIndent}>月报：该组所有人员按月统计bug求和/(按月统计研发中心所有开发人员代码量之和/1000)；</p>
          <p style={cssIndent}>季报：该组所有人员按季统计bug求和/(按季统计研发中心所有开发人员代码量之和/1000)；</p>

          <p><strong>3.按部门统计</strong></p>
          <p style={cssIndent}>周报：该部门所有人员周一至周天测试类线上有效bug求和/(当周周一至周天研发中心所有开发人员代码量之和/1000)；</p>
          <p style={cssIndent}>月报：该部门所有人员按月统计bug求和/(按月统计研发中心所有开发人员代码量之和/1000)；</p>
          <p style={cssIndent}>季报：该部门所有人员按季统计bug求和/(按季统计研发中心所有开发人员代码量之和/1000)；</p>

          <p><strong>4.按中心统计 （等于测试部门的周报、月报、季报值）</strong></p>
          <p style={cssIndent}>周报：该中心所有测试人员周一至周天测试类线上有效bug求和/(当周周一至周天研发中心所有开发人员代码量之和/1000)；</p>
          <p style={cssIndent}>月报：该中心所有测试人员按月统计bug求和/(按月统计研发中心所有开发人员代码量之和/1000)；</p>
          <p style={cssIndent}>季报：该中心所有测试人员按季统计bug求和/(按季统计研发中心所有开发人员代码量之和/1000)；</p>

        </Drawer>
      </div>
    </PageContainer>
  );
};

export default TestBugRateTableList;

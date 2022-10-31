import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { useRequest } from 'ahooks';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { useGqlClient } from '@/hooks';
import { Button, Drawer } from 'antd';
import {
  ScheduleTwoTone,
  CalendarTwoTone,
  ProfileTwoTone,
  QuestionCircleTwoTone,
  AppstoreTwoTone,
} from '@ant-design/icons';
import { getHeight } from '@/publicMethods/pageSet';
import {
  columsForWeeks,
  columsForMonths,
  columsForQuarters,
  columsForYears,
} from './gridConfigure/columns';
import { queryEmergencyCounts } from './gridConfigure/data';

const ReleaseEmergencyCounts: React.FC<any> = () => {
  /* region ag-grid */
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const { data, loading } = useRequest(() => queryEmergencyCounts(gqlClient, 'quarter'));
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
    const datas: any = await queryEmergencyCounts(gqlClient, 'week');
    gridApi.current?.setRowData(datas);
  };

  // 按月统计
  const statisticsByMonths = async () => {
    /* 12月 */
    gridApi.current?.setColumnDefs([]);
    const monthColums = columsForMonths();
    gridApi.current?.setColumnDefs(monthColums);
    const datas: any = await queryEmergencyCounts(gqlClient, 'month');
    gridApi.current?.setRowData(datas);
  };

  // 按季度统计
  const statisticsByQuarters = async () => {
    /* 4季 */
    gridApi.current?.setColumnDefs([]);
    const quartersColums = columsForQuarters();
    gridApi.current?.setColumnDefs(quartersColums);
    const datas: any = await queryEmergencyCounts(gqlClient, 'quarter');
    gridApi.current?.setRowData(datas);
  };

  // 按年统计
  const statisticsByYear = async () => {
    gridApi.current?.setColumnDefs([]);
    const yearsColums = columsForYears();
    gridApi.current?.setColumnDefs(yearsColums);
    const datas: any = await queryEmergencyCounts(gqlClient, 'year');
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

  const cssIndent = { textIndent: '2em' };
  /* endregion */

  return (
    <PageContainer>
      <div style={{ background: 'white' }}>
        <Button
          type="text"
          style={{ color: 'black' }}
          icon={<ProfileTwoTone />}
          size={'large'}
          onClick={statisticsByWeeks}
        >
          按周统计
        </Button>
        <Button
          type="text"
          style={{ color: 'black' }}
          icon={<CalendarTwoTone />}
          size={'large'}
          onClick={statisticsByMonths}
        >
          按月统计
        </Button>
        <Button
          type="text"
          style={{ color: 'black' }}
          icon={<ScheduleTwoTone />}
          size={'large'}
          onClick={statisticsByQuarters}
        >
          按季统计
        </Button>
        <Button
          type="text"
          style={{ color: 'black' }}
          icon={<AppstoreTwoTone />}
          size={'large'}
          onClick={statisticsByYear}
        >
          按年统计
        </Button>
        <label style={{ fontWeight: 'bold' }}>(统计单位：个)</label>
        <Button
          type="text"
          style={{ color: '#1890FF', float: 'right' }}
          icon={<QuestionCircleTwoTone />}
          size={'large'}
          onClick={showRules}
        >
          计算规则
        </Button>
      </div>

      <div className="ag-theme-alpine" style={{ height: gridHeight, width: '100%' }}>
        <AgGridReact
          columnDefs={columsForQuarters()} // 定义列
          rowData={data} // 数据绑定
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            flex: 1,
            suppressMenu: true,
          }}
          autoGroupColumnDef={{
            minWidth: 280,
            headerName: '部门-人员',
            cellRendererParams: { suppressCount: true },
            pinned: 'left',
            suppressMenu: false,
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
        ></AgGridReact>
      </div>

      <div>
        <Drawer
          title={<label style={{ fontWeight: 'bold', fontSize: 20 }}>计算规则</label>}
          placement="right"
          width={300}
          closable={false}
          onClose={onClose}
          visible={messageVisible}
        >
          <p>1.取值范围：</p>
          <p style={cssIndent}>查需求创建时间落在该周期的（按周、按月、按季、按年）；</p>
          <p style={cssIndent}>查需求的所属计划包含emergency字样的；</p>
          <p style={cssIndent}>且任务有关联需求；</p>
          <p style={cssIndent}>
            且需求的'是否发布引入'字段值为'是'；当计划为空，是否发布引入为‘是’，查该需求关联的执行类型是否为’emergency’，是则算，不是则不算
          </p>
          <p style={cssIndent}>
            且需求关联的任务完成人/关闭人是测试，或需求关联的任务状态为未开始/进行中，查指派给为测试的；
          </p>
          <p>2.计算公式：</p>
          {/*<p style={cssIndent}>不显示按人员</p>*/}
          <p style={cssIndent}>
            按部门：测试-发布引入emergency数 = 指派给这个部门开发的需求数 +
            由这个部门开发完成的需求数（特殊说明‘指派给这个部门测试的需求数’：不是查需求的指派给，而是查需求关联任务的指派给；当1个需求有多个测试完成任务，给每个测试都算1个需求，若这里的多个测试都属于同一个部门时，需要对需求编号进行去重，注意区分一级部门、2级部门）；
          </p>
          <p style={cssIndent}>
            按中心：测试-发布引入emergency数 = 就是根据1.取值范围中查出来的所有需求数；
          </p>
        </Drawer>
      </div>
    </PageContainer>
  );
};

export default ReleaseEmergencyCounts;

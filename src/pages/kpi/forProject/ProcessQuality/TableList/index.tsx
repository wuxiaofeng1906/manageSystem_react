/*
 * @Description: 数据列表
 * @Author: jieTan
 * @Date: 2021-11-22 10:55:42
 * @LastEditTime: 2021-11-23 17:41:41
 * @LastEditors: jieTan
 * @LastModify:
 */

import './index.css';
import { useGqlClient } from '@/hooks';
import { DEFAULT_PLACEHOLDER, HOUR, NUMBER_W, PERCENTAGE } from '@/namespaces';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { useRequest } from 'ahooks';
import { GQL_PARAMS, queryGQL } from '../../gql.query';
import mygql from './mygql';
import BugNumberColumn from './renders/BugNumberColumn';
import ProjectColumn from './renders/ProjectColumn';
import BugReOpenColumn from './renders/BugReOpenColumn';
import BugResolveDuraColumn from './renders/BugResolveDuraColumn';
import BugFlybackDuraColumn from './renders/BugFlybackDuraColumn';

/*  */
const EmptyUi = () => DEFAULT_PLACEHOLDER;

/*  */
export default () => {
  /*  */
  const ratioW = { width: NUMBER_W * 2, minWidth: NUMBER_W * 2 };
  const numberW = { width: NUMBER_W, minWidth: NUMBER_W };
  const doubleNumberW = { width: NUMBER_W * 2, minWidth: NUMBER_W * 2 };
  //
  const gqlClient = useGqlClient();
  const params: GQL_PARAMS = {
    func: 'projectKpi',
    params: { start: '2021-11-10', projIds: [445, 674, 675, 676] },
  };

  const { data } = useRequest(() => queryGQL(gqlClient, mygql, params));

  /*  */

  /*  */
  return (
    <div className="ag-theme-material" style={{ height: 400 }}>
      <AgGridReact
        frameworkComponents={{
          project: ProjectColumn,
          bugNumber: BugNumberColumn,
          reopenRatio: BugReOpenColumn,
          bugResolveDura: BugResolveDuraColumn,
          bugFlybackDura: BugFlybackDuraColumn,
        }}
        rowData={data}
      >
        <AgGridColumn
          headerName="序"
          field="order"
          valueGetter={(props) => (props.node?.rowIndex as number) + 1}
          {...numberW}
        />
        <AgGridColumn headerName="项目名称" field="project" cellRenderer="project" />
        <AgGridColumn headerName="所属部门" field="dept" valueGetter={EmptyUi} />
        <AgGridColumn
          headerName="前后端Bug数"
          field="bugNumber"
          cellRenderer="bugNumber"
          {...doubleNumberW}
        />
        <AgGridColumn
          headerName="千行Bug率"
          field="thouslineRatio"
          valueGetter={EmptyUi}
          {...doubleNumberW}
        />
        <AgGridColumn
          headerName="单元覆盖率"
          field="unitCover"
          valueGetter={EmptyUi}
          {...doubleNumberW}
        />
        <AgGridColumn
          headerName={`ReOpen率(${PERCENTAGE['unit']})`}
          field="reopenRatio"
          cellRenderer="reopenRatio"
          cellRendererParams={{ delta: PERCENTAGE['value'] }}
          {...ratioW}
        />
        <AgGridColumn
          headerName={`解决时长(${HOUR['unit']})`}
          field="bugResolveDura"
          cellRenderer="bugResolveDura"
          cellRendererParams={{ delta: HOUR['value'] }}
          {...doubleNumberW}
        />
        <AgGridColumn
          headerName="有效Bug率"
          field="effectiveBugRatio"
          valueGetter={EmptyUi}
          {...ratioW}
        />
        <AgGridColumn
          headerName={`回归时长(${HOUR['unit']})`}
          field="bugFlybackDura"
          cellRenderer="bugFlybackDura"
          cellRendererParams={{ delta: HOUR['value'] }}
          {...doubleNumberW}
        />
        <AgGridColumn headerName="用例数" field="caseNumber" {...doubleNumberW} />
        <AgGridColumn headerName="自动化测试覆盖率" field="autoCoverRatio" valueGetter={EmptyUi} />
      </AgGridReact>
    </div>
  );
};

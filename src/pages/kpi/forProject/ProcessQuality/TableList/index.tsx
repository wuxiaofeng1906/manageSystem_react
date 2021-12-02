/*
 * @Description: 数据列表
 * @Author: jieTan
 * @Date: 2021-11-22 10:55:42
 * @LastEditTime: 2021-12-02 16:24:11
 * @LastEditors: jieTan
 * @LastModify:
 */

import './index.css';
import { AgGridReact } from 'ag-grid-react';
import { useGqlClient } from '@/hooks';
import { useRequest } from 'ahooks';
import { ProcessQualityCols, TableMajorCols } from './definitions/columns';
import IdWithNameColumn from './renders/IdWithNameColumn';
import BugReOpenColumn from './renders/BugReOpenColumn';
import BugFlybackDuraColumn from './renders/BugFlybackDuraColumn';
import { EXTRA_FILTER_TYPE, GQL_PARAMS, GRAPHQL_QUERY } from '@/namespaces';
import { useModel } from 'umi';
import { mockData } from './mock';
import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { queryGQL, projectKpiGql } from '@/pages/gqls';
import { RowNode } from 'ag-grid-community';

/**
 * @description - 处理待筛选的字段
 * @author JieTan
 * @date 2021/12/02 16:12:17
 * @param {RowNode} node - table一行完整的数据
 * @param {EXTRA_FILTER_TYPE} filterType - 记录当前筛选的是那个属性的值
 * @returns {*}  {boolean}
 */
const doesExternalFilterPass = (node: RowNode, filterType: EXTRA_FILTER_TYPE): boolean => {
  switch (filterType.field) {
    case 'project':
      return filterType.values?.includes(node.data.project.id) ?? true;
    default:
      return true;
  }
};

/*  */
export default () => {
  /*  */
  const { gqlData, setGqlData, setGridApi, projType } = useModel('processQuality');

  // /*  */
  // const gqlClient = useGqlClient(); // 必须提前初始化该对象
  // const params: GQL_PARAMS = { func: GRAPHQL_QUERY['PROJECT_KPI'] };
  // const { data } = useRequest(async () => {
  //   const rets = await queryGQL(gqlClient, projectKpiGql, params);
  //   setGqlData(rets);
  //   return rets;
  // });

  const onGridReady = async (params: any) => {
    setGridApi(params.api);
    //
    setGqlData(mockData as never[]);
  };

  /*  */
  return (
    <div className="ag-theme-material" style={{ height: 960 }}>
      <AgGridReact
        frameworkComponents={{
          idWithName: IdWithNameColumn,
          reopenRatio: BugReOpenColumn,
          bugFlybackDura: BugFlybackDuraColumn,
        }}
        columnDefs={[TableMajorCols, ProcessQualityCols]}
        rowData={gqlData}
        onGridReady={onGridReady}
        isExternalFilterPresent={() => projType.values?.length !== 0}
        doesExternalFilterPass={(node) => doesExternalFilterPass(node, projType)}
      />
    </div>
  );
};

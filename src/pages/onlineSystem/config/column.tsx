import React from 'react';
import type {ColDef, ColGroupDef} from 'ag-grid-community/dist/lib/entities/colDef';
import type {ColumnsType} from 'antd/lib/table';
import {sum} from 'lodash';
import {
  PublishStatus,
  ReleaseOrderStatus,
  ServerConfirmType,
  WhetherOrNot,
} from '@/pages/onlineSystem/config/constant';
import Ellipsis from '@/components/Elipsis';

const cpWhetherOrNot = {...WhetherOrNot, unknown: '免'};

export const calendarColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'num',
    minWidth: 90,
    maxWidth: 90,
    cellRenderer: (params: any) => String(+params.node.id + 1),
  },
  {
    headerName: '上线分支',
    field: 'online_branch',
    minWidth: 150,
    tooltipField: 'online_branch',
    cellRenderer: 'link',
  },
  {
    headerName: '项目名称',
    field: 'project',
    minWidth: 150,
    tooltipField: 'project',
  },
  {headerName: '项目负责人', field: 'project_manager', minWidth: 140},
  {
    headerName: '应用服务',
    field: 'apps',
    minWidth: 130,
    tooltipField: 'apps',
  },
  {
    headerName: '状态',
    field: 'online_status',
    minWidth: 110,
    valueFormatter: (p) => PublishStatus[p.value] ?? '',
  },
];
// 禅道概况
export const zentaoStoryColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'num',
    minWidth: 70,
    maxWidth: 70,
    cellRenderer: (params: any) => String(+params.node.id + 1),
  },
  {headerName: '类型', field: 'category', minWidth: 100, maxWidth: 100},
  {headerName: '编号', field: 'ztNo', minWidth: 110, maxWidth: 110, cellRenderer: 'link'},
  {headerName: '阶段', field: 'stage.show.zh', minWidth: 110, maxWidth: 110},
  {
    headerName: '执行名称',
    field: 'execution.name',
    minWidth: 150,
    tooltipField: 'execution.name',
  },
  {headerName: '标题名称', field: 'title', minWidth: 150, tooltipField: 'title'},
  {
    headerName: '应用服务',
    field: 'appservices',
    minWidth: 110,
    cellRenderer: (p) => p.value?.join(',')?.replaceAll('notinvolved', '不涉及') || '',
    tooltipField: 'appservices',
  },
  {
    headerName: '严重等级',
    field: 'severity',
    minWidth: 110,
    maxWidth: 110,
    valueFormatter: (p) =>
      p.value && !String(p.value)?.includes('级') ? `${p.value}级` : p.value || '',
  },
  {headerName: '所属模块', field: 'module.name', minWidth: 120, tooltipField: 'module.name'},
  {headerName: '创建人', field: 'openedBy.realname', minWidth: 110},
  {headerName: '指派人', field: 'assignedTo.realname', minWidth: 110},
];
export const zentaoTestColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'num',
    minWidth: 70,
    maxWidth: 70,
    cellRenderer: (params: any) => String(+params.node.id + 1),
  },
  {
    headerName: '归属执行',
    field: 'execution.name',
    minWidth: 170,
    tooltipField: 'execution.name',
  },
  {
    headerName: '测试单名称',
    field: 'testtask',
    minWidth: 170,
    cellRenderer: 'testSheet',
    tooltipField: 'testtask.name',
  },
  {headerName: '测试单对应版本', field: 'build.name', minWidth: 130},
  {
    headerName: '状态',
    field: 'status.zh',
    minWidth: 130,
  },
  {headerName: '负责人', field: 'owner.realname', minWidth: 110},
  // caseNums 用例数:[通过, 阻塞, 失败, 未执行]
  {
    headerName: '用例总数',
    field: 'caseNums',
    minWidth: 110,
    valueFormatter: (p) => sum(p.value),
  },
  {
    headerName: '通过用例数',
    field: 'caseNums',
    minWidth: 110,
    valueFormatter: (p) => p.value?.[0],
  },
  {
    headerName: '阻塞用例数',
    field: 'caseNums',
    minWidth: 110,
    cellStyle: (p) => ({
      color: p.value?.[1] > 0 ? 'red' : 'initial',
      lineHeight: '30px',
      fontWeight: p.value?.[1] > 0 ? 'bold' : 'initial',
    }),
    valueFormatter: (p) => p.value?.[1],
  },
  {
    headerName: '失败用例数',
    field: 'caseNums',
    minWidth: 110,
    cellStyle: (p) => ({
      color: p.value?.[2] > 0 ? 'red' : 'initial',
      lineHeight: '30px',
      fontWeight: p.value?.[2] > 0 ? 'bold' : 'initial',
    }),
    valueFormatter: (p) => p.value?.[2],
  },
  {
    headerName: '未执行用例数',
    field: 'caseNums',
    minWidth: 130,
    cellStyle: (p) => ({
      color: p.value?.[3] > 0 ? '#bfbfbf' : 'initial',
      lineHeight: '30px',
      fontWeight: p.value?.[3] > 0 ? 'bold' : 'initial',
    }),
    valueFormatter: (p) => p.value?.[3],
  },
  // bugNums bug数:[P0, P1, P2, P3]
  {headerName: 'BUG总数', field: 'bugNums', minWidth: 110, valueFormatter: (p) => sum(p.value)},
  {headerName: 'BUG-P0', field: 'bugNums', minWidth: 110, valueFormatter: (p) => p.value?.[0]},
  {headerName: 'BUG-P1', field: 'bugNums', minWidth: 110, valueFormatter: (p) => p.value?.[1]},
  {headerName: 'BUG-P2', field: 'bugNums', minWidth: 110, valueFormatter: (p) => p.value?.[2]},
  {headerName: 'BUG-P3', field: 'bugNums', minWidth: 110, valueFormatter: (p) => p.value?.[3]},
];

export const preServerColumn = (data: any[]): ColumnsType<any> => {
  const flag = data.some(
    (it: any) => it.project ? it.project.includes('stage-patch') || it.project.includes('emergency') : false,
  );
  let arr: any[] = [
    {
      title: '应用',
      dataIndex: 'apps',
      width: 100,
      render: (v: string, row: any) => ({
        children: <Ellipsis title={v} width={100} placement={'bottomLeft'} color={'#108ee9'}/>,
        props: {rowSpan: row.rowSpan},
      }),
    },
    {
      title: '项目名称',
      dataIndex: 'project',
      width: 200,
      ellipsis: {showTitle: false},
      render: (v: string, row: any) => (
        <Ellipsis key={row._id} title={v} width={190} placement={'bottomLeft'} color={'#108ee9'}/>
      ),
    },
    {
      title: '是否锁定',
      dataIndex: 'is_sealing',
      width: 120,
      render: (v: string) => (
        <span style={{color: v == 'yes' ? 'green' : 'initial'}}>{cpWhetherOrNot[v] ?? v}</span>
      ),
    },
    {title: '锁定/解锁人', dataIndex: 'sealing_user', width: 120},
    {title: '锁定/解锁时间', dataIndex: 'sealing_time', width: 180},
  ];
  if (flag)
    arr.push(
      {title: '需求编号', dataIndex: 'story_num', width: 120},
      {
        title: '需求标题',
        dataIndex: 'title',
        width: 200,
        ellipsis: {showTitle: false},
        render: (v: string) => (
          <Ellipsis title={v} width={190} placement={'bottomLeft'} color={'#108ee9'}/>
        ),
      },
      {
        title: '是否涉及数据update',
        dataIndex: 'data_upgrade',
        width: 150,
        render: (v: string) => cpWhetherOrNot[v] ?? v,
      },
      // {
      //   title: '是否涉及数据Recovery',
      //   dataIndex: 'is_recovery',
      //   width: 160,
      //   render: (v: string) => cpWhetherOrNot[v] ?? v,
      // },
      {
        title: '是否可热更',
        dataIndex: 'is_hot_update',
        width: 120,
        render: (v: string) => cpWhetherOrNot[v] ?? v,
      },
      {title: '需求创建人', dataIndex: 'create_user_name', width: 120},
      {title: '需求指派人', dataIndex: 'assigned_to_name', width: 120},
    );
  //是否封版 请求结果  no ->yes 解版成功，yes->yes 封版成功  yes->no 封版失败+说明， no->no 解版失败+说明
  arr.push({
    title: '请求结果说明',
    dataIndex: 'seal_result_dev',
    width: 120,
    ellipsis: {showTitle: false},
    render: (v: string, row: any) => {
      const isSeal = {yes: '锁定', no: '解除锁定'};
      return (
        <Ellipsis
          width={100}
          placement={'bottomLeft'}
          color={'#108ee9'}
          title={
            ['yes', 'no'].includes(v)
              ? v == 'yes'
              ? `${isSeal[row.is_sealing]}成功`
              : `${isSeal[row.is_sealing]}失败 ${row?.seal_result_dev_log || ''}`
              : ''
          }
        />
      );
    },
  });
  return arr;
};
// 升级接口
export const upgradeServicesColumn: (ColDef | ColGroupDef)[] = [
  {
    checkboxSelection: true,
    headerCheckboxSelection: true,
    maxWidth: 35,
    minWidth: 35,
    pinned: 'left',
  },
  {
    headerName: '序号',
    field: 'num',
    minWidth: 90,
    maxWidth: 90,
    pinned: 'left',
    cellRenderer: (params: any) => String(+params.node.id + 1),
  },
  {headerName: '接口服务', field: 'api_server', minWidth: 110, maxWidth: 110},
  {headerName: '接口Method', field: 'api_method', minWidth: 120, maxWidth: 120},
  {headerName: '接口URL', field: 'api_url', minWidth: 110, tooltipField: 'api_url'},
  {headerName: 'Data', field: 'api_data', minWidth: 130, tooltipField: 'api_data'},
  {headerName: 'Header', field: 'api_header', minWidth: 110, tooltipField: 'api_header'},
  {headerName: '租户ID', field: 'tenant', minWidth: 100, maxWidth: 100},
  {headerName: '提交人', field: 'author', minWidth: 100, maxWidth: 100},
];

// 运维工单
// 灰度推线上和非积压发布字段显示有些许区别
export const getDevOpsOrderColumn = (type: string = "") => {
  const releaseType = type === "gray" ? "当前状态" : "工单状态";
  return [
    {
      headerName: '序号',
      field: 'num',
      minWidth: 90,
      maxWidth: 90,
      pinned: 'left',
      cellRenderer: (params: any) => String(+params.node.id + 1),
    },
    {
      headerName: '运维工单编号',
      field: 'repair_order_num',
    },
    {
      headerName: '运维工单名称',
      field: 'approval_name'
    },
    {
      headerName: '创建人',
      field: 'applicant_name',
    },
    {
      headerName: releaseType,
      field: 'repair_order_status',
    },
    {
      headerName: '上一步审批人',
      field: `before_approval_name`,
    },
    {
      headerName: '当前待审批人',
      field: `current_approval_name`,
    },
  ];

}

export const repairColumn: (ColDef | ColGroupDef)[] = [
  {
    checkboxSelection: true,
    headerCheckboxSelection: true,
    maxWidth: 35,
    minWidth: 35,
    pinned: 'left',
  },
  {
    headerName: '序号',
    field: 'num',
    minWidth: 90,
    maxWidth: 90,
    pinned: 'left',
    cellRenderer: (params: any) => String(+params.node.id + 1),
  },
  {headerName: '数据修复内容', field: 'title', tooltipField: 'title'},
  {headerName: '涉及租户', field: 'tenant', minWidth: 100},
  {headerName: '类型', field: 'recovery_type', minWidth: 100, maxWidth: 100},
  {headerName: '修复提交人', field: 'author', minWidth: 110, maxWidth: 110, hide: true},
  {headerName: '分支', field: 'branch', minWidth: 110, maxWidth: 180},
  {headerName: 'sql详情', field: 'sql_detail', width: 90, maxWidth: 100, cellRenderer: 'log'},
];
export const serverConfirmColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '技术侧',
    field: 'confirm_type',
    valueFormatter: (p) => ServerConfirmType[p.value],
  },
  {headerName: '值班人', field: 'server_confirm_user'},
  {
    headerName: '是否可热更',
    field: 'is_hot_update',
    headerClass: 'ag-required',
    cellRenderer: 'select',
  },
  {
    headerName: '服务确认完成',
    field: 'confirm_result',
    cellRenderer: 'select',
    headerClass: 'ag-required',
  },
  {
    headerName: '确认时间',
    field: `confirm_time`,
    valueFormatter: (p) => (p.data.confirm_result == 'no' ? '' : p.value),
  },
];
export const PublishSeverColumn = (data: any): (ColDef | ColGroupDef)[] => {
  // 不停服
  const keepServer = data?.release_type?.release_way == 'keep_server';
  // const stopServer = data?.release_type?.release_way == 'stop_server';

  return [
    {
      headerName: '环境',
      field: 'cluster',
      minWidth: 350,
      cellRenderer: 'ICluster',
      wrapText: true,
      autoHeight: true,
    },
    {headerName: '应用', field: 'apps', minWidth: 150, wrapText: true, autoHeight: true},
    {headerName: '镜像源环境', field: 'release_env', minWidth: 130, autoHeight: true},
    {
      headerName: 'batch版本',
      field: 'batch',
      minWidth: 220,
      hide: data?.release_type?.release_type == 'global',
      cellRenderer: 'select',
      autoHeight: true,
      wrapText: true,
      headerClass: 'ag-required',
    },
    {
      headerName: '数据库版本',
      field: 'database_version',
      minWidth: 220,
      hide: keepServer,
      autoHeight: true,
      wrapText: true,

      cellRenderer: 'select', // 版本渲染
    },
    {
      headerName: '数据Recovery',
      field: 'is_recovery',
      minWidth: 130,
      cellRenderer: 'select',
      hide: keepServer,
      autoHeight: true,
      wrapText: true,
    },
    {
      headerName: '数据update',
      field: 'is_update',
      minWidth: 130,
      cellRenderer: 'select',
      hide: keepServer,
      autoHeight: true,
      wrapText: true,
    },
    {
      headerName: '是否清理redis缓存',
      field: 'clear_redis',
      minWidth: 150,
      cellRenderer: 'select',
      autoHeight: true,
      wrapText: true,
    },
    {
      headerName: '是否清理应用缓存',  // 暂时隐藏
      field: 'clear_cache',
      minWidth: 150,
      cellRenderer: 'select',
      hide: true,
      autoHeight: true,
      wrapText: true,
    },
    {
      headerName: 'SQL工单',
      field: 'sql_order',
      minWidth: 220,
      cellRenderer: 'select',
      hide: keepServer,
      autoHeight: true,
      wrapText: true,
    },
  ];
};
export const PublishUpgradeColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    minWidth: 70,
    width: 70,
    cellRenderer: (params: any) => String(+params.node.id + 1),
  },
  {headerName: '接口服务', field: 'api_server', minWidth: 110, width: 110},
  {headerName: '接口Method', field: 'api_method', minWidth: 110, width: 110},
  {headerName: '接口URL', field: 'api_url', minWidth: 110, tooltipField: 'api_url'},
  {headerName: 'Data', field: 'api_data', minWidth: 110},
  {headerName: 'Header', field: 'api_header', minWidth: 110},
  {headerName: '涉及租户', field: 'tenant', minWidth: 110, width: 110},
  {
    headerName: '并发数',
    field: 'concurrent',
    minWidth: 100,
    width: 100,
    headerClass: 'ag-required',
    valueFormatter: (p) => p.value ?? 20,
  },
  {headerName: '操作', minWidth: 90, width: 90, cellRenderer: 'operation'},
];

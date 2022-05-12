import { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';

const publish_status = { success: '发布成功', error: '发布失败' };
// 发布列表
const publishColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'publish_num',
    minWidth: 60,
    cellRenderer: (params: any) => {
      return (+params.node.id + 1).toString();
    },
  },
  {
    headerName: '正式发布批号',
    field: 'publish_version',
  },
  {
    headerName: '发布项目',
    field: 'publish_project',
  },
  {
    headerName: '发布结果',
    field: 'publish_result',
    cellRenderer: (params: any) => {
      return `<span style="color:${params.value == 'success' ? 'green' : 'red'}">${
        publish_status[params.value]
      }</span>`;
    },
  },
  {
    headerName: '项目负责人',
    field: 'publish_person',
  },
  {
    headerName: '发布分支',
    field: 'publish_branch',
  },
  {
    headerName: '发布类型',
    field: 'publish_type',
  },
  {
    headerName: '发布方式',
    field: 'publish_by',
  },
  {
    headerName: '发布环境',
    field: 'publish_env',
  },
  {
    headerName: '正式发布时间',
    field: 'publish_date',
  },
];

// 项目升级
const projectUpgradeColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'publish_num',
    cellRenderer: (params: any) => {
      return (+params.node.id + 1).toString();
    },
  },
  {
    headerName: '项目名称',
    field: 'name',
    minWidth: 120,
  },
  {
    headerName: '是否涉及数据库升级',
    field: 'update_dbs',
    minWidth: 120,
  },
  {
    headerName: '是否涉及数据Recovery',
    field: 'recovery',
    minWidth: 120,
  },
  {
    headerName: '是否清理缓存',
    field: 'clear',
  },
  {
    headerName: '是否涉及配置项增加',
    field: 'setting_add',
    minWidth: 120,
  },
  {
    headerName: '是否涉及元数据更新',
    field: 'origin_update',
    minWidth: 120,
  },
  {
    headerName: '备注',
    field: 'mark',
    minWidth: 120,
  },
  {
    headerName: '操作',
    minWidth: 90,
    pinned: 'right',
    cellRenderer: 'operate',
  },
];
// 服务升级
const publishServerColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'publish_num',
    minWidth: 60,
    cellRenderer: (params: any) => {
      return (+params.node.id + 1).toString();
    },
  },
  {
    headerName: '上线环境',
    field: 'online_env',
  },
  {
    headerName: '应用',
    field: 'application',
  },
  {
    headerName: '备注',
    field: 'mark',
  },
  {
    headerName: '操作',
    minWidth: 90,
    cellRenderer: 'operate',
  },
];
// 数据修复
const dataReviewColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'publish_num',
    minWidth: 60,
    cellRenderer: (params: any) => {
      return (+params.node.id + 1).toString();
    },
  },
  {
    headerName: '数据修复内容',
    field: 'review_content',
  },
  {
    headerName: '涉及租户',
    field: 'users',
  },
  {
    headerName: '类型',
    field: 'type',
  },
  {
    headerName: '修复提交人',
    field: 'commit_person',
  },
  {
    headerName: '分支',
    field: 'branch',
  },
  {
    headerName: '评审结果',
    field: 'result',
  },
  {
    headerName: '是否可重复执行',
    minWidth: 90,
    cellRenderer: 'repeat',
  },
];
// 接口升级
const upgradeSQLColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'publish_num',
    minWidth: 60,
    cellRenderer: (params: any) => {
      return (+params.node.id + 1).toString();
    },
  },
  {
    headerName: '上线环境',
    field: 'online_env',
  },
  {
    headerName: '升级类型',
    field: 'upgrade_type',
  },
  {
    headerName: '升级接口',
    field: 'upgrade_sql',
  },
  {
    headerName: '接口服务',
    field: 'services',
  },
  {
    headerName: '升级接口',
    field: 'upgrade_sql',
  },
  {
    headerName: '接口Method',
    field: 'method',
  },
  {
    headerName: '接口URL或SQL',
    field: 'upgrade_sql',
  },
  {
    headerName: 'data',
    field: 'data',
  },
  {
    headerName: 'Header',
    field: 'header',
  },
  {
    headerName: '并发数',
    field: 'count',
  },
  {
    headerName: '涉及租户',
    field: 'users',
  },
  {
    headerName: '是否记录积压',
    field: 'record',
  },
  {
    headerName: '操作',
    minWidth: 90,
    cellRenderer: 'operate',
  },
];
// 部署
const deployColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'num',
    minWidth: 60,
    cellRenderer: (params: any) => {
      return (+params.node.id + 1).toString();
    },
  },
  {
    headerName: '目标环境',
    field: 'env',
  },
  {
    headerName: '部署类型',
    field: 'type',
  },
  {
    headerName: '目标任务',
    field: 'task',
  },
  {
    headerName: '触发者',
    field: 'trigger',
  },
  {
    headerName: '启动时间',
    field: 'start_date',
  },
  {
    headerName: '完成时间',
    field: 'finish_date',
  },
  {
    headerName: '当前状态',
    field: 'status',
  },
  {
    headerName: '操作',
    minWidth: 90,
    cellRenderer: 'operate',
  },
];
export {
  publishColumn,
  projectUpgradeColumn,
  publishServerColumn,
  upgradeSQLColumn,
  dataReviewColumn,
  deployColumn,
};

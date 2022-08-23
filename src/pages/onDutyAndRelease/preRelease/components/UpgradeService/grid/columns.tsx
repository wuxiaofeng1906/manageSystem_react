import {
  getOnlineDev,
  getReleaseItem,
  getIfOrNot,
  getDatabseAndApiUpgrade,
  getUpgradeApi,
  getApiMethod,
} from '../../../comControl/converse';
import { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';
import { ColumnType } from 'antd/es/table';
import { ColumnsType } from 'antd/lib/table/interface';
import { Tooltip } from 'antd';
// 渲染表格行的颜色(正在修改的行)
const releaseAppChangRowColor = (allLockedArray: any, type: string, idFlag: number) => {
  const lockInfoArray = allLockedArray;
  let returnValue = { 'background-color': 'transparent' };
  if (!idFlag) {
    return returnValue;
  }
  if (lockInfoArray && lockInfoArray.length > 0) {
    for (let index = 0; index < lockInfoArray.length; index += 1) {
      const paramsArray = lockInfoArray[index].param.split('-');
      if (type === `${paramsArray[1]}-${paramsArray[2]}`) {
        // 判断是不是属于当前渲染表格的数据
        if (idFlag.toString() === paramsArray[3]) {
          // 判断有没有对应id
          returnValue = { 'background-color': '#FFF6F6' };
          break;
        }
      }
    }
  }
  return returnValue;
};

// 操作按钮

// 发布项表格定义
const getReleasedItemColumns = () => {
  const firstUpSerColumn: any = [
    {
      headerName: '上线环境',
      field: 'online_environment',
      cellRenderer: (params: any) => getOnlineDev(params.value),
    },
    {
      headerName: '发布项',
      field: 'release_item',
      minWidth: 95,
      cellRenderer: (params: any) => getReleaseItem(params.value),
    },
    {
      headerName: '应用',
      field: 'app',
      minWidth: 65,
    },
    {
      headerName: '是否支持热更新',
      field: 'hot_update',
      minWidth: 130,
      cellRenderer: (params: any) => getIfOrNot(params.value),
    },
    {
      headerName: '是否涉及接口与数据库升级',
      field: 'is_upgrade_api_database',
      minWidth: 196,
      cellRenderer: (params: any) => getDatabseAndApiUpgrade(params.value),
    },
    {
      headerName: '来源',
      field: 'add_type',
      minWidth: 110,
      cellRenderer: (params: any) =>
        params.value == 'auto' ? '自动获取' : params.value == 'manual' ? '手动添加' : '',
    },
    // {
    //   headerName: '分支和环境',
    //   field: 'branch_environment',
    //   minWidth: 105,
    // },
    {
      headerName: '编辑人',
      field: 'edit_user_name',
      minWidth: 75,
    },
    {
      headerName: '编辑时间',
      field: 'edit_time',
    },
    {
      headerName: '说明',
      field: 'instructions',
    },
    {
      headerName: '备注',
      field: 'remarks',
    },
    {
      headerName: '操作',
      pinned: 'right',
      minWidth: 115,
      maxWidth: 115,
      cellRenderer: 'operation',
    },
  ];
  return firstUpSerColumn;
};

//  发布接口表格定义
const getReleasedApiColumns = () => {
  const secondUpSerColumn: any = [
    {
      headerName: '上线环境',
      field: 'online_environment',
      cellRenderer: (params: any) => getOnlineDev(params.value),
    },
    {
      headerName: '升级接口',
      field: 'update_api',
      cellRenderer: (params: any) => getUpgradeApi(params.value),
    },
    {
      headerName: '接口服务',
      field: 'api_name',
    },
    // {
    //   headerName: '是否支持热更新',
    //   field: 'hot_update',
    //   cellRenderer: (params: any) => {
    //     return `<span>${getIfOrNot(params.value)}</span>`;
    //   },
    // },
    {
      headerName: '接口Method',
      field: 'api_method',
      cellRenderer: (params: any) => getApiMethod(params.value),
    },
    {
      headerName: '接口URL',
      field: 'api_url',
    },
    {
      headerName: 'Data',
      field: 'data',
    },
    {
      headerName: 'Header',
      field: 'header',
    },
    {
      headerName: '租户ID',
      field: 'related_tenant',
    },
    {
      headerName: '编辑人',
      field: 'edit_user_name',
      minWidth: 75,
    },
    {
      headerName: '编辑时间',
      field: 'edit_time',
    },
    {
      headerName: '备注',
      field: 'remarks',
    },
    {
      headerName: '操作',
      pinned: 'right',
      minWidth: 100,
      maxWidth: 100,
      cellRenderer: 'operation',
    },
  ];
  return secondUpSerColumn;
};

// 发布任务-服务确认
const getReleaseServiceComfirmColumns = () => {
  const thirdUpSerColumn = [
    {
      headerName: '前端值班',
      field: 'front_user_name',
      minWidth: 90,
    },
    {
      headerName: '服务确认完成',
      field: 'front_confirm_status',
      minWidth: 115,
      // editable: true,
      // cellEditor: "agSelectCellEditor",
      // cellEditorParams: {values: confirmRender()},
      // filterParams: {
      //   valueFormatter: (params: any) => {
      //     return confirmMappings[params.value];
      //   },
      // },
      // valueFormatter: (params: any) => {
      //   return confirmMappings[params.value];
      // },
      cellRenderer: 'confirmSelectChoice',
    },
    {
      headerName: '确认时间',
      field: 'front_confirm_time',
    },
    {
      headerName: '后端值班',
      field: 'back_end_user_name',
    },
    {
      headerName: '服务确认完成',
      field: 'back_end_confirm_status',
      minWidth: 115,
      // editable: true,
      // cellEditor: "agSelectCellEditor",
      // cellEditorParams: {values: confirmRender()},
      // filterParams: {
      //   valueFormatter: (params: any) => {
      //     return confirmMappings[params.value];
      //   },
      // },
      // valueFormatter: (params: any) => {
      //   return confirmMappings[params.value];
      // },
      // cellRenderer: selectColorRenderer
      cellRenderer: 'confirmSelectChoice',
    },
    {
      headerName: '确认时间',
      field: 'back_end_confirm_time',
    },
    {
      headerName: '流程值班',
      field: 'process_user_name',
    },
    {
      headerName: '服务确认完成',
      field: 'process_confirm_status',
      minWidth: 115,
      // editable: true,
      // cellEditor: "agSelectCellEditor",
      // cellEditorParams: {values: confirmRender()},
      // filterParams: {
      //   valueFormatter: (params: any) => {
      //     return confirmMappings[params.value];
      //   },
      // },
      // valueFormatter: (params: any) => {
      //   return confirmMappings[params.value];
      // },
      // cellRenderer: selectColorRenderer
      cellRenderer: 'confirmSelectChoice',
    },
    {
      headerName: '确认时间',
      field: 'process_confirm_time',
    },
    {
      headerName: '测试值班',
      field: 'test_user_name',
    },
    {
      headerName: '服务确认完成',
      field: 'test_confirm_status',
      minWidth: 115,
      // editable: true,
      // cellEditor: "agSelectCellEditor",
      // cellEditorParams: {values: confirmRender()},
      // filterParams: {
      //   valueFormatter: (params: any) => {
      //     return confirmMappings[params.value];
      //   },
      // },
      // valueFormatter: (params: any) => {
      //   return confirmMappings[params.value];
      // },
      // cellRenderer: selectColorRenderer
      cellRenderer: 'confirmSelectChoice',
    },
    {
      headerName: '确认时间',
      field: 'test_confirm_time',
    },
  ];
  return thirdUpSerColumn;
};
const getNewRelServiceComfirmColumns = () => {
  const thirdUpSerColumn = [
    {
      headerName: 'global值班',
      field: 'global_user_name',
      minWidth: 90,
    },
    {
      headerName: '服务确认完成',
      field: 'global_confirm_status',
      minWidth: 115,
      cellRenderer: 'confirmSelectChoice',
    },
    {
      headerName: '确认时间',
      field: 'global_confirm_time',
    },
    {
      headerName: 'openapi值班',
      field: 'openapi_user_name',
    },
    {
      headerName: '服务确认完成',
      field: 'openapi_confirm_status',
      minWidth: 115,
      cellRenderer: 'confirmSelectChoice',
    },
    {
      headerName: '确认时间',
      field: 'openapi_confirm_time',
    },
    {
      headerName: 'qbos&store值班',
      field: 'qbos_store_user_name',
    },
    {
      headerName: '服务确认完成',
      field: 'qbos_store_confirm_status',
      minWidth: 115,
      cellRenderer: 'confirmSelectChoice',
    },
    {
      headerName: '确认时间',
      field: 'qbos_store_confirm_time',
    },
    {
      headerName: 'jsf值班',
      field: 'jsf_user_name',
    },
    {
      headerName: '服务确认完成',
      field: 'jsf_confirm_status',
      minWidth: 115,
      cellRenderer: 'confirmSelectChoice',
    },
    {
      headerName: '确认时间',
      field: 'jsf_confirm_time',
    },
  ];
  return thirdUpSerColumn;
};
const publishListColumn: ColumnsType<any> = [
  {
    title: '序号',
    width: 50,
    render: (v: any, record, i) => (i + 1).toString(),
  },
  {
    title: '需求编号',
    dataIndex: 'story_num',
    width: 80,
    render: (v) => (
      <a target="_blank" href={`http://zentao.77hub.com/zentao/story-view-${v}.html`}>
        {v}
      </a>
    ),
  },
  {
    title: '标题内容',
    dataIndex: 'title',
    width: 200,
    ellipsis: { showTitle: false },
    render: (v) => (
      <Tooltip placement={'topLeft'} title={v}>
        {v}
      </Tooltip>
    ),
  },
  {
    title: '所属执行',
    dataIndex: 'execution_name',
  },
  {
    title: '优先级',
    dataIndex: 'priority',
    width: 60,
  },
  {
    title: '模块名',
    dataIndex: 'module_name',
  },
  {
    title: '是否可热更',
    dataIndex: 'is_hot_update',
    width: 100,
    render: (v) => (v == 'no' ? '否' : v == 'yes' ? '是' : ''),
  },
  {
    title: '创建人',
    dataIndex: 'create_user_name',
    width: 90,
  },
  {
    title: '指派人',
    dataIndex: 'assigned_to_name',
    width: 90,
  },
];

export {
  getReleasedItemColumns,
  getReleasedApiColumns,
  getReleaseServiceComfirmColumns,
  releaseAppChangRowColor,
  getNewRelServiceComfirmColumns,
  publishListColumn,
};

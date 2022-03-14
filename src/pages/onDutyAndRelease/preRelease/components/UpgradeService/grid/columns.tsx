import {
  getOnlineDev, getReleaseItem, getIfOrNot, getDatabseAndApiUpgrade, getUpgradeApi, getApiMethod
} from '../../../comControl/converse';
// 渲染表格行的颜色(正在修改的行)
const releaseAppChangRowColor = (allLockedArray: any, type: string, idFlag: number) => {
  const lockInfoArray = allLockedArray;
  let returnValue = {'background-color': 'transparent'};
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
          returnValue = {'background-color': '#FFF6F6'};
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
      cellRenderer: (params: any) => {
        return `<span>${getOnlineDev(params.value)}</span>`;
      },
    },
    {
      headerName: '发布项',
      field: 'release_item',
      minWidth: 95,
      cellRenderer: (params: any) => {
        const item = getReleaseItem(params.value);
        return `<span>${item}</span>`;
      },
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
      cellRenderer: (params: any) => {
        return `<span>${getIfOrNot(params.value)}</span>`;
      },
    },
    {
      headerName: '是否涉及接口与数据库升级',
      field: 'is_upgrade_api_database',
      minWidth: 196,
      cellRenderer: (params: any) => {
        return `<span>${getDatabseAndApiUpgrade(params.value)}</span>`;
      },
    },
    {
      headerName: '分支和环境',
      field: 'branch_environment',
      minWidth: 105,
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
      cellRenderer: (params: any) => {
        const paramData = JSON.stringify(params.data).replace(/'/g, '’');
        // 发布项没有新增功能
        return `
        <div style="margin-top: -5px">
             <Button  style="border: none; background-color: transparent;  margin-left: -10px; "  onclick='showPulishItemForm("modify",${paramData})'>
              <img src="../edit.png" width="15" height="15" alt="修改" title="修改">
            </Button>
            <Button  style="border: none; background-color: transparent; margin-left: -10px ; " onclick='deleteGridRows(1,${paramData})'>
              <img src="../delete_2.png" width="15" height="15" alt="删除" title="删除">
            </Button>
        </div>
           `;

      },
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
      cellRenderer: (params: any) => {
        return `<span>${getOnlineDev(params.value)}</span>`;
      },
    },
    {
      headerName: '升级接口',
      field: 'update_api',
      cellRenderer: (params: any) => {
        return `<span>${getUpgradeApi(params.value)}</span>`;
      },
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
      cellRenderer: (params: any) => {
        return `<span>${getApiMethod(params.value)}</span>`;
      },
    },
    {
      headerName: '接口URL',
      field: 'api_url',
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
      headerName: '涉及租户',
      field: 'related_tenant',
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
      cellRenderer: (params: any) => {
        const paramData = JSON.stringify(params.data).replace(/'/g, '’');
        return `
        <div style="margin-top: -5px">
            <Button  style="border: none; background-color: transparent; " onclick='showUpgradeApiForm("add",${paramData})'>
              <img src="../add_1.png" width="15" height="15" alt="新增" title="新增">
            </Button>
             <Button  style="border: none; background-color: transparent;  margin-left: -10px; " onclick='showUpgradeApiForm("modify",${paramData})'>
              <img src="../edit_1.png" width="15" height="15" alt="修改" title="修改">
            </Button>
            <Button  style="border: none; background-color: transparent; margin-left: -10px ; " onclick='deleteGridRows(2,${paramData})'>
              <img src="../delete_2.png" width="15" height="15" alt="删除" title="删除">
            </Button>
        </div>
           `;
      },
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


export {getReleasedItemColumns, getReleasedApiColumns, getReleaseServiceComfirmColumns, releaseAppChangRowColor}

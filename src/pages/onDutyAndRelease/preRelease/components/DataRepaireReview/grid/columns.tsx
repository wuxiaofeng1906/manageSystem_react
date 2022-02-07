import {getRepaireType, getIfOrNot, getPassOrNot} from '../../../comControl/converse';

// 数据修复review
const getReviewColumns = () => {
  const firstDataReviewColumn: any = [
    {
      headerName: '序号',
      field: 'No',
      minWidth: 65,
      maxWidth: 70,
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    },
    {
      headerName: '提交ID',
      field: 'commit_id',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '数据修复内容',
      field: 'repair_data_content',
      minWidth: 120,
    },
    {
      headerName: '涉及租户',
      field: 'related_tenant',
    },
    {
      headerName: '类型',
      field: 'type',
      minWidth: 80,
      cellRenderer: (params: any) => {
        return `<span>${getRepaireType(params.value)}</span>`;
      },
    },
    {
      headerName: '修复提交人',
      field: 'commit_user_name',
      minWidth: 105,
    },
    {
      headerName: '分支',
      field: 'branch',
    },
    {
      headerName: '是否可重复执行',
      field: 'is_repeat',
      minWidth: 130,
      cellRenderer: (params: any) => {
        return `<span>${getIfOrNot(params.value)}</span>`;
      },
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
      headerName: '评审结果',
      field: 'review_result',
      cellRenderer: (params: any) => {
        return `<span>${getPassOrNot(params.value)}</span>`;
      },
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
            <Button  style="border: none; background-color: transparent; " onclick='showDataRepaireForm("add",${paramData})'>
              <img src="../add_1.png" width="15" height="15" alt="新增" title="新增">
            </Button>
             <Button  style="border: none; background-color: transparent;  margin-left: -10px; " onclick='showDataRepaireForm("modify",${paramData})'>
              <img src="../edit.png" width="15" height="15" alt="修改" title="修改">
            </Button>
            <Button  style="border: none; background-color: transparent; margin-left: -10px ; " onclick='deleteRows("",${paramData})'>
              <img src="../delete_2.png" width="15" height="15" alt="删除" title="删除">
            </Button>
        </div>
           `;
      },
    },
  ];
  return firstDataReviewColumn;
};

// 数据review确认
const getReviewConfirmColums = () => {
  const secondDataReviewColumn = [
    {
      headerName: '后端值班',
      field: 'confirm_user_name',
    },
    {
      headerName: '服务确认完成',
      field: 'confirm_status',
      cellRenderer: 'selectChoice',
    },
    {
      headerName: '确认时间',
      field: 'confirm_time',
    },
  ];
  return secondDataReviewColumn;
};


export {getReviewColumns, getReviewConfirmColums}

const gridHeight = (datas: any) => {
  let height = 100;
  if (datas && datas.length > 0) {
    height = datas.length * 30 + 60;
  }
  return height;
};

// 灰度积压列表
// isPreStatus： 是否为待发布状态
const grayscaleBacklogList = (type: string, isPreStatus: boolean) => {
  let grayNum = {
    headerName: '灰度发布批次号',
    field: 'ready_release_num',
    minWidth: 135,
    maxWidth: 150,
  };
  let grayNumName = {
    headerName: '灰度发布名称',
    field: 'ready_release_name',
    minWidth: 145,
  };
  if (type === 'one') {
    grayNum.field = 'release_gray_num';
    grayNumName.field = 'release_name';
  }

  const column: any = [
    {
      headerName: '',
      pinned: 'left',
      filter: false,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      maxWidth: 40,
      hide: isPreStatus,
    },
    {
      headerName: '序号',
      minWidth: 70,
      maxWidth: 70,
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    },
    {
      ...grayNum,
    },
    {
      ...grayNumName,
    },
    {
      headerName: '工单编号',
      field: 'order',
      minWidth: 90,
    },
    {
      headerName: '项目名称',
      field: 'project_name',
      minWidth: 100,
    },
    {
      headerName: '发布环境',
      field: 'online_environment',
      minWidth: 100,
    },
    // {
    //   headerName: '发布镜像ID',
    //   field: 'deployment_id',
    // },
    {
      headerName: '发布分支',
      field: 'branch',
      minWidth: 100,
    },
    {
      headerName: '灰度发布时间',
      field: 'plan_release_time',
      minWidth: 100,
      maxWidth: 185,
    },
    {
      headerName: '操作',
      cellRenderer: 'grayReleaseDetails',
      minWidth: 120,
      maxWidth: 120,
    },
  ];
  return column;
};

// 正式发布列表
const releasedList = () => {
  const columns: any = [
    {
      headerName: '序号',
      minWidth: 60,
      maxWidth: 80,
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    },
    {
      headerName: '正式发布批次号',
      field: 'online_release_num',
      minWidth: 130,
      maxWidth: 150,
    },
    {
      headerName: '发布名称',
      field: 'release_name',
      minWidth: 145,
    },
    {
      headerName: '灰度发布编号',
      field: 'ready_release_num',
      minWidth: 145,
      cellRenderer: (params: any) => {
        const { value } = params;
        if (!value || value.length === 0) {
          return '';
        }
        const retunValue: any = [];
        value.forEach((ele: any) => {
          retunValue.push(ele.ready_release_num);
        });
        return retunValue.join(',');
      },
    },
    {
      headerName: '工单编号',
      field: 'order',
      minWidth: 90,
    },
    {
      headerName: '项目名称',
      field: 'project_name',
      minWidth: 90,
    },
    {
      headerName: '发布环境',
      field: 'online_environment',
      minWidth: 90,
    },
    {
      headerName: '发布结果',
      field: 'release_result',
      minWidth: 90,
      cellRenderer: (p: any) =>
        `<span style="color:${
          p.value == 'success' ? '#2BF541' : p.value == 'failure' ? 'red' : 'initial'
        }">${p.value == 'success' ? '发布成功' : p.value == 'failure' ? '发布失败' : ''}</span>`,
    },
    //   {
    //   headerName: '发布镜像ID',
    //   field: 'deployment_id'
    // },
    {
      headerName: '发布分支',
      field: 'branch',
      minWidth: 90,
    },
    {
      headerName: '正式发布时间',
      field: 'plan_release_time',
    },
    {
      headerName: '操作',
      cellRenderer: 'officialReleaseDetails',
      minWidth: 120,
      maxWidth: 140,
    },
  ];
  return columns;
};

export { gridHeight, releasedList, grayscaleBacklogList };

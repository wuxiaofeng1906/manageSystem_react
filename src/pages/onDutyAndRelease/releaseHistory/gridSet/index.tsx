const gridHeight = (datas: any) => {
  let height = 100;
  if (datas && datas.length > 0) {
    height = (datas.length * 30) + 60
  }
  return height;
}

// 灰度积压列表
const grayscaleBacklogList = () => {
  const column: any = [
    {
      headerName: '选择',
      pinned: 'left',
      filter: false,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      maxWidth: 40,
    }, {
      headerName: '序号',
      minWidth: 70,
      maxWidth: 70,
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    }, {
      headerName: '灰度发布批次号',
      field: 'ready_release_num',
      minWidth: 135,
      maxWidth: 150,
      // sort: "asc"
    }, {
      headerName: '灰度发布名称',
      field: 'ready_release_name',
      minWidth: 145
    }, {
      headerName: '工单编号',
      field: 'order',
      minWidth: 90,
    }, {
      headerName: '项目名称',
      field: 'project_name',
      minWidth: 100,
    }, {
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
    }, {
      headerName: '灰度发布时间',
      field: 'plan_release_time',
      minWidth: 100,
      maxWidth: 185
    }, {
      headerName: '操作',
      cellRenderer: "grayReleaseDetails",
      minWidth: 120,
      maxWidth: 120
    }];

  return column;

};

// 正式发布列表
const releasedList = () => {
  const columns: any = [{
    headerName: '序号',
    maxWidth: 80,
    cellRenderer: (params: any) => {
      return Number(params.node.id) + 1;
    },
  }, {
    headerName: '正式发布批次号',
    field: 'online_release_num',
    minWidth: 130,
    maxWidth: 150,
    cellRenderer: (params: any) => {
      //   如果没有正式发布编号，则显示未灰度发布编号
      if (params.value) {
        return params.value;
      }
      return params.data?.ready_release_num;
    }
  }, {
    headerName: '发布名称',
    field: 'release_name',
    minWidth: 145
  }, {
    headerName: '灰度发布编号',
    field: 'ready_release_num',
    minWidth: 145,
    cellRenderer: (params: any) => {
      // 如果没有正式发布编号， 灰度发布编号在正式上显示了，现在就不显示了。
      if (params.data?.online_release_num) {
        return params.value;
      }
      return '';
    }
  }, {
    headerName: '工单编号',
    field: 'order',
    minWidth: 90,
  }, {
    headerName: '项目名称',
    field: 'project_name',
    minWidth: 90,
  }, {
    headerName: '发布环境',
    field: 'online_environment',
    minWidth: 90,
  },
    //   {
    //   headerName: '发布镜像ID',
    //   field: 'deployment_id'
    // },
    {
      headerName: '发布分支',
      field: 'branch',
      minWidth: 90,
    }, {
      headerName: '正式发布时间',
      field: 'plan_release_time'
    }, {
      headerName: '操作',
      cellRenderer: "officialReleaseDetails",
      minWidth: 120,
      maxWidth: 120
    }];
  return columns;
};

export {gridHeight, releasedList, grayscaleBacklogList};

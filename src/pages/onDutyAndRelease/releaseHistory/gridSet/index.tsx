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
      maxWidth: 80,
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
      minWidth: 100,
    }, {
      headerName: '项目名称',
      field: 'project_name'
    }, {
      headerName: '发布环境',
      field: 'online_environment'
    },
    // {
    //   headerName: '发布镜像ID',
    //   field: 'deployment_id',
    // },
    {
      headerName: '发布分支',
      field: 'branch'
    }, {
      headerName: '灰度发布时间',
      field: 'plan_release_time',
      maxWidth: 185
    }, {
      headerName: '操作',
      cellRenderer: "grayReleaseDetails"
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
    // sort: "asc"
  }, {
    headerName: '发布名称',
    field: 'release_name',
    minWidth: 145
  }, {
    headerName: '灰度发布编号',
    field: 'ready_release_num',
    minWidth: 145
  }, {
    headerName: '工单编号',
    field: 'order',
    minWidth: 90,
  }, {
    headerName: '项目名称',
    field: 'project_name'
  }, {
    headerName: '发布环境',
    field: 'online_environment'
  },
    //   {
    //   headerName: '发布镜像ID',
    //   field: 'deployment_id'
    // },
    {
      headerName: '发布分支',
      field: 'branch'
    }, {
      headerName: '正式发布时间',
      field: 'plan_release_time'
    }, {
      headerName: '操作',
      cellRenderer: "officialReleaseDetails"
      // cellRenderer: (params: any) => {
      //   const readyReleaseNum = params.data?.ready_release_num;
      //   return `
      //     <div style="margin-top: -5px">
      //          <Button  style="border: none; background-color: transparent; font-size: small; color: #46A0FC" onclick='releaseProcessDetail(${JSON.stringify(readyReleaseNum)})'>
      //             <img src="../logs.png" width="20" height="20" alt="正式发布过程详情" title="正式发布过程详情" />
      //         </Button>
      //     </div>
      //         `;
      // }
    }];
  return columns;
};

export {gridHeight, releasedList, grayscaleBacklogList};

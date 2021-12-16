const editRenderer = (param: any) => {
  if (param.data?.milestone === "项目计划") {
    return true;
  }
  return false;
};
const getProcessColumns = () => {

  const processColums: any = [
    {
      headerName: '',
      field: 'title',
      minWidth: 90,
      cellRenderer: (params: any) => {
        return `<div style="font-weight: bold;margin-top: 70px">${params.value}</div>`

      },
      cellClassRules: {
        'cell-span': "value !== undefined"
      },
      rowSpan: (params: any) => {

        if (params.data.title === '1.进度') {
          return 6;
        }
        return 1;
      }
    },
    {
      headerName: '里程碑',
      field: 'milestone',
      maxWidth: 110,
      minWidth: 80
    },
    {
      headerName: '计划开始时间',
      field: 'planStart',
      minWidth: 115
      // editable: editRenderer
    },
    {
      headerName: '实际开始时间',
      field: 'actualStart',
      minWidth: 115
      // editable: editRenderer

    },
    {
      headerName: '计划完成时间',
      field: 'planEnd',
      minWidth: 115
      // editable: editRenderer
    },
    {
      headerName: '实际完成时间',
      field: 'actualEnd',
      minWidth: 115
      // editable: editRenderer
    },
    {
      headerName: '偏差天数',
      field: 'days',
      type: 'numericColumn',
      minWidth: 90
    },
    {
      headerName: '偏差率',
      field: 'ratio',
      type: 'numericColumn',
      minWidth: 80,
      valueFormatter: (params: any) => {
        if (params.value === null) {
          return "";
        }
        // if (params.value === 0) {
        //   return 0;
        // }
        return `${Number(params.value).toFixed(2)}%`
      }
    },
    {
      headerName: '偏差原因说明',
      field: 'memo',
      editable: true,
      minWidth: 300,
      cellRenderer: (params: any) => {
        if (!params.value) {
          return `<div style="font-style: italic ;text-align: center">手工录入</div>`;
        }
        return params.value;
      }
    }
  ];

  return processColums;
};

export {getProcessColumns};

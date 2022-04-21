const manualInput = (params: any) => {
  if (!params.value) {
    return `<div style="color: #A9A9A9">手工输入</div>`;
  }
  return `<div>${params.value}</div>`;
};

// 表格列的定义
const getColumns = (baseFile: any, baseTime: any) => {

  const columns: any = [
    {
      headerName: '',
      children: [
        {
          headerName: '',
          checkboxSelection: true,
          headerCheckboxSelection: true,
          maxWidth: 50,
          pinned: 'left',
        }, {
          headerName: '序',
          minWidth: 60,
          maxWidth: 75,
          pinned: 'left',
          suppressMenu: true,
          cellRenderer: (params: any) => {
            const currentID = Number(params.node.id) + 1;
            if (currentID < 10) {
              return `<span>0${currentID}</span>`;
            }
            return `<span>${currentID}</span>`;
          },
        }, {
          headerName: '',
          field: 'file_url',
          cellRenderer: "myUrl",
          pinned: 'left',
          maxWidth: 50,
          suppressMenu: true,
        }]
    },
    {
      headerName: '文件路径',
      children: baseFile
    },
    {
      headerName: '',
      children: [{
        headerName: '文档类型',
        field: 'file_format',
        pinned: 'left',
        minWidth: 90,
        // maxWidth: 110,
      }, {
        headerName: '作者',
        field: 'author',
        pinned: 'left',
        minWidth: 80,
        maxWidth: 100,
      }, {
        headerName: '基线人',
        field: 'baseUser',
        pinned: 'left',
        minWidth: 95,
        maxWidth: 100,
      }, {
        headerName: '是否基线',
        field: 'is_save_version',
        pinned: 'left',
        minWidth: 100,
        maxWidth: 110,
        cellRenderer: "baseLine"
      }]
    },
    {
      headerName: '基线时间',
      children: baseTime
    },
    {
      headerName: '',
      children: [{
        headerName: '最新基线标识',
        field: 'baseFlag',
        minWidth: 120,
        cellRenderer: "baseFlag"
      }, {
        headerName: '变更禅道编号',
        field: 'zt_num',
        minWidth: 120,
        cellRenderer: manualInput,
        editable: () => {
          if ((JSON.parse(localStorage.getItem('userLogins') as string)).group === "superGroup") {
            return true;
          }
          return false;
        }
      }, {
        headerName: '备注说明',
        field: 'remark',
        minWidth: 120,
        cellRenderer: manualInput,
        editable: () => {
          if ((JSON.parse(localStorage.getItem('userLogins') as string)).group === "superGroup") {
            return true;
          }
          return false;
        }
      }]
    }
  ];

  return columns;
};

// 设置表格的数据
const setCellStyle = (params: any) => {
  const style = {"line-height": "28px"};

  if (params.column?.colId !== "is_save_version"
    && params.column?.colId !== "zt_num"
    && params.column?.colId !== "remark") {
    style["background-color"] = '#F8F8F8';
  }

  // 如果是管理员
  if ((JSON.parse(localStorage.getItem('userLogins') as string)).group === "superGroup") {
    if ((params.column?.colId).indexOf("_time") > -1 && params.column?.colId !== "final_times") {
      style["background-color"] = 'white';
    }
  }


  return style;

};
export {getColumns, setCellStyle}

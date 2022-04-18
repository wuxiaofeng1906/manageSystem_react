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
          headerName: '序号',
          minWidth: 70,
          maxWidth: 75,
          pinned: 'left',
          cellRenderer: (params: any) => {
            return Number(params.node.id) + 1;
          },
        }, {
          headerName: '',
          field: 'file_url',
          cellRenderer: "myUrl",
          pinned: 'left',
          maxWidth: 50,
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
        maxWidth: 100,
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
        minWidth: 90,
        maxWidth: 100,
      }, {
        headerName: '是否基线',
        field: 'is_save_version',
        pinned: 'left',
        minWidth: 90,
        maxWidth: 100,
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
        minWidth: 110,
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


const setCellStyle = (params: any) => {
  const style = {"line-height": "28px"};

  if (params.column?.colId !== "is_save_version"
    && params.column?.colId !== "zt_num"
    && params.column?.colId !== "remark") {
    style["background-color"] = '#F8F8F8';
  }
  return style;

};
export {getColumns, setCellStyle}

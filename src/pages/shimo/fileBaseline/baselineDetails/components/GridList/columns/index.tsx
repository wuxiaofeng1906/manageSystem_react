const getBaseInfoColumns = () => {

  const baseFile = [
    {
      headerName: '一级目录',
      field: 'total',
      pinned: 'left',
      columnGroupShow: 'closed',
    }, {
      headerName: '一级目录',
      field: '',
      pinned: 'left',
      columnGroupShow: 'open',
    }, {
      headerName: '二级文件',
      field: '',
      pinned: 'left',
      columnGroupShow: 'open',
    }, {
      headerName: '三级文件',
      field: '',
      pinned: 'left',
      columnGroupShow: 'open',
    },
  ];

  const baseTime = [
    {
      headerName: '一次基线时间',
      field: '',
      columnGroupShow: 'closed',
    },
    {
      headerName: '一次基线时间',
      field: '',
      columnGroupShow: 'open',
    }, {
      headerName: '二次基线时间',
      field: '',
      columnGroupShow: 'open',
    }, {
      headerName: '三次基线时间',
      field: '',
      columnGroupShow: 'open',
    },
  ];
  return {baseFile, baseTime};
};

const manualInput = (params: any) => {
  if (!params.value) {
    return `<div style="color: #A9A9A9">手工输入</div>`;
  }
  return `<div>${params.value}</div>`;
};

// 表格列的定义
const getColumns = () => {
  const {baseFile, baseTime} = getBaseInfoColumns();
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
          field: 'zentao_url',
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
        field: '',
        pinned: 'left',
        minWidth: 90,
        maxWidth: 100,
      }, {
        headerName: '作者',
        field: '',
        pinned: 'left',
        minWidth: 80,
        maxWidth: 100,
      }, {
        headerName: '基线人',
        field: '',
        pinned: 'left',
        minWidth: 90,
        maxWidth: 100,
      }, {
        headerName: '是否基线',
        field: '',
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
        field: '',
        minWidth: 110,
      }, {
        headerName: '变更禅道编号',
        field: 'shimo_url',
        minWidth: 120,
        cellRenderer: manualInput,
        editable: true
      }, {
        headerName: '备注说明',
        field: 'shimo_url',
        minWidth: 120,
        cellRenderer: manualInput,
        editable: true
      }]
    }
  ];

  return columns;
};


const setCellStyle = (params: any) => {
  const style = {"line-height": "28px"}
  if (params.column?.colId === "description") {
    style["background-color"] = '#F8F8F8';
  }
  return style;

};
export {getColumns, setCellStyle}

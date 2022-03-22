const getTempColumns = () => {
  const column: any = [{
    headerName: '',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    maxWidth: 50,
    pinned: 'left',
  }, {
    headerName: '序号',
    minWidth: 50,
    maxWidth: 80,
    pinned: 'left',
    cellRenderer: (params: any) => {
      return Number(params.node.id) + 1;
    },
  }, {
    headerName: '增加类型',
    field: 'add_type_name',
    minWidth: 110,
    cellRenderer: "addTypeRender"
  }, {
    headerName: '任务名称',
    field: 'task_name',
    minWidth: 100,
    editable: true,
    cellRenderer: (params: any) => {
      if (params.data.is_tailoring === "yes" || params.data.is_tailoring === "是") {
        return `<span style="color: gray">${params.value}</span>`
      }
      return params.value;
    }
  }, {
    headerName: '所属模块',
    field: 'module',
    minWidth: 90,
    editable: true,
  }, {
    headerName: '研发相关需求',
    field: 'subtask_dev_needs',
    minWidth: 90,
    editable: true,
  }, {
    headerName: '指派给',
    field: 'assigned_person_name',
    minWidth: 110,
    cellRenderer: "assignedToRender"
  }, {
    headerName: '优先级',
    field: 'priority',
    minWidth: 90,
    cellRenderer: "priorityRender"
  }, {
    headerName: '任务类型',
    field: 'task_type_name',
    minWidth: 110,
    cellRenderer: "taskTypeRender"
  }, {
    headerName: '最初预计',
    field: 'estimate',
    minWidth: 90,
    editable: true,
  }, {
    headerName: '任务描述',
    field: 'desc',
    minWidth: 90,
    editable: true,
  }, {
    headerName: '所属端',
    field: 'belongs_name',
    minWidth: 110,
    cellRenderer: "belongsSideRender"
  }, {
    headerName: '任务来源',
    field: 'tasksource_name',
    minWidth: 120,
    cellRenderer: "taskSourceRender"
  }, {
    headerName: '是否裁剪',
    field: 'is_tailoring',
    minWidth: 100,
    cellRenderer: "cutRender"
  }, {
    headerName: '操作',
    pinned: 'right',
    maxWidth: 90,
    cellRenderer: (params: any) => {

      const paramData = JSON.stringify(params.data).replace(/'/g, '’');
      return `
            <Button  style="border: none; background-color: transparent;margin-top: -3px " onclick='addTemplateRow(JSON.stringify(${params.rowIndex}),${paramData})'>
              <img src="../add_black2.png" width="15" height="15" alt="新增" title="新增">
            </Button>
           `;

    }
  }];

  return column;

};

const columnsAdd = (rowIndex: any, rowData: any, gridOldData: any) => {

    const addRow: any = {add_type_name: "",};
    // 判断当前点击是父任务还是子任务（增加类型是新增还是子任务），
    if (rowData.add_type_name === "子任务") {
      // 如果是子任务，则在本父任务后面添加一行子任务
      addRow.add_type_name = "子任务";
      // gridApi.current?.updateRowData({add: [addRow], addIndex: Number(rowIndex) + 1});
      return {row: addRow, position: Number(rowIndex) + 1};
    }

    // 如果是父任务，则本地新增则添加到这个父任务所属所有子任务的后面一行。
    addRow.add_type_name = "新增";
    let addPosition = -1; // 新增行的位置
    for (let index = Number(rowIndex); index < gridOldData.length; index += 1) {
      //  查找下一个父任务的ID
      const dts: any = gridOldData[index + 1];
      if (!dts || dts.add_type_name === "新增") {  // !dts 表示只有一行新增，则直接在下面新增一行父任务即可
        // 如果找到了下一个父任务，就在这个父任务的上面新增一行。
        addPosition = index + 1;
        break;
      }
    }

    return {row: addRow, position: addPosition};
    // gridApi.current?.updateRowData({add: [addRow], addIndex: addPosition});

  }
;
export {getTempColumns, columnsAdd};

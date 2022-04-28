const gridColumns: any = [
  {
    headerName: '序号',
    field: 'No',
    minWidth: 65,
    width: 90,
    pinned: "left"
  }, {
    headerName: '增加类型',
    field: 'add_type_name',
    pinned: "left"
  }, {
    headerName: '任务名称',
    field: 'task_name',
    minWidth: 200,
    width: 90,
    pinned: "left",
    editable: true,
  }, {
    headerName: '所属模块',
    field: 'module',
  }, {
    headerName: '相关需求',
    field: 'subtask_dev_needs',
    cellRenderer: (params: any) => {
      const storyId = params.data?.subtask_dev_id;
      if (params.value && storyId) {
        return `
          <div>
                <a target="_blank"; href='http://zentao.77hub.com/zentao/story-view-${storyId}.html'> ${storyId}</a>
                :${params.value}
          </div>`;
      }
      return params.value;
    }
  }, {
    headerName: '指派给',
    field: 'assigned_person',
    minWidth: 120,
    cellRenderer: "assigenedTo"
  }, {
    headerName: '预计开始',
    field: 'plan_start',
    minWidth: 150,
    cellRenderer: "timeRender",
  }, {
    headerName: '预计截止',
    field: 'plan_end',
    minWidth: 150,
    cellRenderer: "timeRender"
  }, {
    headerName: '优先级',
    field: 'priority',
  }, {
    headerName: '任务类型',
    field: 'task_type_name',
  }, {
    headerName: '最初预计',
    field: 'estimate',
    editable: true,
  }, {
    headerName: '任务描述',
    field: 'desc',
    editable: true,
  }, {
    headerName: '所属端',
    field: 'belongs_name',
  }, {
    headerName: '任务来源',
    field: 'tasksource_name',
  }, {
    headerName: '是否裁剪',
    field: 'is_tailoring',
    valueFormatter: (params: any) => {
      if (params.value === "yes") {
        return "是";
      }
      return "否";
    }
  }
];

// 设置cell颜色，可编辑为白色，不可编辑为灰色。
const setCellStyle = (params: any) => {
  const style = {"line-height": "28px"}
  const whiteCell = ["task_name", "assigned_person", "plan_start", "plan_end", "estimate", "desc"];
  if (whiteCell.indexOf(params.column?.colId) < 0) {
    style["background-color"] = '#F8F8F8';
  }else{
    style["background-color"] = 'white';
  }
  return style;

};
export {gridColumns, setCellStyle};

/* region  Table定义 */

// 上线前检查模板
const getOnlineCheckTempTable = (data: any) => {

  const column = [
    {name: "编号",width:100}, {name: "所属执行",width:600}, {name: "所属模块"}, {name: "相关研发需求"},
    {name: "任务名称"}, {name: "任务描述"}, {name: "任务类型"}, {name: "优先级"},
    {name: "预计开始"}, {name: "实际开始"}, {name: "截止日期"}, {name: "任务状态"},
    {name: "最初预计"}, {name: "总计消耗"}, {name: "预计剩余"}, {name: "抄送给"},
    {name: "进度"}, {name: "由谁创建"}, {name: "创建日期"}, {name: "指派给"},
    {name: "指派日期"}, {name: "由谁完成"}, {name: "实际完成"}, {name: "由谁取消"},
    {name: "取消时间"}, {name: "由谁关闭"}, {name: "关闭时间"}, {name: "关闭原因"},
    {name: "最后修改"}, {name: "最后修改日期"}, {name: "所属端"}, {name: "子状态"},
    {name: "任务来源"}, {name: "附件"}, {name: "是否裁剪"}
    ];

  const rowData: any = [];
  if (data && data.length > 0) {
    data.forEach((ele: any) => {

      let isCut = "否";
      if (ele.is_tailoring === "yes") {
        isCut = "是";
      }
      const currentRow: any = [
        "", "", ele.module, ele.subtask_dev_needs,
        ele.task_name, ele.desc, ele.task_type_name, ele.priority,
        "", "", "", "",
        ele.estimate, "", "", "",
        "", "", "", ele.assigned_person_name,
        "", "", "", "",
        "", "", "", "",
        "", "", ele.belongs_name, "",
        ele.tasksource_name, "", isCut
      ];
      rowData.push(currentRow);
    });
  }

  return {column, rowData};
};

// 项目模板
const getProjectTempTable = (data: any) => {

  const column = [
    {name: "所属执行"}, {name: "所属模块"}, {name: "相关需求"}, {name: "指派给"},
    {name: "任务名称"}, {name: "任务描述"}, {name: "任务类型"}, {name: "优先级"},
    {name: "最初预计"}, {name: "预计开始"}, {name: "截止日期"}, {name: "所属端"},
    {name: "任务来源"}, {name: "是否裁剪"}];

  const rowData: any = [];
  if (data && data.length > 0) {
    data.forEach((ele: any) => {

      let isCut = "否";
      if (ele.is_tailoring === "yes") {
        isCut = "是";
      }
      // 某些本平台没有的对应项，直接赋值为空即可。
      const currentRow: any = [
        "", ele.module, ele.subtask_dev_needs, ele.assigned_person_name,
        ele.task_name, ele.desc, ele.task_type_name, ele.priority,
        ele.estimate, "", "", ele.belongs_name,
        ele.tasksource_name, isCut
      ];

      rowData.push(currentRow);
    });
  }

  return {column, rowData};
};

// 获取导出的数据以及table模板
const getTempTable = (data: any, tempType: string) => {

  let column = [];
  let rowData = [];

  // 根据不同的模板类型解析不同的数据和表格内容
  if (tempType === "auxiliaryReleaseCheck" || tempType === "comprehensiveReleaseCheck") {
    const tbInfo = getOnlineCheckTempTable(data);
    column = tbInfo.column;
    rowData = tbInfo.rowData;
  } else {
    const tbInfo = getProjectTempTable(data);
    column = tbInfo.column;
    rowData = tbInfo.rowData;
  }

  const tableInfo = {
    name: "processTable", // 表格名称
    ref: "A1",
    style: {
      theme: 'TableStyleMedium9',
      showRowStripes: true,  // 用交替的背景色显示行
    },
    columns: column,
    rows: rowData,
  };

  return tableInfo;
};
/* endregion */

// 正则表达式验证table sheet名是否可用（不可用则进行处理）
const vertifyFileName = (stName: string) => {
  let sheetName = stName;
  // 工作表名规则：不能包含有 \  /  ?  *  [  ]  这几种特殊字符，名称的开始和结尾不能有单引号
  if (stName.startsWith("'") || stName.endsWith("'")) {
    sheetName = stName.replaceAll("'", "")
  }

  // 正则表达式匹配 \  /  ?  *  [  ]
  const reg = /\/|\?|\*|\[|\]|\\/g;
  sheetName = sheetName.replaceAll(reg, "-");

  return sheetName;
};

export {
  getTempTable,
  vertifyFileName
}

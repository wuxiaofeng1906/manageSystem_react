// 定义列名
export const colums = () => {
  const component: any = [
    {
      headerName: 'NO.',
      field: 'NO',
      maxWidth: 70,
    },
    {
      headerName: '任务名称',
      field: 'taskName',
      minWidth: 170,
    },
    {
      headerName: '开始时间',
      field: 'starttime',
      minWidth: 170,
    },
    {
      headerName: '结束时间',
      field: 'endtime',
      minWidth: 170,
    },
    {
      headerName: '执行用户',
      field: 'excUser',
      minWidth: 90,
    },
    {
      headerName: '任务状态',
      field: 'excStatus',
      minWidth: 100,
      cellRenderer: (params: any) => {
        if (params.value === "ABORTED ") {
          return `<span style="font-size: medium; color:gray">aborted</span>`;
        }

        if (params.value === null) {
          return `<span style="font-size: medium; color:#46A0FC">running</span>`;
        }
        if (params.value === "SUCCESS") {
          return `<span style="font-size: medium; color:#32D529">success</span>`;
        }

        if (params.value === "FAILURE") {
          return `<span style="font-size: medium;color: red">failure</span>`;
        }
        return `<span style="font-size: medium;">${params.value}</span>`;
      }
    },
    {
      headerName: '执行结果',
      field: 'excResult',
      minWidth: 100,
      cellRenderer: (params: any) => {
        if (params.value === "ABORTED ") {
          return `<span style="font-size: medium; color:gray">aborted</span>`;
        }

        if (params.value === null) {
          return `<span style="font-size: medium; "> </span>`;
        }
        if (params.value === "SUCCESS") {
          return `<span style="font-size: medium; color:#32D529">success</span>`;
        }

        if (params.value === "FAILURE") {
          return `<span style="font-size: medium;color: red">failure</span>`;
        }
        return `<span style="font-size: medium;">${params.value}</span>`;
      }
    },
    {
      headerName: '严重bug生成到禅道',
      field: 'releaseToZt',
      minWidth: 90,
      cellRenderer: (params: any) => {
        if (params.value === "yes") {
          return "是";
        }
        return "否";
      }
    },
    {
      headerName: 'bug指派人',
      field: 'bugAssignedTo',
      minWidth: 90,
    },
    {
      headerName: '操作',
      minWidth: 130,
      cellRenderer: (params: any) => {

        const paramData = JSON.stringify(params.data);
        return `
             <a href="${params.data.taskLog}" target="_blank" >
               <img src="../logs.png" width="20" height="20" alt="任务日志" title="任务日志">
             </a>
             <a href="${params.data.url}" target="_blank" >
               <img src="../taskUrl.png" width="20" height="20" alt="任务URL" title="任务URL">
             </a>
            <Button  style="border: none; background-color: transparent; font-size: small; color: #46A0FC" onclick='showParams(${paramData})'>
              <img src="../params.png" width="20" height="20" alt="执行参数" title="执行参数">
            </Button>`;
      }
    }
  ];

  return component;
};

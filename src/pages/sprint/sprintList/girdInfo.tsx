// 定义列名
import { history } from '@@/core/history';
import dayjs from 'dayjs';

const colums = () => {
  const component = new Array();
  component.push(
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      maxWidth: 50,
      pinned: 'left',
    },
    {
      headerName: 'NO.',
      maxWidth: 70,
      filter: false,
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    },
    {
      headerName: '项目名称',
      field: 'name',
      minWidth: 186,
      cellRenderer: 'linkRecord',
      // cellRenderer: (params: any) => {
      //   if (params.value === 'emergency20210728') {
      //     return `<a  style="color:blue;text-decoration: underline" >多组织阻塞bug跟踪</a>`;
      //   }
      //   if (params.value === 'emergency20210930') {
      //     return `<a  style="color:blue;text-decoration: underline" >线上问题跟踪</a>`;
      //   }
      //   return `<a  style="color:blue;text-decoration: underline" >${params.value}</a>`;
      // },
      // onCellClicked: (params: any) => {
      //   // console.log('params', params.data);
      //   if (params.data.name === 'emergency20210728') {
      //     history.push(
      //       `/sprint/sprintListDetails?projectid=${params.data.id}&project=多组织阻塞bug跟踪&ztId=${params.data.ztId}`,
      //     );
      //   } else if (params.value === 'emergency20210930') {
      //     history.push(
      //       `/sprint/sprintListDetails?projectid=${params.data.id}&project=线上问题跟踪&ztId=${params.data.ztId}`,
      //     );
      //   } else {
      //     history.push(
      //       `/sprint/sprintListDetails?projectid=${params.data.id}&project=${params.data.name}&ztId=${params.data.ztId}`,
      //     );
      //   }
      // },
    },
    {
      headerName: '开始时间',
      field: 'startAt',
      minWidth: 124,
    },
    {
      headerName: '提测截止日期',
      field: 'testEnd',
      minWidth: 124,
    },
    {
      headerName: '测试完成日期',
      field: 'testFinish',
      minWidth: 124,
    },
    {
      headerName: '计划灰度日期',
      field: 'expStage',
      minWidth: 124,
    },
    {
      headerName: '计划上线日期',
      field: 'expOnline',
      minWidth: 124,
    },
    {
      headerName: '创建日期',
      field: 'createAt',
      minWidth: 124,
      cellRenderer: (params: any) => {
        return dayjs(params.value).format('YYYY-MM-DD');
      },
    },
    {
      headerName: '创建人',
      field: 'creator',
      minWidth: 80,
    },
    {
      headerName: '状态',
      field: 'status',
      minWidth: 80,
      cellRenderer: (params: any) => {
        let returnValue = '';
        switch (params.value) {
          case 'closed':
            returnValue = '已关闭';
            break;
          case 'wait':
            returnValue = '未开始';
            break;
          case 'doing':
            returnValue = '进行中';
            break;

          case 'suspended':
            returnValue = '已挂起';
            break;
          default:
            returnValue = params.value;
            break;
        }

        return returnValue;
      },
    },
    {
      headerName: '去禅道',
      field: 'ztId',
      minWidth: 80,
      cellRenderer: (params: any) => {
        return `<a target="_blank" style="color:blue;text-decoration: underline" href='http://zentao.77hub.com/zentao/execution-task-${params.value}.html'>去禅道</a>`;
      },
    },
    {
      headerName: '来源',
      field: 'type',
      // minWidth: 70,
      cellRenderer: (params: any) => {
        if (params.value === 'AUTO') {
          return '自动';
        }
        return '人工';
      },
    },
  );

  return component;
};

export { colums };

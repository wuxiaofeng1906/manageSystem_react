import type { ColDef,GridReadyEvent,GridApi } from 'ag-grid-community';
import cls from 'classnames';

const STATUS_MAP = [
    {label:'空',value:'unknown',key:'unknown'},
    {label:'是',value:'yes',key:'yes'},
    {label:'否',value:'no',key:'no'},
]
const WEAPPENV = [
    {label:'beta',value:'beta',key:'beta'},
    {label:'development',value:'development',key:'development'},
    {label:'production',value:'production',key:'production'},
]
const PUBLISH_RESULT=[
    {label:'空',value:'unknown',key:'unknown'},
    // {label:'取消发布',value:'cancel',key:'cancel'},
    {label:'发布成功',value:'success',key:'success'},
    {label:'发布失败',value:'feature',key:'feature'},
];
const SETTING_STATUS = [
    { label: '进行中', value: 'doing', key: 'blue' },
    { label: '已关闭', value: 'closed', key: 'green' },
    { label: '未开始', value: 'wait', key: '' },
    { label: '已挂起', value: 'suspended', key: 'gold' },
];
const MENUS = [
    { label: '项目&服务', key: 'projectServices' },
    { label: '部署', key: 'deploy' },
    { label: '检查', key: 'check' },
    // { label: '工单', key: 'worksheet' },
    // { label: '发布', key: 'publish' },
    // { label: '总览', key: 'overview' },
  ];  

const initColDef: ColDef = { resizable: true, suppressMenu: true };

const onGridReady = (params: GridReadyEvent,ref: React.MutableRefObject<GridApi | undefined>) => {
    ref.current = params.api;
    params.api.sizeColumnsToFit();
  };

/*
    ref：绑定当前grid-react ref参数,
    border:默认有边框
    options:其他colDef配置参数
*/ 
const initGridTable = (ref: React.MutableRefObject<GridApi | undefined>,border=true,options?: ColDef)=>({
    className:cls('ag-theme-alpine', 'ag-initialize-theme'),
    defaultColDef:{...initColDef,...(border? { cellStyle: { 'border-right': 'solid 0.5px #E3E6E6' }}:{}), ...options},
    onGridReady:(v: GridReadyEvent)=>onGridReady(v, ref),
    onGridSizeChanged:(v: GridReadyEvent)=>onGridReady(v, ref)
})

export {STATUS_MAP ,PUBLISH_RESULT,SETTING_STATUS,MENUS,WEAPPENV,initGridTable};

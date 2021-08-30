import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import type {GridApi, GridReadyEvent} from 'ag-grid-community';
import type {GqlClient} from '@/hooks';
import {useGqlClient, useQuery} from '@/hooks';
import {Button, DatePicker, Form, Select} from 'antd';
import {LogoutOutlined} from '@ant-design/icons';
import {getHeight} from '@/publicMethods/pageSet';
import moment from "moment";
import {useRequest} from "ahooks";
import dayjs from 'dayjs';

const {RangePicker} = DatePicker;
const {Option} = Select;

// 格式化单元格内容
const cellFormat = (params: any) => {

  if (Number(params.value)) {
    const numbers = params.value.toString();
    if (numbers.indexOf(".") > -1) { // 判断有无小数点
      return Number(params.value).toFixed(2);
    }
    return Number(params.value);
  }
  return 0;
};

// 定义列名
const getSourceColums = () => {
  // 定义的原始字段
  const oraFields: any = [
    {
      headerName: '创建日期',
      field: 'finiStory',
      minWidth: 105,
      pinned: 'left',
    },
    {
      headerName: '新增',
      field: 'finiStory',
      minWidth: 80,
      pinned: 'left',
    },
    {
      headerName: '状态',
      field: 'finiStory',
      minWidth: 80,
      pinned: 'left',
    },
    {
      headerName: '级别',
      field: 'finiStory',
      minWidth: 80,
      pinned: 'left',
    },
    {
      headerName: '初始',
      field: 'finiStory',
      minWidth: 80,
      pinned: 'left',
    }

  ];


  return oraFields;
};

// 公共查询方法
const queryFrontData = async (client: GqlClient<object>, params: any) => {

  const {data} = await client.query(`{
          dashFront(start:"${params.start}",end:"${params.end}"){

          }

      }
  `);


  return data?.dashFront;
};

const GetSprintProject = () => {
  const projectArray = [];

  const {data: {project = []} = {}} = useQuery(`{
        project(range:{start:"", end:""},,order:DESC){
        id
        name
      }
    }`);

  for (let index = 0; index < project.length; index += 1) {
    projectArray.push(
      <Option key={project[index].id.toString()} value={project[index].id.toString()}> {project[index].name}</Option>,
    );
  }
  return projectArray;
};

const FrontTableList: React.FC<any> = () => {
  const g_currentMonth_range = {
    start: dayjs().startOf('week').format("YYYY-MM-DD"),
    end: dayjs().endOf('week').format("YYYY-MM-DD")
  };

  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() => queryFrontData(gqlClient, g_currentMonth_range),);
  const gridApiForFront = useRef<GridApi>();
  const onSourceGridReady = (params: GridReadyEvent) => {
    gridApiForFront.current = params.api;
    params.api.sizeColumnsToFit();
  };

  if (gridApiForFront.current) {
    if (loading) gridApiForFront.current.showLoadingOverlay();
    else gridApiForFront.current.hideOverlay();
  }

  // 表格的屏幕大小自适应
  const [sourceGridHeight, setGridHeight] = useState(Number(getHeight()));
  window.onresize = function () {
    setGridHeight(Number(getHeight()) - 64);
    gridApiForFront.current?.sizeColumnsToFit();
  };

  const [choicedCondition, setQueryConditionForSource] = useState({
    prjName: [],
    start: g_currentMonth_range.start,
    end: g_currentMonth_range.end
  });

  //  默认显示
  const showSourceDefaultData = async () => {
    setQueryConditionForSource({
      prjName: [],
      start: g_currentMonth_range.start,
      end: g_currentMonth_range.end
    });
    const datas: any = await queryFrontData(gqlClient, g_currentMonth_range);
    gridApiForFront.current?.setRowData(datas);
  };

  // 时间选择事件： 查询范围：选中的时间中开始时间的周一，和结束时间的周末
  const onSourceTimeSelected = async (params: any, dateString: any) => {

    setQueryConditionForSource({
      ...choicedCondition,
      start: dateString[0],
      end: dateString[1]
    });

    const range = {
      prjNames: choicedCondition.prjName,
      start: dateString[0],
      end: dateString[1]
    };

    const datas: any = await queryFrontData(gqlClient, range);
    gridApiForFront.current?.setRowData(datas);

  };

  // 项目名称选择事件
  const prjNameChanged = async (value: any, params: any) => {

    const range = {
      prjNames: value,
      start: choicedCondition.start,
      end: choicedCondition.end
    };

    const datas: any = await queryFrontData(gqlClient, range);
    gridApiForFront.current?.setRowData(datas);

  };


  return (
    <PageContainer>

      <div>
        {/* 查询条件 */}
        <div style={{width: '100%', height: 45, marginTop: 5, backgroundColor: "white"}}>
          <Form.Item>

            <label style={{marginLeft: '10px'}}>项目名称：</label>
            <Select placeholder="请选择" style={{width: '20%'}} mode="multiple" maxTagCount={'responsive'} showSearch
                    optionFilterProp="children"
                    onChange={prjNameChanged}>
              {GetSprintProject()}
            </Select>

            <label style={{marginLeft: "20px", marginTop: 7}}>查询周期：</label>
            <RangePicker
              style={{width: '20%', marginTop: 7}} onChange={onSourceTimeSelected}
              value={[choicedCondition.start === "" ? null : moment(choicedCondition.start),
                choicedCondition.end === "" ? null : moment(choicedCondition.end)]}
            />

            <Button type="text" style={{marginLeft: "20px", color: 'black'}}
                    icon={<LogoutOutlined/>} size={'small'} onClick={showSourceDefaultData}>
              默认：</Button>
            <label style={{marginLeft: "-10px", color: 'black'}}> 默认1周</label>

          </Form.Item>

        </div>

        {/* 数据表格 */}
        <div className="ag-theme-alpine" style={{height: sourceGridHeight, width: '100%', marginTop: 10}}>
          <AgGridReact
            columnDefs={getSourceColums()} // 定义列
            rowData={data} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              flex: 1,
              cellStyle: {"line-height": "28px"},
              suppressMenu: true,
            }}
            autoGroupColumnDef={{
              minWidth: 250,
              // sort: 'asc'
            }}
            rowSelection={'multiple'} // 设置多行选中
            groupDefaultExpanded={9} // 展开分组
            suppressAggFuncInHeader={true} // 不显示标题聚合函数的标识
            rowHeight={30}
            headerHeight={35}

            onGridReady={onSourceGridReady}
            suppressScrollOnNewData={false}
          >

          </AgGridReact>
        </div>

      </div>

    </PageContainer>
  );
};

export default FrontTableList;

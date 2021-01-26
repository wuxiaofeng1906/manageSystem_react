import React, {useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';
import moment from 'moment';
import {getWeeksRange, getMonthWeek} from '@/publicMethods/timeMethods';
import {forEach} from "ag-grid-community/dist/lib/utils/array"; // 引用 publicMethods/timeMethods中的方法

// 获取近四周的时间范围
const weekRanges = getWeeksRange(4);


const colums = () => {
  const component = new Array();
  component.push(
    {
      headerName: '组名',
      field: 'dept.name',
      showRowGroup: 'dept',
      rowGroup: true,
      hide: true,
    },
    {
      headerName: '所属部门',
      field: 'dept.parent',
    },
    {
      headerName: '姓名',
      field: 'userName',
    },
  );

  for (let index = weekRanges.length - 1; index >= 0; index -= 1) {
    const starttime = weekRanges[index].from;
    const weekName = getMonthWeek(starttime);
    component.push({
      headerName: weekName,
      children: [
        {
          headerName: '结构覆盖率',
          field: `instCove${index.toString()}`,
          cellRenderer: coverageCellRenderer,
        },
        {
          headerName: '分支覆盖率',
          field: `branCove${index.toString()}`,
          cellRenderer: coverageCellRenderer,
        },
      ],
    });
  }
  return component;
};


const queryDevelopViews = async (client: GqlClient<object>) => {
  // 用来存储结果数据

  const tempDataArray: string | any[] = [];
  for (let index = weekRanges.length - 1; index >= 0; index -= 1) {
    const starting: any = weekRanges[index].from;
    const ending = weekRanges[index].to;
    // 需要时间  ,starttime:[${starting}],endtime:[${ending}]
    const {data} = await client.query(`
       {
         detailCover(side:BACKEND){
          userName
          dept{
            name
            parent
          }
          instCove
          branCove
        }
      }
    `);

    // 重命名数组中的key
    const timeOfData = JSON.parse(JSON.stringify(data?.detailCover).replace(/branCove/g, `branCove${index.toString()}`).replace(/instCove/g, `instCove${index.toString()}`));

    // 将所有数据放到一个数组中
    for (let i = 0; i < timeOfData.length; i += 1) {
      tempDataArray.push(timeOfData[i]);
    }
  }
 // 需要重新解析数据，将相同姓名的数组放到一个对象中
  return dealData(tempDataArray);
};


function dealData(tempDataArray: any) {
  const resultDataArray: string | any[] = [];

  // 首先需要获取所有已有的人名。
  let userNames = new Array();
  for (let i = 0; i < tempDataArray.length; i += 1) {
    userNames.push(tempDataArray[i].userName);
  }
  userNames = Array.from(new Set(userNames));

  // 将相同人名的属性放到一起
  for (let userIndex = 0; userIndex < userNames.length; userIndex += 1) {
    // 声明一个对象
    const objectStr = {};
    for (let i = 0; i < tempDataArray.length; i += 1) {
      // 当姓名相等，则把属性放到一起
      if (userNames[userIndex] === tempDataArray[i].userName) {
        // 遍历属性
        Object.keys(tempDataArray[i]).forEach((key) => {
          objectStr[key] = tempDataArray[i][key];
        });
      }
    }
    // 再把最终的对象放到数组中
    resultDataArray.push(objectStr);
  }
  console.log('resultDataArray',resultDataArray);
  return resultDataArray;
}

// 表格代码渲染
function coverageCellRenderer(params: any) {
  let values: number = 0;
  if (params.value === '' || params.value == null) {
    values = 0;
  } else {
    values = params.value;
  }
  if (values === 0) {
    return ` <span style="color: dodgerblue">  ${values} </span> `;
  }
  return values.toString();
}


const BackendTableList: React.FC<any> = () => {
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() =>

    queryDevelopViews(gqlClient),
  );


  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  if (gridApi.current) {
    if (loading) gridApi.current.showLoadingOverlay();
    else gridApi.current.hideOverlay();
  }

  return (
    <PageContainer>
      <div className="ag-theme-alpine" style={{height: 700, width: '100%'}}>
        <AgGridReact
          columnDefs={colums()} // 定义列
          rowData={data} // 数据绑定
          defaultColDef={{
            resizable: true,
            sortable: true,
            // floatingFilter: true,
            filter: true,
            flex: 1,
            minWidth: 100,
          }}
          autoGroupColumnDef={{
            minWidth: 100,
          }}
          groupDefaultExpanded={9} // 展开分组
          suppressDragLeaveHidesColumns // 取消分组时，例如单击删除区域中某一列上的“ x” ，该列将不可见
          suppressMakeColumnVisibleAfterUnGroup // 如果用户在移动列时不小心将列移出了网格，但并不打算将其隐藏，那么这就很方便。
          // rowGroupPanelShow="always"
          onGridReady={onGridReady}
        >
        </AgGridReact>
      </div>
    </PageContainer>
  );
};

export default BackendTableList;

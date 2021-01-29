import React, {useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';
import {getWeeksRange, getMonthWeek} from '@/publicMethods/timeMethods';

// 获取近四周的时间范围
const weekRanges = getWeeksRange(4);
// const InstGroupValues = [{time:"instCove2021-01-04",group:"2组-项目、预算",values:"11"},{time:"instCove2021-01-11",group:"2组-项目、预算",values:"22"},{time:"instCove2021-01-18",group:"2组-项目、预算",values:"33"}];
const InstGroupValues: any[] = [];
const branGroupValues: any[] = [];

/* 定义列名 */
const colums = () => {
  const component = new Array();
  component.push(
    {
      headerName: '所属部门',
      field: 'dept',
      rowGroup: true,
      hide: true,
    },
    {
      headerName: '组名',
      field: 'group',
      rowGroup: true,
      hide: true,

    },
    {
      headerName: '姓名',
      field: 'username',
    },
  );

  for (let index = weekRanges.length - 1; index >= 0; index -= 1) {
    const endtime = weekRanges[index].to;
    const weekName = getMonthWeek(endtime);
    component.push({
      headerName: weekName,
      children: [
        {
          headerName: '结构覆盖率',
          field: `instCove${endtime.toString()}`,
          type: "numericColumn",
          aggFunc: instCoveRender,
          cellRenderer: coverageCellRenderer,
        },
        {
          headerName: '分支覆盖率',
          field: `branCove${endtime.toString()}`,
          type: "numericColumn",
          aggFunc: branCoveRender,
          cellRenderer: coverageCellRenderer,
        },
      ],
    });
  }
  return component;
};

// 合并结构列渲染
function instCoveRender(values: any) {
  console.log("values", values);
  for (let i = 0; i < InstGroupValues.length; i += 1) {
    const datas = InstGroupValues[i];
    if (values.colDef.field === datas.time && values.rowNode.key === datas.group) {
      return ` <span style="font-weight: bold">  ${datas.values} </span> `;
      // return datas.values;
      break;
    }
  }
  return "";
}

// 合并分支列渲染
function branCoveRender(values: any) {
  for (let i = 0; i < branGroupValues.length; i += 1) {
    const datas = branGroupValues[i];
    if (values.colDef.field === datas.time && values.rowNode.key === datas.group) {
      return ` <span style="font-weight: bold">  ${datas.values} </span> `;
      // return datas.values;
      break;
    }
  }
  return "";
}

const queryDevelopViews = async (client: GqlClient<object>) => {

  const timeRange = new Array();
  for (let index = 0; index <weekRanges.length; index += 1) {
    timeRange.push(`"${weekRanges[index].to}"`);
  }
  // 求出开始时间和结束时间
  const start =`"${weekRanges[0].from}"` ;
  const ends = `[${timeRange.join(",")}]`;

  // const ends = `"["2021-01-10","2021-01-17","2021-01-24","2021-01-31"]"`;
  const {data} = await client.query(`
       {
        detailCover(side:BACKEND,start:${start},ends:${ends}){
          datas{
            id
            side
            name
            parent
            instCove
            branCove
            order{
              start
              end
            }
            users{
              userName
              instCove
              branCove
            }
          }
        }

      }
    `);

  const objectValues = addGroupAndDept(data?.detailCover);
  return dealData(objectValues);
};


function addGroupAndDept(oraDatas: any) {
  const objectDataArray: string | any[] = [];
  for (let index = 0; index < oraDatas.length; index += 1) {

    if (oraDatas[index] !== null) {
      const weekDatas = oraDatas[index].datas;
      if (weekDatas !== null) {
        for (let i = 0; i < weekDatas.length; i += 1) {
          const groupInfo = weekDatas[i].name;
          const deptInfo = weekDatas[i].parent;
          const userInfo = weekDatas[i].users;
          const orderTime = weekDatas[i].order.end;
          // 此代码处理组的覆盖率,将组的单元测试覆盖率存到全局变量
          InstGroupValues.push({
            time: `instCove${orderTime}`,
            group: groupInfo,
            values: weekDatas[i].instCove
          });

          branGroupValues.push({
            time: `branCove${orderTime}`,
            group: groupInfo,
            values: weekDatas[i].branCove
          });

          // 此循环用于处理个人的覆盖率
          for (let index2 = 0; index2 < userInfo.length; index2 += 1) {
            objectDataArray.push({
              group: groupInfo,
              dept: deptInfo,
              username: userInfo[index2].userName,
              [`instCove${orderTime}`]: userInfo[index2].instCove,
              [`branCove${orderTime}`]: userInfo[index2].branCove
            });
          }
        }
      }
    }
  }
  return objectDataArray;
};


function dealData(tempDataArray: any) {
  const resultDataArray: string | any[] = [];

  // 首先需要获取所有已有的人名。
  let userNames = new Array();
  for (let i = 0; i < tempDataArray.length; i += 1) {
    userNames.push(tempDataArray[i].username);
  }
  userNames = Array.from(new Set(userNames));

  // 将相同人名的属性放到一起
  for (let userIndex = 0; userIndex < userNames.length; userIndex += 1) {
    // 声明一个对象
    const objectStr = {};
    for (let i = 0; i < tempDataArray.length; i += 1) {
      // 当姓名相等，则把属性放到一起
      if (userNames[userIndex] === tempDataArray[i].username) {
        // 遍历属性
        Object.keys(tempDataArray[i]).forEach((key) => {
          objectStr[key] = tempDataArray[i][key];
        });
      }
    }
    // 再把最终的对象放到数组中
    resultDataArray.push(objectStr);
  }
  console.log('resultDataArray', resultDataArray);
  return resultDataArray;
}

// 表格代码渲染
function coverageCellRenderer(params: any) {
  // 判断是否包含属性
  if (params.hasOwnProperty("value")) {
    if (params.value === "0.00") {
      return ` <span style="color: dodgerblue">  ${0} </span> `;
    }
    return params.value;
  }
  return ` <span style="color: dodgerblue">  ${0} </span> `;
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
      <div className="ag-theme-alpine" style={{height: 1000, width: '100%'}}>
        <AgGridReact
          columnDefs={colums()} // 定义列
          rowData={data} // 数据绑定
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            flex: 1,
            allowedAggFuncs: ['sum', 'min', 'max']
          }}
          autoGroupColumnDef={{
            maxWidth: 300,
          }}
          groupDefaultExpanded={9} // 展开分组
          // pivotColumnGroupTotals={'always'}
          // groupHideOpenParents={true}  // 组和人名同一列

          // rowGroupPanelShow={'always'}  可以拖拽列到上面
          onGridReady={onGridReady}
        >
        </AgGridReact>
      </div>
    </PageContainer>
  );
};

export default BackendTableList;

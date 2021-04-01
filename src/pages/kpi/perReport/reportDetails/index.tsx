import React, {useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';

// import { AllCommunityModules } from '@ag-grid-community/all-modules';

// const modules= AllCommunityModules;
const Parsing = (params: any) => {
  const kpiResult: any = new Array();
  const {datas} = params[0];
  if (datas !== null) {
    for (let index = 0; index < datas.length; index += 1) {
      let kpiScore: number = 0;
      const {kpis} = datas[index];
      for (let m = 0; m < kpis.length; m += 1) {
        kpiResult.push({
          userName: datas[index].user.userName,
          deptName: datas[index].user.parentName,
          groupName: datas[index].user.deptName,
          kpiName: kpis[m].kpiName,
          weight: kpis[m].weight,
          target: kpis[m].target,
          actual: kpis[m].actual,
          ratio: kpis[m].ratio,
          score: kpis[m].score,
        });

        kpiScore += (Number(kpis[m].weight) / 100 * Number(kpis[m].score));
      }

      kpiResult.push({
        userName: datas[index].user.userName,
        deptName: datas[index].user.parentName,
        groupName: datas[index].user.deptName,
        kpiName: "量化指标得分",
        score: kpiScore,
      });
    }
  }

  return kpiResult;
};

// 查询数据
const queryDevelopViews = async (client: GqlClient<object>) => {

  const {data} = await client.query(`
      {
        kpiReports(kind: "3", ends: ["2021-03-31"],identity:DEV){
                  range{
              start
              end
            }
            datas{
              user{
                      id
                userName
                tech
                deptName
                parentName
              }
              kpis{
                kpiIndex
                kpiName
                weight
                target
                actual
                ratio
                score
              }
            }
          }
      }
  `);

  return Parsing(data?.kpiReports);

  // return [
  //   {
  //     name1: "研发部一",
  //     name2: "2组",
  //     name3: "谭小杰",
  //     name4: "指标1",
  //     name5: "666",
  //     name6: "666",
  //     name7: "666",
  //     name8: "666",
  //     name9: "666",
  //   }, {
  //     name1: "研发部一",
  //     name2: "2组",
  //     name3: "谭小杰",
  //     name4: "指标2",
  //     name5: "888",
  //     name6: "888",
  //     name7: "888",
  //     name8: "888",
  //     name9: "888",
  //   }, {
  //     name1: "研发部一",
  //     name2: "2组",
  //     name3: "谭小杰",
  //     name4: "指标3",
  //     name5: "999",
  //     name6: "999",
  //     name7: "999",
  //     name8: "999",
  //     name9: "999",
  //   }, {
  //     name1: "研发部二",
  //     name2: "1组",
  //     name3: "欢姐姐",
  //     name4: "指标1",
  //     name5: "111",
  //     name6: "111",
  //     name7: "111",
  //     name8: "111",
  //     name9: "111",
  //   }, {
  //     name1: "研发部二",
  //     name2: "1组",
  //     name3: "欢姐姐",
  //     name4: "指标2",
  //     name5: "222",
  //     name6: "222",
  //     name7: "222",
  //     name8: "222",
  //     name9: "222",
  //   }, {
  //     name1: "研发部二",
  //     name2: "1组",
  //     name3: "欢姐姐",
  //     name4: "指标3",
  //     name5: "333",
  //     name6: "333",
  //     name7: "333",
  //     name8: "333",
  //     name9: "333",
  //   }, {
  //     name4: "量化指标得分",
  //     name9: "333",
  //   },
  // ];
};

// 组件初始化
const SprintList: React.FC<any> = () => {

  const colums = () => {
    const component = new Array();
    component.push(
      {
        headerName: '部门',
        field: 'deptName',
        cellRenderer: (params: any) => {
          if (params.data.kpiName === "量化指标得分") {
            return "";
          }
          return params.value;
        },

        colSpan: (params: any) => {
          if (params.data.kpiName === "量化指标得分") {
            return 3;
          }
          return 1;
        },
      }, {
        headerName: '组名',
        field: 'groupName',
        sort: 'asc',
        cellRenderer: (params: any) => {
          if (params.data.kpiName === "量化指标得分") {
            return "";
          }
          return params.value;
        },
      },
      {
        headerName: '姓名',
        field: 'userName',
        cellRenderer: (params: any) => {
          if (params.data.kpiName === "量化指标得分") {
            return "";
          }
          return params.value;
        },
        rowSpan: () => {
          return 7;
        }

      },
      {
        headerName: '指标名称',
        field: 'kpiName',
        cellRenderer: (params: any) => {
          if (params.value === "量化指标得分") {
            return `<span style="font-weight: bold ;color:green"> ${params.value} </span>`;
          }
          return params.value;
        },
        colSpan: (params: any) => {
          if (params.data.kpiName === "量化指标得分") {
            return 5;
          }
          return 1;
        },
      },
      {
        headerName: '权重',
        field: 'weight',
        cellRenderer: (params: any) => {

          return `${params.value}%`;
        }
      },
      {
        headerName: '目标值',
        field: 'target',
      },
      {
        headerName: '实际值',
        field: 'actual',
        cellRenderer: (params: any) => {
          return Number(params.value).toFixed(2);
        }
      },
      {
        headerName: '目标完成率',
        field: 'ratio',
        cellRenderer: (params: any) => {
          return Number(params.value).toFixed(2);
        }
      },
      {
        headerName: '单项指标得分',
        field: 'score',

        cellRenderer: (params: any) => {
          if (params.data.kpiName === "量化指标得分") {
            return `<span style="font-weight: bold ;color:green"> ${Number(params.value).toFixed(2)} </span>`;
          }
          return Number(params.value).toFixed(2);
        }
      }
    );

    return component;
  };

  /* region  表格相关事件 */
  const gridApi = useRef<GridApi>(); // 绑定ag-grid 组件
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() => queryDevelopViews(gqlClient));

  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();

  };

  if (gridApi.current) {
    if (loading) gridApi.current.showLoadingOverlay();
    else gridApi.current.hideOverlay();
  }

  /* endregion */


  // 返回渲染的组件
  return (
    <PageContainer>

      <div className="ag-theme-alpine" style={{height: 1000, width: '100%'}}>
        <AgGridReact
          // modules={AllCommunityModules}

          columnDefs={colums()} // 定义列
          rowData={data} // 数据绑定
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            flex: 1,
            minWidth: 100,

          }}
          autoGroupColumnDef={{
            minWidth: 100,
          }}
          groupDefaultExpanded={9} // 展开分组
          onGridReady={onGridReady}
          suppressRowTransform={true}
        >

        </AgGridReact>
      </div>

    </PageContainer>
  );
};
export default SprintList;

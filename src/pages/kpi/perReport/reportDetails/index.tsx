import React, {useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';
import {getHeight, customRound} from "@/publicMethods/pageSet";

const Parsing = (params: any) => {
  const kpiResult: any = new Array();
  const {datas} = params[0];
  if (datas !== null) {
    for (let index = 0; index < datas.length; index += 1) {
      let deptname = "";
      let kpiScore: number = 0;
      const {kpis} = datas[index];
      for (let m = 0; m < kpis.length; m += 1) {
        if (datas[index].user.userName !== "陈诺" && datas[index].user.userName !== "王润燕") {

          if (datas[index].user.deptName === "前端平台研发部" || datas[index].user.deptName === "平台研发部") {
            deptname = datas[index].user.deptName;
          } else {
            deptname = datas[index].user.parentName;
          }
          kpiResult.push({
            userName: datas[index].user.userName,
            deptName: deptname,
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

      }

      if (datas[index].user.userName !== "陈诺" && datas[index].user.userName !== "王润燕") {

        kpiResult.push({
          userName: datas[index].user.userName,
          deptName: deptname,
          groupName: datas[index].user.deptName,
          kpiName: "量化指标得分",
          score: kpiScore,
        });
      }

    }
  }

  return kpiResult;
};

const parsingProduct = (params: any) => {
  const kpiResult: any = new Array();
  const {datas} = params[0];
  if (datas !== null) {
    for (let index = 0; index < datas.length; index += 1) {
      let deptname = "";
      let kpiScore: number = 0;
      const {kpis} = datas[index];
      for (let m = 0; m < kpis.length; m += 1) {

        if (datas[index].user.deptName === "产品管理部") {
          deptname = datas[index].user.deptName;
        } else {
          deptname = datas[index].user.parentName;
        }

        const weightval = kpis[m].weight;
        const actvalue = Number(customRound(Number(kpis[m].actual), 2));
        const tarvalue = Number(kpis[m].target);

        let tarRate = 0;
        if (actvalue > 0) {  // 实际值<0  ==>  分母为0时，则目标完成率直接为100；
          // console.log("tarRate", tarvalue, actvalue, tarvalue / actvalue * 100);

          tarRate = tarvalue / actvalue * 100;
          if (tarRate > 100) {  // 算出来的实际目标完成率 > 100,值也为100
            tarRate = 100;
          }
        } else {
          tarRate = 100;
        }

        kpiResult.push({
          userName: datas[index].user.userName,
          deptName: deptname,
          groupName: datas[index].user.deptName,
          kpiName: kpis[m].kpiName,
          weight: weightval,
          target: tarvalue,
          actual: actvalue,
          ratio: tarRate,
          score: tarRate,
        });
        kpiScore += weightval / 100 * tarRate;

      }
      kpiResult.push({
        userName: datas[index].user.userName,
        deptName: deptname,
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
  // 开发
  const devloper = await client.query(`
      {
        kpiReports(kind: "3", ends: ["2021-03-31"],identity:DEVELOPER){
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
  const devData = Parsing(devloper.data?.kpiReports);
  // 测试
  const tester = await client.query(`
      {
        kpiReports(kind: "3", ends: ["2021-03-31"],identity:TESTER){
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
  const testerData = Parsing(tester.data?.kpiReports);
  // 产品
  const product = await client.query(`
      {
        kpiReports(kind: "3", ends: ["2021-03-31"],identity:PRODUCER){
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
  const productData = parsingProduct(product.data?.kpiReports);

  // return productData;
  return devData.concat(testerData).concat(productData);

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
            return `<span style="font-weight: bold ;color:black"> ${params.value} </span>`;
          }
          return params.value;
        },
      }, {
        headerName: '组名',
        field: 'groupName',
        sort: 'asc',
        cellRenderer: (params: any) => {
          if (params.data.kpiName === "量化指标得分") {
            return `<span style="font-weight: bold ;color:black"> ${params.value} </span>`;
          }
          return params.value;
        },
      },
      {
        headerName: '姓名',
        field: 'userName',
        cellRenderer: (params: any) => {
          if (params.data.kpiName === "量化指标得分") {
            return `<span style="font-weight: bold ;color:black"> ${params.value} </span>`;
          }
          return params.value;
        },
        // rowSpan: () => {
        //   return 7;
        // }

      },
      {
        headerName: '指标名称',
        field: 'kpiName',
        cellRenderer: (params: any) => {
          let returnValue = "";
          switch (params.value) {
            case "量化指标得分":
              returnValue = `<span style="font-weight: bold ;color:black"> ${params.value} </span>`;
              break;
            case "线上千行bug率-排除测试范围&引入bug以外的":
              returnValue = "线上千行bug率";
              break;
            case "内部code review次数":
              returnValue = "code review次数";
              break;
            case "平均bug回归时长":
              returnValue = "bug回归时长";
              break;
            case "平均bug修复时长":
              returnValue = "bug修复时长";
              break;
            default:
              returnValue = params.value;
              break;

          }

          return returnValue;
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
          if (params.data.kpiName === "线上千行bug率-排除测试范围&引入bug以外的") {
            if (customRound(Number(params.value), 4) === "0.0000") {
              return 0;
            }
            return customRound(Number(params.value), 4);

            // if (Number(params.value).toFixed(4) === "0.0000") {
            //   return 0;
            // }
            // return Number(params.value).toFixed(4);
          }

          if (customRound(Number(params.value), 2) === "0.00") {
            return 0;
          }

          // if (params.data.userName === "关平") {
          //   console.log(params.data.userName, params.value, Number(params.value), (Number(params.value) + 0.00000001).toFixed(2));
          // }
          return customRound((Number(params.value)), 2);
        }
      },
      {
        headerName: '目标完成率',
        field: 'ratio',
        cellRenderer: (params: any) => {
          return customRound(Number(params.value), 2);
        }
      },
      {
        headerName: '单项指标得分',
        field: 'score',

        cellRenderer: (params: any) => {
          if (params.data.kpiName === "量化指标得分") {
            return `<span style="font-weight: bold ;color:black"> ${customRound(Number(params.value), 2)} </span>`;
          }
          return customRound(Number(params.value), 2);
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

      <div className="ag-theme-alpine" style={{height: getHeight(), width: '100%'}}>
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
            // cellStyle: {"margin-top": "-5px"}
            cellStyle: (params: any) => {
              if (params.data.kpiName === "量化指标得分") {
                return {"backgroundColor": "LightGrey", "lineHeight": "32px"};
              }
              return {
                "lineHeight": "32px"
              };
            }
          }}

          autoGroupColumnDef={{
            minWidth: 100,
          }}
          rowHeight={32}
          groupDefaultExpanded={9} // 展开分组
          onGridReady={onGridReady}
          // suppressRowTransform={true}
        >

        </AgGridReact>
      </div>

    </PageContainer>
  );
};

export default SprintList;

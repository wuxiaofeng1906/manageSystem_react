import React, {useRef, useState} from 'react';
import {Button, Col, Form, message, Row, Select} from 'antd';
import {useModel} from '@@/plugin-model/useModel';
import {AgGridReact} from "ag-grid-react";
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import '../../style/style.css';
import {useRequest} from "ahooks";
import {loadReleaseIDSelect} from "../../comControl/controler";
import {
  getReleasedItemColumns, getReleasedApiColumns, getReleaseServiceComfirmColumns, releaseAppChangRowColor
} from './grid/columns'
import {GridApi, GridReadyEvent} from "ag-grid-community";
import {confirmUpgradeService} from "./serviceConfirm";
import {alalysisInitData} from "../../datas/dataAnalyze";
import {getCheckProcess} from '../../components/CheckProgress/axiosRequest';
import {showProgressData} from '../../components/CheckProgress/processAnalysis';

const {Option} = Select;
const userLogins: any = localStorage.getItem('userLogins');
const usersInfo = JSON.parse(userLogins);

const UpgradeService: React.FC<any> = () => {
  const {tabsData, modifyProcessStatus, releaseItem, upgradeApi, upgradeConfirm} = useModel('releaseProcess');
  const [formUpgradeService] = Form.useForm(); // 升级服务
  const releaseIDArray = useRequest(() => loadReleaseIDSelect()).data;

  /* region 升级服务 一  发布项 */
  const firstUpSerGridApi = useRef<GridApi>();
  const onFirstGridReady = (params: GridReadyEvent) => {
    firstUpSerGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  const onChangeFirstGridReady = (params: GridReadyEvent) => {
    firstUpSerGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  /* endregion  */

  /* region 升级服务 二  */
  const secondUpSerGridApi = useRef<GridApi>();
  const onSecondGridReady = (params: GridReadyEvent) => {
    secondUpSerGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const onChangeSecondGridReady = (params: GridReadyEvent) => {
    secondUpSerGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  /* endregion   */

  /* region 升级服务 三  */
  const thirdUpSerGridApi = useRef<GridApi>();
  const onthirdGridReady = (params: GridReadyEvent) => {
    thirdUpSerGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const onChangeThirdGridReady = (params: GridReadyEvent) => {
    thirdUpSerGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  /* endregion   */

  // ID changed
  const onReleaseIdChanges = async (selectedId: any, params: any) => {
    // const allaResult = alaReleasedChanged(releaseIdArray, params, selectedId);
    // releaseIdArray.queryId = allaResult.queryArray;
    // if (allaResult.deletedData) {
    //   // 如果有需要被删除的数据就删除，并且更新列表
    //   const result = await deleteReleasedID(currentListNo, allaResult.deletedData);
    //   if (result !== '') {
    //     message.error({
    //       content: result,
    //       duration: 1,
    //       style: {
    //         marginTop: '50vh',
    //       },
    //     });
    //   } else {
    //     const newData: any = await alalysisInitData('pulishItem', currentListNo);
    //     firstUpSerGridApi.current?.setRowData(newData.upService_releaseItem);
    //   }
    // }
  };

  // 一键部署ID查询
  const inquireServiceClick = async () => {
    // if (!(await vertifyModifyFlag(6, currentListNo))) {
    //   message.error({
    //     content: `服务确认已完成，不能进行查询！`,
    //     duration: 1,
    //     style: {
    //       marginTop: '50vh',
    //     },
    //   });
    //
    //   return;
    // }
    //
    // const queryCondition = formUpgradeService.getFieldsValue().deployID;
    // if (!queryCondition || queryCondition.length === 0) {
    //   message.error({
    //     content: '一键部署ID不能为空！',
    //     duration: 1,
    //     style: {
    //       marginTop: '50vh',
    //     },
    //   });
    //   return;
    // }
    // const result = await inquireService(releaseIdArray, currentListNo);
    // if (result.message !== '') {
    //   message.error({
    //     content: result.message,
    //     duration: 1,
    //     style: {
    //       marginTop: '50vh',
    //     },
    //   });
    // } else {
    //   // 有数据之后进行表格的赋值操作(需要把之前表格的数据一并追加进来)   获取之前的数据
    //   const newData: any = (await alalysisInitData('pulishItem', currentListNo))
    //     .upService_releaseItem;
    //
    //
    //   firstUpSerGridApi.current?.setRowData(newData);
    //   // 需要判断升级接口内容是否有值，如果没有的话，则需要新增一个空行
    //   const apidata: any = await alalysisInitData('pulishApi', currentListNo);
    //   if (!apidata.upService_interface || apidata.upService_interface <= 0) {
    //     secondUpSerGridApi.current?.setRowData([{}]); // 需要给升级接口设置一行空值
    //   }
    //
    //   if (newData) {
    //     setGridHeight({
    //       ...gridHeight,
    //       pulishItemGrid: getGridHeight(newData.length),
    //       upgradeApiGrid: getGridHeight(1),
    //     });
    //   }
    // }
  };

  // 下拉框选择是否确认事件
  const saveUperConfirmInfo = async (newValue: string, props: any) => {
    const datas = {
      user_name: usersInfo.name,
      user_id: usersInfo.userid,
      person_type: '',
      ready_release_num: tabsData.activeKey,
      confirm_status: '',
    };

    switch (props.column.colId) {
      case 'front_confirm_status': // 前端
        datas.person_type = 'front';
        break;
      case 'back_end_confirm_status': // 后端
        datas.person_type = 'back';
        break;
      case 'process_confirm_status': // 流程
        datas.person_type = 'process';
        break;
      case 'test_confirm_status': // 测试
        datas.person_type = 'test';
        break;
      default:
        break;
    }

    datas.confirm_status = newValue;
    const result = await confirmUpgradeService(datas);
    if (result === '') {
      message.info({
        content: '保存成功！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      //   刷新表格
      const newData_confirm: any = await alalysisInitData('pulishConfirm', tabsData.activeKey);
      thirdUpSerGridApi.current?.setRowData(newData_confirm.upService_confirm); // 需要给服务确认设置一行空值

      // 保存成功后需要刷新状态
      const processData: any = await getCheckProcess(tabsData?.activeKey);
      if (processData) {
        modifyProcessStatus(showProgressData(processData.data));
      }

    } else {
      message.error({
        content: `${result}`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    }
  };

  return (
    <div>
      {/* 升级服务 */}
      <div>
        <fieldset className={'fieldStyle'}>
          <legend className={'legendStyle'}>Step2 升级服务</legend>
          <div>
            {/* 条件查询 */}
            <div style={{height: 35, marginTop: -15, overflow: 'hidden'}}>
              <Form form={formUpgradeService}>
                <Row>
                  <Col span={12}>
                    {/* 一键部署ID */}
                    <Form.Item
                      label="一键部署ID:" name="deployID" required
                      style={{marginLeft: 10}}>
                      <Select mode="multiple" size={'small'}
                              style={{width: '100%'}} showSearch onChange={onReleaseIdChanges}
                      >
                        {releaseIDArray}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Button
                      size={'small'}
                      type="primary"
                      style={{
                        color: '#46A0FC',
                        backgroundColor: '#ECF5FF',
                        borderRadius: 5,
                        marginLeft: 10,
                        marginTop: 3,
                      }}
                      onClick={inquireServiceClick}
                    >
                      点击查询
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>

            <div>
              {/* 升级服务 */}
              <div
                className="ag-theme-alpine"
                style={{height: releaseItem.gridHight, width: '100%'}}
              >
                <AgGridReact
                  columnDefs={getReleasedItemColumns()} // 定义列
                  rowData={releaseItem.gridData} // 数据绑定
                  defaultColDef={{
                    resizable: true,
                    sortable: true,
                    suppressMenu: true,
                    minWidth: 90,
                    cellStyle: {'line-height': '25px'},
                  }}
                  // getRowStyle={(params: any) => {
                  //   return releaseAppChangRowColor(
                  //     allLockedArray,
                  //     'step2-app',
                  //     params.data?.app_id,
                  //   );
                  // }}
                  headerHeight={25}
                  rowHeight={25}
                  onGridReady={onFirstGridReady}
                  onGridSizeChanged={onChangeFirstGridReady}
                  onColumnEverythingChanged={onChangeFirstGridReady}
                >

                </AgGridReact>
              </div>

              {/* 升级接口 */}
              <div
                className="ag-theme-alpine"
                style={{height: upgradeApi.gridHight, width: '100%'}}
              >
                <AgGridReact
                  columnDefs={getReleasedApiColumns()} // 定义列
                  rowData={upgradeApi.gridData} // 数据绑定
                  defaultColDef={{
                    resizable: true,
                    sortable: true,
                    suppressMenu: true,
                    cellStyle: {'line-height': '25px'},
                    minWidth: 90,
                  }}
                  headerHeight={25}
                  rowHeight={25}
                  // getRowStyle={(params: any) => {
                  //   return releaseAppChangRowColor(
                  //     allLockedArray,
                  //     'step2-api',
                  //     params.data?.api_id,
                  //   );
                  // }}
                  onGridReady={onSecondGridReady}
                  onGridSizeChanged={onChangeSecondGridReady}
                  onColumnEverythingChanged={onChangeSecondGridReady}
                >

                </AgGridReact>
              </div>
            </div>

            {/* 服务确认完成 */}
            <div>
              <div style={{fontWeight: 'bold'}}> 服务确认完成</div>

              <div
                className="ag-theme-alpine"
                style={{height: upgradeConfirm.gridHight, width: '100%'}}
              >
                <AgGridReact
                  columnDefs={getReleaseServiceComfirmColumns()} // 定义列
                  defaultColDef={{
                    resizable: true,
                    sortable: true,
                    suppressMenu: true,
                    cellStyle: {'line-height': '25px'},
                    minWidth: 90,
                  }}
                  rowData={upgradeConfirm.gridData}
                  headerHeight={25}
                  rowHeight={25}
                  onGridReady={onthirdGridReady}
                  onGridSizeChanged={onChangeThirdGridReady}
                  onColumnEverythingChanged={onChangeThirdGridReady}
                  frameworkComponents={{
                    confirmSelectChoice: (props: any) => {
                      const currentValue = props.value === '9' ? '' : props.value;
                      let Color = 'black';
                      if (currentValue === '1') {
                        Color = '#2BF541';
                      } else if (currentValue === '2') {
                        Color = 'orange';
                      }

                      return (
                        <Select
                          size={'small'}
                          defaultValue={currentValue}
                          bordered={false}
                          style={{width: '100%', color: Color}}
                          onChange={(newValue: any) => {
                            saveUperConfirmInfo(newValue, props);
                          }}
                        >
                          <Option key={'1'} value={'1'}>
                            是
                          </Option>
                          <Option key={'2'} value={'2'}>
                            否
                          </Option>
                          <Option key={'9'} value={'9'}>
                            {' '}
                          </Option>
                        </Select>
                      );
                    },
                  }}
                >
                </AgGridReact>
              </div>
            </div>

            {/*  提示标签 */}
            <div style={{fontSize: 'smaller', marginTop: 10}}>
              1、先选择【构建环境】，在选择【一键部署ID】，点击查询按钮，自动获取并展示发布的应用集合；
              <br/>
              2、发布项为前端、后端、流程时，分支和环境提供上线分支/测试环境，说明填写更新服务；
              <br/>
              3、发布项为前端镜像、后端镜像、流程镜像时，分支和环境提供镜像版本号，说明填写提供镜像/版本名称；
              <br/>
              4、发布项为接口时，分支和环境处提供具体接口，说明填写method：接口升级，租户升级说明。
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default UpgradeService;

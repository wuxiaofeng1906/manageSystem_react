import React, {useEffect, useRef, useState} from 'react';
import {Button, Col, Form, Input, message, Modal, Row, Select} from 'antd';
import {useModel} from '@@/plugin-model/useModel';
import {AgGridReact} from "ag-grid-react";
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import '../../style/style.css';
import {useRequest} from "ahooks";
import {loadReleaseIDSelect} from "../../comControl/controler";
import {
  getReleasedItemColumns, getReleasedApiColumns, getReleaseServiceComfirmColumns
} from './grid/columns'
import {GridApi, GridReadyEvent} from "ag-grid-community";
import {confirmUpgradeService} from "./serviceConfirm";
import {alalysisInitData} from "../../datas/dataAnalyze";
import {getCheckProcess} from '../../components/CheckProgress/axiosRequest';
import {showProgressData} from '../../components/CheckProgress/processAnalysis';
import {vertifyModifyFlag, releaseAppChangRowColor} from '../../operate';
import {inquireService} from './axiosRequest';
import {deleteLockStatus, getLockStatus} from "../../lock/rowLock";
import {
  loadApiMethodSelect, loadApiServiceSelect, loadIsApiAndDbUpgradeSelect, loadOnlineEnvSelect,
  loadPulishItemSelect, loadUpgradeApiSelect
} from "../../comControl/controler";
import {upgradePulishItem, addPulishApi, deleteReleasedID} from "./axiosRequest";
import {getGridRowsHeight} from "../../components/gridHeight";
import {alaReleasedChanged, getAutoCheckMessage} from "./idDeal/dataDeal";

const {TextArea} = Input;
const {Option} = Select;
const userLogins: any = localStorage.getItem('userLogins');
const usersInfo = JSON.parse(userLogins);

const UpgradeService: React.FC<any> = () => {
  const {
    tabsData, modifyProcessStatus, releaseItem, upgradeApi, upgradeConfirm, lockedItem, modifyLockedItem,
    setRelesaeItem, setUpgradeApi, releasedID, modifyReleasedID, allLockedArray, operteStatus
  } = useModel('releaseProcess');
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

  /* region 一键部署ID相关事件 */
  // ID changed
  const onReleaseIdChanges = async (selectedId: any, params: any) => {

    const allaResult = alaReleasedChanged(releasedID, params, selectedId);
    // modifyReleasedID(releasedID.oraID, allaResult.queryArray);
    modifyReleasedID(selectedId, allaResult.queryArray);

    if (allaResult.deletedData) {
      // 如果有需要被删除的数据就删除，并且更新列表
      const result = await deleteReleasedID(tabsData.activeKey, allaResult.deletedData);
      if (result !== '') {
        message.error({
          content: result,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      } else {
        const newData: any = await alalysisInitData('pulishItem', tabsData.activeKey);
        // firstUpSerGridApi.current?.setRowData(newData.upService_releaseItem);
        formUpgradeService.setFieldsValue({
          hitMessage: getAutoCheckMessage(newData.upService_releaseItem),
        });
        setRelesaeItem({
          gridHight: getGridRowsHeight((newData.upService_releaseItem)),
          gridData: newData.upService_releaseItem
        });

      }
    }
  };

  // 一键部署ID查询
  const inquireServiceClick = async () => {
    if (!(await vertifyModifyFlag(6, tabsData.activeKey))) {
      message.error({
        content: `服务确认已完成，不能进行查询！`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      return;
    }

    const queryCondition = formUpgradeService.getFieldsValue().deployID;
    if (!queryCondition || queryCondition.length === 0) {
      message.error({
        content: '一键部署ID不能为空！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return;
    }

    // releaseIdArray 需要注意
    const result = await inquireService(releasedID, tabsData.activeKey);
    if (result.message !== '') {
      message.error({
        content: result.message,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    } else {

      const newData: any = (await alalysisInitData('pulishItem', tabsData.activeKey)).upService_releaseItem;
      formUpgradeService.setFieldsValue({
        hitMessage: getAutoCheckMessage(newData),
      });
      setRelesaeItem({gridHight: getGridRowsHeight(newData), gridData: newData});
      // 需要判断升级接口内容是否有值，如果没有的话，则需要新增一个空行
      const apidata: any = await alalysisInitData('pulishApi', tabsData.activeKey);

      if (!apidata.upService_interface || apidata.upService_interface <= 0) {
        // secondUpSerGridApi.current?.setRowData([{}]); // 需要给升级接口设置一行空值
        setUpgradeApi({gridHight: getGridRowsHeight([]).toString(), gridData: [{}]});
      }
    }
  };
  /* endregion */

  /* region 行的新增和修改 */

  /* region 发布项新增和修改 */
  const [pulishItemForm] = Form.useForm(); // 发布项
  const [pulishItemModal, setPulishItemModal] = useState({shown: false, title: '新增'}); // 发布项 新增和修改的共同modal显示
  const [pulishItemFormSelected, setPulishItemFormSelected] = useState({
    // 发布项弹出窗口中的select框加载
    onlineEnv: [],
    pulishItem: [],
    isApiDbUpgrade: [],
  });

  (window as any).showPulishItemForm = async (type: any, params: any) => {
    // 是否是已完成发布
    if (operteStatus) {
      message.error({
        content: `发布已完成，不能进行修改！`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      return;
    }
    // 验证是否已经确认服务，如果已经确认了，就不能新增和修改了
    const flag = await vertifyModifyFlag(1, tabsData.activeKey);
    if (!flag) {
      message.error({
        content: `服务确认已完成，不能进行修改！`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      return;
    }
    if (type === 'add') {
      pulishItemForm.resetFields();
      setPulishItemModal({
        shown: true,
        title: '新增',
      });
    } else {
      let onlineEnvArray;
      if (params.online_environment) {
        onlineEnvArray = params.online_environment.split(',');
      }

      const appid = params.app_id;
      pulishItemForm.setFieldsValue({
        onlineEnv: onlineEnvArray,
        pulishItem: params.release_item,
        application: params.app,
        hotUpdate: params.hot_update,
        interAndDbUpgrade: params.is_upgrade_api_database,
        branchAndEnv: params.branch_environment,
        description: params.instructions,
        remark: params.remarks,
        appId: appid,
        automationTest: params.automation_check,
        deploymentId: params.deployment_id,
      });

      // 如果appid是空的，则表示是新查询出来的数据
      if (!appid) {
        setPulishItemModal({
          shown: true,
          title: '修改',
        });
      } else {
        modifyLockedItem(`${tabsData.activeKey}-step2-app-${appid}`);
        const lockInfo = await getLockStatus(`${tabsData.activeKey}-step2-app-${appid}`);

        if (lockInfo.errMessage) {
          message.error({
            content: `${lockInfo.errMessage}`,
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        } else {
          setPulishItemModal({
            shown: true,
            title: '修改',
          });
        }
      }
    }

    setPulishItemFormSelected({
      onlineEnv: await loadOnlineEnvSelect(),
      pulishItem: await loadPulishItemSelect(),
      isApiDbUpgrade: await loadIsApiAndDbUpgradeSelect(),
    });
  };

  // 取消发布项弹出窗
  const pulishItemModalCancle = () => {
    setPulishItemModal({
      ...pulishItemModal,
      shown: false,
    });
    const formData = pulishItemForm.getFieldsValue();
    if (formData.appId) {
      deleteLockStatus(lockedItem);
    }
  }

  // 保存发布项结果
  const savePulishResult = async () => {
    const formData = pulishItemForm.getFieldsValue();
    const result = await upgradePulishItem(formData, tabsData.activeKey);
    if (result === '') {
      message.info({
        content: '修改成功！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      setPulishItemModal({
        ...pulishItemModal,
        shown: false,
      });

      const newData: any = await alalysisInitData('pulishItem', tabsData.activeKey);
      // firstUpSerGridApi.current?.setRowData(newData.upService_releaseItem);
      setRelesaeItem({
        gridHight: getGridRowsHeight((newData.upService_releaseItem)),
        gridData: newData.upService_releaseItem
      });


      // 也要刷新一键部署ID
      // setReleasedIdForm(newData?.upService_releaseItem);
      //   发布项结果保存成功之后，需要刷新发布项中的服务确认完成
      const newData_confirm: any = await alalysisInitData('pulishConfirm', tabsData.activeKey);
      thirdUpSerGridApi.current?.setRowData(newData_confirm.upService_confirm); // 需要给服务确认设置一行空值

      // setGridHeight({
      //   ...gridHeight,
      //   pulishItemGrid: getGridHeight(newData.upService_releaseItem.length),
      //   upConfirm: getGridHeight(newData_confirm.upService_confirm.length),
      // });

      // 保存后需要解解锁
      if (formData.appId) {
        deleteLockStatus(lockedItem);
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
  /* endregion */

  /* region 发布接口新增和修改 */
  const [upgradeIntForm] = Form.useForm(); // 发布接口
  const [upgradeIntModal, setUpgradeIntModal] = useState({shown: false, title: '新增'}); // 发布项新增和修改的共同modal显示
  const [upgradeApiFormSelected, setUpgradeApiFormSelected] = useState({
    // 发布接口弹出窗口中的select框加载
    onlineEnv: [],
    upgradeApi: [],
    apiService: [],
    apiMethod: [],
  });

  // 发布接口弹出窗口进行修改和新增
  (window as any).showUpgradeApiForm = async (type: any, params: any) => {

    // 是否是已完成发布
    if (operteStatus) {
      message.error({
        content: `发布已完成，不能进行新增和修改！`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      return;
    }

    const flag = await vertifyModifyFlag(2, tabsData.activeKey);
    if (!flag) {
      message.error({
        content: `服务确认已完成，不能进行修改！`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      return;
    }
    if (type === 'add') {
      upgradeIntForm.resetFields();
      setUpgradeIntModal({
        shown: true,
        title: '新增',
      });
    } else {
      const apiid = params.api_id;
      upgradeIntForm.setFieldsValue({
        onlineEnv:
          params.online_environment === undefined
            ? undefined
            : params.online_environment.split(','),
        upInterface: params.update_api,
        interService: params.api_name,
        hotUpdate: params.hot_update,
        method: params.api_method,
        URL: params.api_url,
        renter: params.related_tenant,
        remark: params.remarks,
        apiId: apiid,
      });
      modifyLockedItem(`${tabsData.activeKey}-step2-api-${apiid}`);
      const lockInfo = await getLockStatus(`${tabsData.activeKey}-step2-api-${apiid}`);

      if (lockInfo.errMessage) {
        message.error({
          content: `${lockInfo.errMessage}`,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      } else {
        setUpgradeIntModal({
          shown: true,
          title: '修改',
        });
      }
    }

    setUpgradeApiFormSelected({
      onlineEnv: await loadOnlineEnvSelect(),
      upgradeApi: await loadUpgradeApiSelect(),
      apiService: await loadApiServiceSelect(),
      apiMethod: await loadApiMethodSelect(),
    });
  };
  // 取消事件
  const upgradeIntModalCancle = () => {
    setUpgradeIntModal({
      ...upgradeIntModal,
      shown: false,
    });

    if (upgradeIntModal.title === '修改') {
      //   释放锁
      deleteLockStatus(lockedItem);
    }
  };

  // 保存数据
  const saveUpgradeInterResult = async () => {
    const formData = upgradeIntForm.getFieldsValue();
    const result = await addPulishApi(formData, tabsData.activeKey, upgradeIntModal.title);
    if (result === '') {
      message.info({
        content: '保存成功！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      setUpgradeIntModal({
        ...upgradeIntModal,
        shown: false,
      });

      const newData: any = await alalysisInitData('pulishApi', tabsData.activeKey);
      setUpgradeApi({
        gridHight: getGridRowsHeight((newData.upService_interface)),
        gridData: newData.upService_interface
      });

      if (upgradeIntModal.title === '修改') {
        //   释放锁
        deleteLockStatus(lockedItem);
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

  /* endregion */

  /* region 服务确认 */
  // 下拉框选择是否确认事件
  const saveUperConfirmInfo = async (newValue: string, props: any) => {
    const currentReleaseNum = props.data?.ready_release_num;

    const datas = {
      user_name: usersInfo.name,
      user_id: usersInfo.userid,
      person_type: '',
      ready_release_num: currentReleaseNum,
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
      {
        // 需要判断前后端和流程的数据是否确认，只有都确认了测试才能确认（如果不涉及某一段的，就跳过那一段）
        const confirmData = props?.data;
        if ((confirmData.front_confirm_status === "1" || confirmData.front_confirm_status === "9") &&
          (confirmData.back_end_confirm_status === "1" || confirmData.back_end_confirm_status === "9") &&
          (confirmData.process_confirm_status === "1" || confirmData.process_confirm_status === "9")) {
          datas.person_type = 'test';
        } else {
          message.error({
            content: '保存失败：请先完成开发确认！',
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
          // (不管成功或者失败)刷新表格
          const newData_confirm: any = await alalysisInitData('pulishConfirm', currentReleaseNum);
          thirdUpSerGridApi.current?.setRowData(newData_confirm.upService_confirm); // 需要给服务确认刷新数据
          return;
        }
      }
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
      // 刷新状态进度条
      const processData: any = await getCheckProcess(currentReleaseNum);
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

    //   (不管成功或者失败)刷新表格
    const newData_confirm: any = await alalysisInitData('pulishConfirm', currentReleaseNum);
    thirdUpSerGridApi.current?.setRowData(newData_confirm.upService_confirm); // 需要给服务确认刷新数据
  };
  /* endregion */

  /* endregion */


  useEffect(() => {
    formUpgradeService.setFieldsValue({
      deployID: releasedID.oraID,
      hitMessage: getAutoCheckMessage(releaseItem.gridData)  // 31357
    });
  }, [releasedID])
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
                      disabled={operteStatus}
                      onClick={inquireServiceClick}
                    >
                      点击查询
                    </Button>
                    <Form.Item
                      label="" name="hitMessage"
                      style={{marginLeft: 85, marginTop: -28}}>
                      <Input
                        style={{
                          border: 'none',
                          backgroundColor: 'white',
                          color: 'red',
                        }}
                        disabled
                      />
                    </Form.Item>
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
                  getRowStyle={(params: any) => {
                    return releaseAppChangRowColor(
                      allLockedArray,
                      'step2-app',
                      params.data?.app_id,
                    );
                  }}
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
                  getRowStyle={(params: any) => {
                    return releaseAppChangRowColor(
                      allLockedArray,
                      'step2-api',
                      params.data?.api_id,
                    );
                  }}
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

                      let Color = 'black';
                      const currentValue = props.value;
                      if (currentValue === '1') {
                        Color = '#2BF541';
                      } else if (currentValue === '2') {
                        Color = 'orange';
                      } else if (currentValue === '9') {
                        return (<label></label>);
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
                          disabled={operteStatus}
                        >
                          <Option key={'1'} value={'1'}>
                            是
                          </Option>
                          <Option key={'2'} value={'2'}>
                            否
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
      {/* 发布项 */}
      <Modal
        title={pulishItemModal.title}
        visible={pulishItemModal.shown}
        onCancel={pulishItemModalCancle}
        centered={true}
        footer={null}
        width={630}
      >
        <Form form={pulishItemForm}>
          <Row>
            <Col span={12}>
              <Form.Item name="onlineEnv" label="上线环境:" required style={{marginTop: -15}}>
                <Select showSearch mode="multiple">
                  {pulishItemFormSelected.onlineEnv}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="pulishItem"
                label="发布项："
                required
                style={{marginTop: -15, marginLeft: 10}}
              >
                <Select showSearch style={{marginLeft: 27, width: 183}}>
                  {pulishItemFormSelected.pulishItem}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item name="application" label="应用：" required style={{marginTop: -15}}>
                <Input
                  autoComplete="off"
                  style={{marginLeft: 28, width: 206, color: 'black'}}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="branchAndEnv"
                label="分支和环境："
                required
                style={{marginTop: -15, marginLeft: 10}}
              >
                <Input autoComplete="off" disabled style={{color: 'black'}}/>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="interAndDbUpgrade"
            label="是否涉及接口与数据库升级："
            required
            style={{marginTop: -15}}
          >
            <Select>{pulishItemFormSelected.isApiDbUpgrade}</Select>
          </Form.Item>

          <Form.Item name="hotUpdate" label="是否支持热更新：" required style={{marginTop: -15}}>
            <Select>
              <Option key={'1'} value={'1'}>
                {'是'}
              </Option>
              <Option key={'2'} value={'2'}>
                {'否'}
              </Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="说明：" style={{marginTop: -15}}>
            <TextArea/>
          </Form.Item>
          <Form.Item name="remark" label="备注：" style={{marginTop: -15}}>
            <TextArea/>
          </Form.Item>
          <Form.Item>
            <Button
              style={{borderRadius: 5, marginLeft: 20, float: 'right'}}
              onClick={pulishItemModalCancle}
            >
              取消
            </Button>
            <Button
              type="primary"
              style={{
                color: '#46A0FC',
                backgroundColor: '#ECF5FF',
                borderRadius: 5,
                float: 'right',
              }}
              onClick={savePulishResult}
            >
              确定{' '}
            </Button>
          </Form.Item>

          {/* 隐藏字段，进行修改需要的字段 */}
          <Row style={{marginTop: -60}}>
            <Col span={2}>
              <Form.Item name="appId">
                <Input style={{width: 50, display: 'none'}}/>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="automationTest">
                <Input style={{width: 50, display: 'none'}}/>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="deploymentId">
                <Input style={{width: 50, display: 'none'}}/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 接口服务 */}
      <Modal
        title={upgradeIntModal.title}
        visible={upgradeIntModal.shown}
        onCancel={upgradeIntModalCancle}
        centered={true}
        footer={null}
        width={630}
      >
        <Form form={upgradeIntForm}>
          <Row>
            <Col span={12}>
              <Form.Item name="onlineEnv" label="上线环境:" required style={{marginTop: -15}}>
                <Select showSearch mode="multiple" style={{marginLeft: 20, width: 185}}>
                  {upgradeApiFormSelected.onlineEnv}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="upInterface"
                label="升级接口："
                required
                style={{marginLeft: 10, marginTop: -15}}
              >
                <Select showSearch style={{}}>
                  {upgradeApiFormSelected.upgradeApi}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item name="interService" label="接口服务：" required style={{marginTop: -15}}>
                <Select showSearch style={{marginLeft: 21, width: 185}}>
                  {upgradeApiFormSelected.apiService}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="renter"
                label="涉及租户："
                required
                style={{marginLeft: 10, marginTop: -15}}
              >
                <Input/>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item name="method" label="接口Method：" required style={{marginTop: -15}}>
                <Select showSearch style={{}}>
                  {upgradeApiFormSelected.apiMethod}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="URL"
                label="接口URL："
                required
                style={{marginLeft: 10, marginTop: -15}}
              >
                <Input/>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="hotUpdate" label="是否支持热更新：" required style={{marginTop: -15}}>
            <Select>
              <Option key={'1'} value={'1'}>
                {'是'}
              </Option>
              <Option key={'2'} value={'2'}>
                {'否'}
              </Option>
            </Select>
          </Form.Item>

          <Form.Item name="remark" label="备注：" style={{marginTop: -15}}>
            <TextArea/>
          </Form.Item>

          <Form.Item>
            <Button
              style={{borderRadius: 5, marginLeft: 20, float: 'right'}}
              onClick={upgradeIntModalCancle}
            >
              取消
            </Button>
            <Button
              type="primary"
              style={{
                color: '#46A0FC',
                backgroundColor: '#ECF5FF',
                borderRadius: 5,
                float: 'right',
              }}
              onClick={saveUpgradeInterResult}
            >
              确定{' '}
            </Button>
          </Form.Item>
          {/* 隐藏字段，进行修改需要的字段 */}
          <Row style={{marginTop: -60}}>
            <Col span={2}>
              <Form.Item name="apiId">
                <Input style={{width: 50, display: 'none'}}/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UpgradeService;

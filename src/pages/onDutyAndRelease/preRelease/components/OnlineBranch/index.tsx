import React, {useRef, useState} from 'react';
import {
  Button, Card, Checkbox, Col, DatePicker, Divider, Form,
  Input, message, Modal, Row, Select, Spin, Switch
} from 'antd';
import {useModel} from '@@/plugin-model/useModel';
import {AgGridReact} from "ag-grid-react";
import {GridApi, GridReadyEvent} from "ag-grid-community";
import {deleteLockStatus, getLockStatus} from "../../lock/rowLock";
import {getOnlineBranchColumns,} from "./grid/columns";
import {
  getCheckNumForOnlineBranch, getModifiedData, saveOnlineBranchData, executeOnlineCheck
} from "./axiosRequest";
import moment from "moment";
import dayjs from "dayjs";
import {
  loadBranchNameSelect, loadBrowserTypeSelect, loadCheckTypeSelect, loadImgEnvSelect, loadServiceSelect,
  loadTechSideSelect
} from "../../comControl/controler";
import {alalysisInitData} from "../../datas/dataAnalyze";
import {getGridHeight} from "../gridHeight";
import {releaseAppChangRowColor} from '../../operate';

let newOnlineBranchNum = '';

const OnlineBranch: React.FC<any> = () => {
  const [formForOnlineBranch] = Form.useForm(); // 上线分支设置
  const firstOnlineBranchGridApi = useRef<GridApi>();
  const {
    tabsData, lockedItem, modifyLockedItem, onlineBranch, setOnlineBranch, allLockedArray
  } = useModel('releaseProcess');
  const [executeStatus, setExecuteStatus] = useState(false); // 上线分支点击执行后的进度展示
  const [onlineBranchModal, setOnlineBranchModal] = useState({
    shown: false,
    title: '新增',
    loading: false,
  }); // 上线分支设置
  const [onlineBranchFormSelected, setOnlineBranchFormSelected] = useState({
    // 上线分支 弹窗selected框
    branchName: [],
    techSide: [],
    server: [],
    imgEnv: [],
    checkType: [],
    browser: [],
  });
  const onfirstOnlineBranchGridReady = (params: GridReadyEvent) => {
    firstOnlineBranchGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const onChangefirstOnlineBranchGridReady = (params: GridReadyEvent) => {
    firstOnlineBranchGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  // 取消
  const onlineBranchCancle = () => {
    setOnlineBranchModal({
      shown: false,
      title: '新增',
      loading: false,
    });

    if (onlineBranchModal.title === '修改') {
      deleteLockStatus(lockedItem);
    }
  };

  // 保存
  const saveOnlineBranchResult = async () => {
    setOnlineBranchModal({
      ...onlineBranchModal,
      loading: true,
    });

    const formData = formForOnlineBranch.getFieldsValue();
    const result = await saveOnlineBranchData(
      onlineBranchModal.title,
      tabsData.activeKey,
      newOnlineBranchNum,
      formData,
    );

    if (result === '') {
      message.info({
        content: '保存成功！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      setOnlineBranchModal({
        shown: false,
        title: '新增',
        loading: false,
      });

      const newData: any = await alalysisInitData('onlineBranch', tabsData.activeKey);
      setOnlineBranch({
        gridHight: getGridHeight((newData.onlineBranch).length, true).toString(),
        gridData: newData.onlineBranch
      });

      if (onlineBranchModal.title === '修改') {
        deleteLockStatus(lockedItem);
      }
    } else {
      message.error({
        content: result,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      setOnlineBranchModal({
        ...onlineBranchModal,
        loading: false,
      });
    }
  };

  // 上线分支弹出窗口进行修改和新增
  (window as any).showOnlineBranchForm = async (type: any, params: any) => {
    if (type === 'add') {
      formForOnlineBranch.resetFields();
      formForOnlineBranch.setFieldsValue({
        verson_check: '1',
        branchcheck: '1',
        branch_mainBranch: ['stage', 'master'],
        branch_teachnicalSide: ['front', 'backend'],
        branch_mainSince: moment(dayjs().subtract(6, 'day').format('YYYY-MM-DD')),
      });
      setOnlineBranchModal({
        shown: true,
        title: '新增',
        loading: false,
      });
      const result = await getCheckNumForOnlineBranch();
      newOnlineBranchNum = result.data?.check_num;
    } else {
      newOnlineBranchNum = params.check_num;
      const oraData = await getModifiedData(newOnlineBranchNum);

      // 服务
      let servers = oraData.versonCheck?.server;
      if (servers) {
        if (servers.length === 1 && servers.includes('')) {
          servers = undefined;
        }
      }

      // 时间
      let mainSince;
      if (oraData.branchCheck?.branch_mainSince) {
        mainSince = moment(oraData.branchCheck?.branch_mainSince);
      }

      // 上线前的检查类型
      let beforeType = oraData.beforeOnlineCheck?.beforeCheckType;
      if (oraData.beforeOnlineCheck?.beforeCheckType) {
        if (
          (oraData.beforeOnlineCheck?.beforeCheckType).length === 1 &&
          (oraData.beforeOnlineCheck?.beforeCheckType).includes('9')
        ) {
          beforeType = undefined;
        }
      }

      // 上线后的检查类型
      let afterType = oraData.afterOnlineCheck?.afterCheckType;
      if (oraData.afterOnlineCheck?.afterCheckType) {
        if (
          (oraData.afterOnlineCheck?.afterCheckType).length === 1 &&
          (oraData.afterOnlineCheck?.afterCheckType).includes('9')
        ) {
          afterType = undefined;
        }
      }

      formForOnlineBranch.setFieldsValue({
        // 表头设置
        branchName: oraData.checkHead.branchName,
        ignoreFrontCheck: oraData.checkHead.ignoreFrontCheck,
        module: oraData.checkHead.module,
        ignoreBackendCheck: oraData.checkHead.ignoreBackendCheck,

        // 版本检查设置
        verson_check: oraData.versonCheck?.verson_check,
        server: servers,
        imageevn: oraData.versonCheck?.imageevn,

        // 对比分支
        branchcheck: oraData.branchCheck?.branchcheck,
        branch_mainBranch: oraData.branchCheck?.branch_mainBranch,
        branch_teachnicalSide: oraData.branchCheck?.branch_teachnicalSide,
        branch_mainSince: mainSince,

        // 环境一致性检查
        ignoreCheck: oraData.envCheck.ignoreCheck,
        checkEnv: oraData.envCheck.checkEnv,

        // 上线前自动化检查
        autoBeforeIgnoreCheck: oraData.beforeOnlineCheck?.autoBeforeIgnoreCheck,
        beforeCheckType: beforeType,
        beforeTestEnv: oraData.beforeOnlineCheck?.beforeTestEnv,
        beforeBrowser: oraData.beforeOnlineCheck?.beforeBrowser,

        //  上线后自动化检查
        autoAfterIgnoreCheck: oraData.afterOnlineCheck?.autoAfterIgnoreCheck,
        afterCheckType: afterType,
        afterTestEnv: oraData.afterOnlineCheck?.afterTestEnv,
        afterBrowser: oraData.afterOnlineCheck?.afterBrowser,

        //   隐藏字段，修改时需要使用
        branchCheckId: oraData.checkHead?.branchCheckId,
        versionCheckId: oraData.versonCheck?.versionCheckId,
        envCheckId: oraData.envCheck?.checkId,
        beforeAutomationId: oraData.beforeOnlineCheck?.automationId,
        afterAutomationId: oraData.afterOnlineCheck?.automationId,
      });

      modifyLockedItem(`${tabsData.activeKey}-step4-onlineBranch-${oraData.checkHead?.branchCheckId}`);
      const lockInfo = await getLockStatus(`${tabsData.activeKey}-step4-onlineBranch-${oraData.checkHead?.branchCheckId}`);

      if (lockInfo.errMessage) {
        message.error({
          content: `${lockInfo.errMessage}`,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      } else {
        setOnlineBranchModal({
          shown: true,
          title: '修改',
          loading: false,
        });
      }
    }

    setOnlineBranchFormSelected({
      branchName: await loadBranchNameSelect(),
      techSide: await loadTechSideSelect(),
      server: await loadServiceSelect(),
      imgEnv: await loadImgEnvSelect(),
      checkType: await loadCheckTypeSelect(),
      browser: await loadBrowserTypeSelect(),
    });
  };

  // 执行上线前检查：上线前版本检查、环境检查，自动化检查
  (window as any).excuteDataCheck = async (type: string, checkNum: string, values: string) => {
    if (values === '忽略') {
      message.error({
        content: '当前状态为忽略，不能进行任务执行！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return;
    }

    setExecuteStatus(true);
    const result = await executeOnlineCheck(type, checkNum);
    if (result === '') {
      message.info({
        content: '任务开始执行！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      // 刷新界面
      const newData: any = await alalysisInitData('onlineBranch', tabsData.activeKey);
      firstOnlineBranchGridApi.current?.setRowData(newData.onlineBranch);
    } else {
      message.error({
        content: `${result}`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    }
    setExecuteStatus(false);
  };

  return (
    <div>

      {/*上线分支 */}
      <div>
        <fieldset className={'fieldStyle'}>
          <legend className={'legendStyle'}>Step4 上线分支</legend>

          <div>
            {/* ag-grid 表格 */}
            <div>
              <Spin spinning={executeStatus} tip="执行中...">
                <div
                  className="ag-theme-alpine"
                  style={{height: onlineBranch.gridHight, width: '100%', marginTop: -12}}
                >
                  <AgGridReact
                    columnDefs={getOnlineBranchColumns()} // 定义列
                    rowData={onlineBranch.gridData} // 数据绑定
                    defaultColDef={{
                      resizable: true,
                      sortable: true,
                      suppressMenu: true,
                      // autoHeight: true,
                      minWidth: 90,
                      cellStyle: () => ({   // 单元格垂直居中显示
                        display: "flex",
                        alignItems: "center"
                      })
                    }}
                    headerHeight={25}
                    rowHeight={50}
                    getRowStyle={(params: any) => {
                      return releaseAppChangRowColor(
                        allLockedArray,
                        'step4-onlineBranch',
                        params.data?.branch_check_id,
                      );
                    }}
                    onGridReady={onfirstOnlineBranchGridReady}
                    onGridSizeChanged={onChangefirstOnlineBranchGridReady}
                    onColumnEverythingChanged={onChangefirstOnlineBranchGridReady}
                  >
                  </AgGridReact>
                </div>
              </Spin>
            </div>
            <div style={{fontSize: 'smaller', marginTop: 10}}>
              1、版本检查、环境一致性检查、自动化检查，在需要的时间节点，点击手动触发按钮，进行按需检查；
              <br/>
              2、检查状态分为：是、否、检查中、未开始、忽略等5种状态；
              <br/>
              3、点击检查日志链接，可以进入检查的详情页面。
            </div>
          </div>
        </fieldset>
      </div>

      {/* 上线分支设置  */}
      <Modal
        title={`上线分支设置-${onlineBranchModal.title}`}
        visible={onlineBranchModal.shown}
        onCancel={onlineBranchCancle}
        maskClosable={false}
        centered={true}
        footer={null}
        width={652}
      >
        <Form form={formForOnlineBranch}>
          {/* 总设置 */}
          <div>
            <Row>
              <Col span={16}>
                {/* 分支名称 */}
                <Form.Item label="分支名称:" name="branchName" required={true}>
                  <Select style={{width: '100%'}} showSearch>
                    {onlineBranchFormSelected.branchName}
                  </Select>
                </Form.Item>
                {/* 忽略前端单元测试检查 */}
                <Form.Item name="ignoreFrontCheck" style={{marginLeft: 0, marginTop: -20}}>
                  <Checkbox.Group>
                    <Checkbox value={'1'}>忽略前端单元测试检查</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
              <Col span={8}>
                {/* 技术侧 */}
                <Form.Item label="技术侧:" name="module" style={{marginLeft: 10}} required={true}>
                  <Select style={{width: '100%'}} showSearch>
                    {onlineBranchFormSelected.techSide}
                  </Select>
                </Form.Item>
                {/* 忽略后端单元测试检查 */}
                <Form.Item name="ignoreBackendCheck" style={{marginLeft: 0, marginTop: -20}}>
                  <Checkbox.Group>
                    <Checkbox value={'1'}>忽略后端单元测试检查</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* ① 版本检查设置 */}
          <div style={{marginTop: -35}}>
            <Divider plain>① 版本检查设置</Divider>

            <div>
              <Card
                size="small"
                title="版本检查"
                style={{width: '100%', marginTop: -10, height: 150}}
              >
                <Form.Item
                  name="verson_check"
                  label="是否开启："
                  valuePropName="checked"
                  style={{marginTop: -10}}
                >
                  <Switch checkedChildren="是" unCheckedChildren="否" style={{marginLeft: 40}}/>
                </Form.Item>
                <Form.Item name="server" label="服务" style={{marginTop: -22}}>
                  <Select
                    mode="multiple"
                    placeholder="请选择相应的服务！"
                    style={{marginLeft: 68, width: 415}}
                  >
                    {onlineBranchFormSelected.server}
                  </Select>
                </Form.Item>
                <Form.Item name="imageevn" label="镜像环境" style={{marginTop: -20}}>
                  <Select
                    placeholder="请选择对应的环境！"
                    style={{marginLeft: 40, width: 415}}
                    showSearch
                  >
                    {onlineBranchFormSelected.imgEnv}
                  </Select>
                </Form.Item>
              </Card>
            </div>

            <div>
              <Card
                size="small"
                title="检查上线分支是否包含对比分支的提交"
                style={{width: '100%', height: 200}}
              >
                <Form.Item
                  name="branchcheck"
                  label="是否开启："
                  valuePropName="checked"
                  style={{marginTop: -10}}
                >
                  <Switch checkedChildren="是" unCheckedChildren="否" style={{marginLeft: 40}}/>
                </Form.Item>

                <Form.Item
                  label="被对比的主分支"
                  name="branch_mainBranch"
                  style={{marginTop: -25}}
                >
                  <Checkbox.Group>
                    <Checkbox value={'stage'}>stage</Checkbox>
                    <Checkbox value={'master'}>master</Checkbox>
                  </Checkbox.Group>
                </Form.Item>

                <Form.Item label="技术侧" name="branch_teachnicalSide" style={{marginTop: -25}}>
                  <Checkbox.Group style={{marginLeft: 56}}>
                    <Checkbox value={'front'}>前端</Checkbox>
                    <Checkbox value={'backend'}>后端</Checkbox>
                  </Checkbox.Group>
                </Form.Item>

                <Form.Item label="对比起始时间" name="branch_mainSince" style={{marginTop: -20}}>
                  <DatePicker style={{marginLeft: 13, width: 415}}/>
                </Form.Item>
                <div style={{color: 'gray', marginTop: -25, marginLeft: 110}}>
                  默认时间代表查询近一周的数据
                </div>
              </Card>
            </div>
          </div>

          {/* ② 环境一致性检查 */}
          <div style={{marginTop: -10}}>
            <Divider plain>② 环境一致性检查</Divider>
            <div>
              <Row>
                <Col span={9}>
                  {/* 忽略检查 */}
                  <Form.Item label="是否忽略检查" name="ignoreCheck" style={{marginTop: -10}}>
                    <Checkbox.Group>
                      <Checkbox value={'1'}>忽略检查</Checkbox>
                    </Checkbox.Group>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  {/* 检查环境 */}
                  <Form.Item label="检查环境:" name="checkEnv" style={{marginTop: -10}}>
                    <Select style={{width: '100%'}} showSearch>
                      {onlineBranchFormSelected.imgEnv}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </div>

          {/* ③ 上线前自动化检查设置 */}
          <div style={{marginTop: -30}}>
            <Divider plain>③ 上线前自动化检查设置</Divider>
            <Row style={{marginTop: -10}}>
              <Col>
                {/* 忽略检查 */}
                <Form.Item
                  label="是否忽略检查"
                  name="autoBeforeIgnoreCheck"
                  style={{marginTop: -10}}
                >
                  <Checkbox.Group>
                    <Checkbox value={'1'}>忽略检查</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row style={{marginTop: -10}}>
              <Col span={8}>
                {/* 检查类型 */}
                <Form.Item label="检查类型:" name="beforeCheckType" style={{marginTop: -10}}>
                  <Select mode="multiple" style={{width: '100%'}} showSearch>
                    {onlineBranchFormSelected.checkType}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={9}>
                {/* 测试环境 */}
                <Form.Item
                  label="测试环境:"
                  name="beforeTestEnv"
                  style={{marginTop: -10, marginLeft: 10}}
                >
                  <Select style={{width: '100%'}} showSearch>
                    {onlineBranchFormSelected.imgEnv}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={7}>
                {/* 浏览器 */}
                <Form.Item
                  label="浏览器:"
                  name="beforeBrowser"
                  style={{marginTop: -10, marginLeft: 10}}
                >
                  <Select style={{width: '100%'}} showSearch>
                    {onlineBranchFormSelected.browser}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* ④ 上线后自动化检查设置 */}
          <div style={{marginTop: -30}}>
            <Divider plain>④ 上线后自动化检查设置</Divider>
            <Row style={{marginTop: -10}}>
              <Col>
                {/* 忽略检查 */}
                <Form.Item
                  label="是否忽略检查"
                  name="autoAfterIgnoreCheck"
                  style={{marginTop: -10}}
                >
                  <Checkbox.Group>
                    <Checkbox value={'1'}>忽略检查</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row style={{marginTop: -10}}>
              <Col span={8}>
                {/* 检查类型 */}
                <Form.Item label="检查类型:" name="afterCheckType" style={{marginTop: -10}}>
                  <Select mode="multiple" style={{width: '100%'}} showSearch>
                    {onlineBranchFormSelected.checkType}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={9}>
                {/* 测试环境 */}
                <Form.Item
                  label="测试环境:"
                  name="afterTestEnv"
                  style={{marginTop: -10, marginLeft: 10}}
                >
                  <Select style={{width: '100%'}} showSearch>
                    {onlineBranchFormSelected.imgEnv}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={7}>
                {/* 浏览器 */}
                <Form.Item
                  label="浏览器:"
                  name="afterBrowser"
                  style={{marginTop: -10, marginLeft: 10}}
                >
                  <Select style={{width: '100%'}} showSearch>
                    {onlineBranchFormSelected.browser}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Spin spinning={onlineBranchModal.loading} tip="保存中...">
            <Form.Item>
              <Button
                style={{borderRadius: 5, marginLeft: 20, float: 'right'}}
                onClick={() => {
                  formForOnlineBranch.resetFields();
                }}
              >
                清空
              </Button>

              <Button
                type="primary"
                style={{
                  color: '#46A0FC',
                  backgroundColor: '#ECF5FF',
                  borderRadius: 5,
                  float: 'right',
                }}
                onClick={saveOnlineBranchResult}
              >
                保存{' '}
              </Button>
            </Form.Item>
          </Spin>

          {/* 隐藏字段，进行修改需要的字段 */}
          <Row style={{marginTop: -60}}>
            <Col span={2}>
              <Form.Item name="branchCheckId">
                <Input style={{width: 50, display: 'none'}}/>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="versionCheckId">
                <Input style={{width: 50, display: 'none'}}/>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="envCheckId">
                <Input style={{width: 50, display: 'none'}}/>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="beforeAutomationId">
                <Input style={{width: 50, display: 'none'}}/>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="afterAutomationId">
                <Input style={{width: 50, display: 'none'}}/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

    </div>
  );
};

export default OnlineBranch;

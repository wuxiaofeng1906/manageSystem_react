import React, { useRef, useState, useEffect } from 'react';
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Spin,
  Switch,
  TreeSelect,
} from 'antd';
import { useModel } from '@@/plugin-model/useModel';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { deleteLockStatus, getLockStatus } from '../../lock/rowLock';
import { getOnlineBranchColumns } from './grid/columns';
import {
  getCheckNumForOnlineBranch,
  getModifiedData,
  saveOnlineBranchData,
  executeOnlineCheck,
} from './axiosRequest';
import moment from 'moment';
import dayjs from 'dayjs';
import {
  loadBranchNameSelect,
  loadTestEnvSelect,
  loadServiceSelect,
  loadTechSideSelect,
} from '../../comControl/controler';
import { alalysisInitData } from '../../datas/dataAnalyze';
import { getGridRowsHeight } from '../gridHeight';
import { releaseAppChangRowColor } from '../../operate';
import PreReleaseServices from '@/services/preRelease';
import { isEmpty } from 'lodash';
import { infoMessage } from '@/publicMethods/showMessages';

let newOnlineBranchNum = '';
const OnlineBranch: React.FC<any> = () => {
  const [formForOnlineBranch] = Form.useForm(); // 上线分支设置
  const onlineBranchGridApi = useRef<GridApi>();
  const {
    tabsData,
    lockedItem,
    modifyLockedItem,
    onlineBranch,
    setOnlineBranch,
    setDataReviewConfirm,
    allLockedArray,
    operteStatus,
  } = useModel('releaseProcess');
  const [executeStatus, setExecuteStatus] = useState(false); // 上线分支点击执行后的进度展示
  const [hotEnvList, setHotEnvList] = useState<any[]>([]); // 上线分支点击执行后的进度展示
  const [user] = useModel('@@initialState', (init) => [init.initialState?.currentUser]);
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
    // before_checkType: [],
    // after_checkType: [],
    // browser: [],
  });
  const [logModal, setLogModal] = useState({
    show: false,
    autoUrl: { style: 'none', ui: '', api: '' },
    versionUrl: { style: 'none', content: <div></div> },
    iconCheckUrl: { style: 'none', content: <div></div> },
    coveStatus: { style: 'none', content: <div></div> },
  });
  const onlineBranchGridReady = (params: GridReadyEvent) => {
    onlineBranchGridApi.current = params.api;
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
    // console.log(newOnlineBranchNum, { ...formData, checkEnv: formData.imageevn });
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
      if (onlineBranchModal.title === '修改') {
        deleteLockStatus(lockedItem);
      }
      const newData: any = await alalysisInitData('onlineBranch', tabsData.activeKey);
      if (newData.onlineBranch) {
        setOnlineBranch({
          gridHight: getGridRowsHeight(newData.onlineBranch, true),
          gridData: newData.onlineBranch,
        });
      }

      // 刷新数据review确认框
      const reviewData: any = await alalysisInitData('dataReviewConfirm', tabsData.activeKey);
      if (reviewData.reviewData_confirm) {
        setDataReviewConfirm({
          gridHight: getGridRowsHeight(reviewData.reviewData_confirm),
          gridData: reviewData.reviewData_confirm,
        });
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

  // 根据分支名称获取服务
  const showServerSelect = async (params: any) => {
    setOnlineBranchFormSelected({
      ...onlineBranchFormSelected,
      server: await loadServiceSelect(params),
    });
    formForOnlineBranch.setFieldsValue({
      server: [],
    });
  };
  // 上线分支弹出窗口进行修改和新增
  (window as any).showOnlineBranchForm = async (type: any, params: any) => {
    // 是否是已完成发布
    if (type === 'add' && operteStatus) {
      message.error({
        content: `发布已完成，不能新增！`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      return;
    }
    let branchName = '';
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
      modifyLockedItem(
        `${tabsData.activeKey}-step4-onlineBranch-${oraData.checkHead?.branchCheckId}`,
      );
      // 服务
      const servers = oraData.versonCheck?.server;
      // 时间
      let mainSince;
      if (oraData.branchCheck?.branch_mainSince) {
        mainSince = moment(oraData.branchCheck?.branch_mainSince);
      }

      branchName = oraData.checkHead.branchName;
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
        autoBeforeIgnoreCheck: oraData.beforeOnlineCheck?.ignoreCheck,
        autoCheckResult: oraData.beforeOnlineCheck?.checkResult,

        //   隐藏字段，修改时需要使用
        branchCheckId: oraData.checkHead?.branchCheckId,
        versionCheckId: oraData.versonCheck?.versionCheckId,
        envCheckId: oraData.envCheck?.checkId,
        // 是否可热更新检查
        is_ignore: isEmpty(oraData.hotCheck?.release_env) ? ['1'] : undefined,
        check_env: oraData.hotCheck?.release_env,
        // beforeAutomationId: oraData.beforeOnlineCheck?.automationId,
        // afterAutomationId: oraData.afterOnlineCheck?.automationId,
      });

      const lockInfo = await getLockStatus(
        `${tabsData.activeKey}-step4-onlineBranch-${oraData.checkHead?.branchCheckId}`,
      );

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
      server: await loadServiceSelect(branchName),
      imgEnv: await loadTestEnvSelect(),
      // before_checkType: await loadCheckTypeSelect('before'),
      // after_checkType: await loadCheckTypeSelect('after'),
      // browser: await loadBrowserTypeSelect(),
    });
  };

  // 执行上线前检查：上线前版本检查、环境检查，自动化检查
  (window as any).excuteCheckData = async (type: string, checkNum: string, values: string) => {
    if (operteStatus) {
      message.error({
        content: `发布已完成，不能进行执行操作！`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      return;
    }
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
      onlineBranchGridApi.current?.setRowData(newData.onlineBranch);
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
  // 图标一致性检查日志显示
  (window as any).showIconCheckLog = (logUrl: any) => {
    if (!logUrl || logUrl.length === 0) {
      message.info({
        content: `图标库所包含地址一致，无检查日志！`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      return;
    }

    const logContent: any = [];
    if (logUrl[0].compar_warehouse !== undefined || logUrl[0].warehouse !== undefined) {
      logUrl.forEach((log: any) => {
        logContent.push(
          <div>
            {/* 原始仓库 */}
            <div style={{ textIndent: '2em' }}>
              <div>
                <label>{log.warehouse.name}</label>
                <label>【{log.warehouse.file}】 所包含图标库地址：</label>
              </div>
              <label style={{ color: 'orange' }}>
                {log.warehouse.tag_id}地址：{log.warehouse.src}
              </label>
            </div>

            {/* 被对比的仓库 */}
            <div style={{ textIndent: '2em' }}>
              <div>
                <label>{log.compar_warehouse.name}</label>
                <label>【{log.compar_warehouse.file}】 所包含图标库地址：</label>
              </div>
              <label style={{ color: 'red' }}>
                {log.compar_warehouse.tag_id}地址：{log.compar_warehouse.src}
              </label>
            </div>
          </div>,
        );
      });
    } else {
      logUrl.forEach((log: any) => {
        const log_detail = log.replaceAll('***', "'");
        logContent.push(<div>{log_detail}</div>);
      });
    }

    logContent.push(
      <div style={{ marginTop: 20 }}>
        <label> 检查结果：</label>
        <label style={{ color: '#A71429' }}> 图标库所包含地址不一致</label>
      </div>,
    );
    setLogModal({
      show: true,
      iconCheckUrl: {
        style: 'inline',
        content: <div style={{ marginTop: -15 }}> {logContent}</div>,
      },
      autoUrl: { style: 'none', ui: '', api: '' },
      versionUrl: { style: 'none', content: <div></div> },
      coveStatus: { style: 'none', content: <div></div> },
    });
  };

  (window as any).showHotUpdateCheckLog = (log: {
    present_env: string;
    online_env: string;
    servers_check: string;
  }) => {
    if (!log) {
      infoMessage('暂无可热更新检查日志！');
      return;
    }
    return Modal.info({
      title: '热更新检查日志',
      width: 1200,
      okButtonProps: { style: { display: 'none' } },
      closable: true,
      content: (
        <div style={{ whiteSpace: 'pre-wrap', maxHeight: 500, overflowY: 'auto' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '30%' }}>
              <strong>收集数据当前环境数据：</strong>
              <br />
              {log.present_env}
            </div>
            <div style={{ width: '30%' }}>
              <strong>收集数据线上环境数据：</strong>
              <br />
              {log.online_env}
            </div>
            <div style={{ width: '40%' }}>
              <strong>集群服务状态版本检查：</strong>
              <br />
              {log.servers_check}
            </div>
          </div>
        </div>
      ),
    });
  };

  // 版本检查URL跳转
  (window as any).versionCheckLogUrlClick = (logUrl: any) => {
    if (!logUrl) {
      message.error({
        content: '无检查日志，请执行后在查看！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return;
    }

    const goto = window.open('about:blank');
    if (goto) {
      goto.location.href = logUrl;
    }

    // const logs: any = [];
    // if (logUrl && logUrl.length > 0) {
    //   logUrl.forEach((ele: any) => {
    //     logs.push(
    //       <Form.Item name="appLog" label={`${ele.server}日志:`} style={{marginTop: -5}}>
    //         <a
    //           href={`${ele.check_url}`}
    //           target={'_black'}
    //           style={{textDecoration: 'underline'}}
    //         >
    //           {ele.check_url}
    //         </a>
    //       </Form.Item>)
    //
    //   });
    // }
    //
    // if (logs.length > 0) {
    //   setLogModal({
    //     iconCheckUrl: {style: 'none', content: <div></div>},
    //     autoUrl: {style: 'none', ui: '', api: ''},
    //     versionUrl: {style: 'inline', content: <div>{logs}</div>},
    //     coveStatus: {style: 'none', content: <div></div>},
    //     show: true,
    //   });
    // } else {
    //   message.error({
    //     content: '无检查日志，请执行后在查看！',
    //     duration: 1,
    //     style: {
    //       marginTop: '50vh',
    //     },
    //   });
    // }
  };

  // 自动化URL跳转
  (window as any).autoLogUrlClick = (checkType: string, logUrl: string) => {
    let ui_url = '';
    let api_url = '';
    if (checkType && logUrl) {
      const typeArray = checkType.split(',');
      const logArray = logUrl.split(',');

      if (typeArray.length === 1 && logArray.length === 1) {
        // 仅有一个检查和一个日志
        if (typeArray[0] === '1') {
          // 是UI，2是接口
          ui_url = logArray[0].toString();
        } else if (typeArray[0] === '2') {
          api_url = logArray[0].toString();
        }
      } else if (typeArray.length === 2 && logArray.length === 2) {
        if (typeArray[0] === '1') {
          // 是UI，2是接口
          ui_url = logArray[0].toString();
        } else if (typeArray[0] === '2') {
          api_url = logArray[0].toString();
        }

        if (typeArray[1] === '1') {
          // 是UI，2是接口
          ui_url = logArray[1].toString();
        } else if (typeArray[1] === '2') {
          api_url = logArray[1].toString();
        }
      }
    }

    if (ui_url || api_url) {
      setLogModal({
        iconCheckUrl: { style: 'none', content: <div></div> },
        autoUrl: { style: 'inline', ui: ui_url, api: api_url },
        versionUrl: { style: 'none', content: <div></div> },
        coveStatus: { style: 'none', content: <div></div> },
        show: true,
      });
    } else {
      message.error({
        content: '无检查日志，请执行后在查看！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    }
  };

  // 封板状态日志显示
  (window as any).showCoverStatusLog = (params: any) => {
    const contentDiv: any = [];
    if (params && params.length) {
      params.forEach((path: any) => {
        const namePath = path.name_path;
        if (namePath && namePath.length > 0) {
          namePath.forEach((ele: any) => {
            // {/* 【backend/apps/asset 】【已封版】检查开始时间：2022-04-13 17:23:01 ～ 检查结束时间: 2022-04-13 17:23:25 */}
            let Color = 'black';
            if (ele.sealing_version === '已封版') {
              Color = '#2BF541';
            }
            if (ele.sealing_version === '未封版') {
              Color = 'orange';
            }
            contentDiv.push(
              <div>
                <label>【{ele.name_path}】</label>【
                <label style={{ color: Color }}>{ele.sealing_version}</label>】
                <label>
                  检查开始时间:{ele.version_check_start_time}~检查结束时间：
                  {ele.version_check_start_time}
                </label>
                <label style={{ marginLeft: 8, wordBreak: 'break-all' }}>
                  封版时间:
                  {ele.sealing_version_time
                    ? dayjs(ele.sealing_version_time).format('YYYY-MM-DD HH:mm:ss')
                    : ''}
                </label>
              </div>,
            );
          });
        }
      });
    }

    if (contentDiv.length > 0) {
      setLogModal({
        show: true,
        iconCheckUrl: { style: 'none', content: <div></div> },
        autoUrl: { style: 'none', ui: '', api: '' },
        versionUrl: { style: 'none', content: <div></div> },
        coveStatus: {
          style: 'inline',
          content: <div style={{ height: 300, overflowY: 'scroll' }}>{contentDiv}</div>,
        },
      });
    } else {
      message.error({
        content: '无封版日志！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    }
  };

  (window as any).refreshStatus = async (data: {
    ready_release_num: string;
    refresh_param: string;
  }) => {
    if (operteStatus) {
      message.error({
        content: '发布已完成，不能进行执行操作',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return;
    }
    setExecuteStatus(true);
    await PreReleaseServices.refreshCheckStatus(data);
    // 刷新界面
    const newData: any = await alalysisInitData('onlineBranch', tabsData.activeKey);
    onlineBranchGridApi.current?.setRowData(newData.onlineBranch);
    setExecuteStatus(false);
  };
  // 是否可热更新检查
  (window as any).hotUpdateCheckStatus = async (check_num: string, status: string) => {
    if (status == 'running') return infoMessage('正在执行中，请稍后');
    if (operteStatus) {
      infoMessage('发布已完成，不能进行执行操作');
      return;
    }
    setExecuteStatus(true);
    try {
      await PreReleaseServices.hotUpdateCheck({
        user_name: user?.name,
        user_id: user?.userid,
        check_num,
      });
      // 刷新界面
      const newData: any = await alalysisInitData('onlineBranch', tabsData.activeKey);
      onlineBranchGridApi.current?.setRowData(newData.onlineBranch);
      setExecuteStatus(false);
    } catch (e) {
      setExecuteStatus(false);
    }
  };

  // 日志显示弹窗取消
  const autoCancle = () => {
    setLogModal({
      show: false,
      iconCheckUrl: { style: 'none', content: <div></div> },
      autoUrl: { style: 'none', ui: '', api: '' },
      versionUrl: { style: 'none', content: <div></div> },
      coveStatus: { style: 'none', content: <div></div> },
    });
  };

  useEffect(() => {
    PreReleaseServices.getEnvList().then((res) => {
      const formatdata = Object.entries(res)?.map(([k, v]) => ({ key: k, value: k, label: v }));
      setHotEnvList(formatdata);
    });
  }, []);

  return (
    <div>
      {/* 上线分支 */}
      <div>
        <fieldset className={'fieldStyle'}>
          <legend className={'legendStyle'}>
            Step2 上线分支
            <label style={{ color: 'Gray' }}> (值班测试填写)</label>
          </legend>

          <div>
            {/* ag-grid 表格 */}
            <div>
              <Spin spinning={executeStatus} tip="执行中...">
                <div
                  className="ag-theme-alpine"
                  style={{ height: onlineBranch.gridHight, width: '100%', marginTop: -12 }}
                >
                  <AgGridReact
                    columnDefs={getOnlineBranchColumns()} // 定义列
                    rowData={onlineBranch.gridData} // 数据绑定
                    defaultColDef={{
                      resizable: true,
                      sortable: true,
                      suppressMenu: true,
                      // autoHeight: true,
                      minWidth: 75,
                      cellStyle: () => ({
                        // 单元格垂直居中显示
                        display: 'flex',
                        alignItems: 'center',
                      }),
                    }}
                    headerHeight={25}
                    rowHeight={65}
                    getRowStyle={(params: any) => {
                      return releaseAppChangRowColor(
                        allLockedArray,
                        'step4-onlineBranch',
                        params.data?.branch_check_id,
                      );
                    }}
                    onRowDataChanged={onlineBranchGridReady}
                    onGridReady={onlineBranchGridReady}
                    onGridSizeChanged={onlineBranchGridReady}
                    onColumnEverythingChanged={onlineBranchGridReady}
                  />
                </div>
              </Spin>
            </div>
            <div style={{ fontSize: 'smaller', marginTop: 10 }}>
              1、版本检查、环境一致性检查、自动化检查，在需要的时间节点，点击手动触发按钮，进行按需检查；
              <br />
              2、检查状态分为：是、否、检查中、未开始、忽略等5种状态；
              <br />
              3、点击检查日志链接，可以进入检查的详情页面。
            </div>
          </div>
        </fieldset>
      </div>

      {/* 上线分支设置  */}
      <Modal
        title={`上线分支设置-${onlineBranchModal.title}`}
        visible={onlineBranchModal.shown} // onlineBranchModal.shown
        onCancel={onlineBranchCancle}
        maskClosable={false}
        centered={true}
        footer={null}
        width={900}
        bodyStyle={{ height: '680px' }}
        destroyOnClose
      >
        <Form form={formForOnlineBranch}>
          {/* 总设置 */}
          <div style={{ marginTop: -15 }}>
            <Row gutter={8}>
              <Col span={12}>
                {/* 分支名称 */}
                <Form.Item
                  label="分支名称"
                  name="branchName"
                  required={true}
                  labelCol={{ span: 5 }}
                >
                  <Select
                    style={{ width: '100%' }}
                    placeholder="请选择对应的分支名称！"
                    showSearch
                    onChange={showServerSelect}
                  >
                    {onlineBranchFormSelected.branchName}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                {/* 技术侧 */}
                <Form.Item label="技术侧" name="module" required={true} labelCol={{ span: 5 }}>
                  <Select style={{ width: '100%' }} showSearch placeholder="请选择相应的技术侧！">
                    {onlineBranchFormSelected.techSide}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  name="imageevn"
                  label="镜像环境"
                  required={true}
                  style={{ marginTop: -20 }}
                  labelCol={{ span: 5 }}
                >
                  <Select placeholder="请选择相应的环境！" showSearch style={{ width: '100%' }}>
                    {onlineBranchFormSelected.imgEnv}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="server"
                  label="上线服务"
                  style={{ marginTop: -20 }}
                  required={true}
                  labelCol={{ span: 5 }}
                >
                  <TreeSelect
                    placeholder="请选择相应的上线服务！"
                    style={{ width: '100%' }}
                    maxTagCount={'responsive'}
                    treeCheckable={true}
                    allowClear
                    treeDefaultExpandAll
                    treeData={onlineBranchFormSelected.server}
                    showSearch
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={15}>
                {/* 忽略前端单元测试检查 */}
                <Form.Item name="ignoreFrontCheck" style={{ marginLeft: 0, marginTop: -20 }}>
                  <Checkbox.Group>
                    <Checkbox value={'1'}>忽略前端单元测试检查</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
              <Col span={9}>
                {/* 忽略后端单元测试检查 */}
                <Form.Item name="ignoreBackendCheck" style={{ marginLeft: -14, marginTop: -20 }}>
                  <Checkbox.Group>
                    <Checkbox value={'1'}>忽略后端单元测试检查</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>
          </div>
          {/* ① 版本检查设置 */}
          <div style={{ marginTop: -50 }}>
            <Divider plain>① 版本检查设置</Divider>
            <div>
              <Card
                size="small"
                title="版本检查"
                style={{ width: '100%', marginTop: -10, height: 80, borderBottom: 0 }}
              >
                <Form.Item
                  name="verson_check"
                  label="是否开启："
                  valuePropName="checked"
                  style={{ marginTop: -10 }}
                >
                  <Switch checkedChildren="是" unCheckedChildren="否" style={{ marginLeft: 40 }} />
                </Form.Item>
              </Card>
            </div>
            <div>
              <Card
                size="small"
                title="检查上线分支是否包含对比分支的提交"
                style={{ width: '100%', height: 190 }}
              >
                <Form.Item
                  name="branchcheck"
                  label="是否开启："
                  valuePropName="checked"
                  style={{ marginTop: -10 }}
                >
                  <Switch checkedChildren="是" unCheckedChildren="否" style={{ marginLeft: 40 }} />
                </Form.Item>

                <Form.Item
                  label="被对比的主分支"
                  name="branch_mainBranch"
                  style={{ marginTop: -25 }}
                >
                  <Select
                    style={{ width: 415 }}
                    showSearch
                    mode="multiple"
                    maxTagCount={'responsive'}
                  >
                    {onlineBranchFormSelected.branchName}
                  </Select>

                  {/*<Checkbox.Group>*/}
                  {/*  <Checkbox value={'stage'}>stage</Checkbox>*/}
                  {/*  <Checkbox value={'master'}>master</Checkbox>*/}
                  {/*</Checkbox.Group>*/}
                </Form.Item>

                <Form.Item label="技术侧" name="branch_teachnicalSide" style={{ marginTop: -25 }}>
                  <Checkbox.Group style={{ marginLeft: 56 }}>
                    <Checkbox value={'front'}>前端</Checkbox>
                    <Checkbox value={'backend'}>后端</Checkbox>
                  </Checkbox.Group>
                </Form.Item>

                <Form.Item label="对比起始时间" name="branch_mainSince" style={{ marginTop: -25 }}>
                  <DatePicker style={{ marginLeft: 13, width: 415 }} />
                </Form.Item>
                <div style={{ color: 'gray', marginTop: -25, marginLeft: 110 }}>
                  默认时间代表查询近一周的数据
                </div>
              </Card>
            </div>
          </div>
          {/* ② 环境一致性检查 */}
          <div style={{ marginTop: -10 }}>
            <Divider plain>② 环境一致性检查</Divider>
            <div>
              <Row>
                <Col span={9}>
                  {/* 忽略检查 */}
                  <Form.Item label="是否忽略检查" name="ignoreCheck" style={{ marginTop: -10 }}>
                    <Checkbox.Group>
                      <Checkbox value={'1'}>忽略检查</Checkbox>
                    </Checkbox.Group>
                  </Form.Item>
                </Col>
                {/*<Col span={15}>*/}
                {/*  /!* 检查环境 *!/*/}
                {/*  <Form.Item label="检查环境:" name="checkEnv" style={{ marginTop: -10 }}>*/}
                {/*    <Select style={{ width: '100%' }} showSearch>*/}
                {/*      {onlineBranchFormSelected.imgEnv}*/}
                {/*    </Select>*/}
                {/*  </Form.Item>*/}
                {/*</Col>*/}
              </Row>
            </div>
          </div>
          {/* ③ 是否可以热更新检查 */}
          <div style={{ marginTop: -35 }}>
            <Divider plain>③ 是否可以热更新检查</Divider>
            <div>
              <Row>
                <Col span={6}>
                  {/* 忽略检查 */}
                  <Form.Item label="是否忽略检查" name="is_ignore" style={{ marginTop: -10 }}>
                    <Checkbox.Group>
                      <Checkbox value={'1'}>忽略检查</Checkbox>
                    </Checkbox.Group>
                  </Form.Item>
                </Col>
                <Col span={18}>
                  {/* 发布环境 */}
                  <Form.Item label="发布环境:" name="check_env" style={{ marginTop: -10 }}>
                    <Select
                      style={{ width: 415 }}
                      showSearch
                      options={hotEnvList}
                      placeholder={'发布环境'}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </div>
          {/* ④ 上线前自动化检查设置 */}
          <div style={{ marginTop: -35 }}>
            <Divider plain>④ 上线前自动化检查设置</Divider>
            <Row style={{ marginTop: -10 }}>
              <Col>
                {/* 忽略检查 */}
                <Form.Item
                  label="是否忽略检查"
                  name="autoBeforeIgnoreCheck"
                  style={{ marginTop: -10 }}
                >
                  <Checkbox.Group>
                    <Checkbox value={'yes'}>忽略检查</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ marginTop: -20 }}>
              <Form.Item label="检查结果" name="autoCheckResult">
                <Checkbox.Group style={{ width: '100%', marginLeft: 27 }}>
                  <Row>
                    <Col span={7}>
                      <Checkbox value="ui">UI执行通过</Checkbox>
                    </Col>
                    <Col span={9}>
                      <Checkbox value="applet">小程序执行通过</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="api">接口执行通过</Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Row>
          </div>
          {/* 保存、清空按钮 */}
          <Spin spinning={onlineBranchModal.loading} tip="保存中...">
            <Form.Item style={{ marginTop: -15 }}>
              <Button
                type="primary"
                style={{
                  color: '#46A0FC',
                  backgroundColor: '#ECF5FF',
                  borderRadius: 5,
                  float: 'right',
                  marginLeft: 20,
                }}
                onClick={saveOnlineBranchResult}
                disabled={operteStatus}
              >
                保存
              </Button>
              <Button
                style={{ borderRadius: 5, float: 'right' }}
                onClick={() => {
                  formForOnlineBranch.resetFields();
                }}
                disabled={operteStatus}
              >
                清空
              </Button>
            </Form.Item>
          </Spin>
          {/* 隐藏字段，进行修改需要的字段 */}
          <Row style={{ marginTop: -60 }}>
            <Col span={2}>
              <Form.Item name="branchCheckId">
                <Input style={{ width: 50, display: 'none' }} />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="versionCheckId">
                <Input style={{ width: 50, display: 'none' }} />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="envCheckId">
                <Input style={{ width: 50, display: 'none' }} />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="beforeAutomationId">
                <Input style={{ width: 50, display: 'none' }} />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="afterAutomationId">
                <Input style={{ width: 50, display: 'none' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 日志的弹窗 */}
      <Modal
        title={'日志'}
        visible={logModal.show}
        onCancel={autoCancle}
        centered={true}
        footer={null}
        width={550}
      >
        <Form>
          {/* 自动化日志 */}
          <div style={{ display: logModal.autoUrl.style }}>
            <Form.Item name="UiLog" label="UI日志:" style={{ marginTop: -15 }}>
              <a
                href={`${logModal.autoUrl.ui}`}
                target={'_black'}
                style={{ textDecoration: 'underline' }}
              >
                {logModal.autoUrl.ui}
              </a>
            </Form.Item>

            <Form.Item name="interfaceLog" label="接口日志:" style={{ marginTop: -15 }}>
              <a
                href={`${logModal.autoUrl.api}`}
                target={'_black'}
                style={{ textDecoration: 'underline' }}
              >
                {logModal.autoUrl.api}
              </a>
            </Form.Item>
          </div>

          {/* 版本检查 */}
          <div style={{ display: logModal.versionUrl.style }}>{logModal.versionUrl.content}</div>

          {/* 图标一致性检查日志 */}
          <div style={{ display: logModal.iconCheckUrl.style }}>
            {logModal.iconCheckUrl.content}
          </div>
          {/* 封版状态日志 */}
          <div style={{ display: logModal.coveStatus.style }}>{logModal.coveStatus.content}</div>

          {/* <Form.Item>
            <Button style={{float: 'right'}} onClick={autoCancle}>
              关闭
            </Button>
          </Form.Item> */}
        </Form>
      </Modal>
    </div>
  );
};

export default OnlineBranch;

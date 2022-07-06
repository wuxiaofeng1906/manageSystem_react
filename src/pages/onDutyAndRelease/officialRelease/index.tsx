import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {errorMessage} from '@/publicMethods/showMessages';
import {AgGridReact} from 'ag-grid-react';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select} from 'antd';
import './style/style.css';
import {useRequest} from 'ahooks';
import {loadDutyNamesSelect} from '@/pages/onDutyAndRelease/preRelease/comControl/controler';
import {getHeight} from '@/publicMethods/pageSet';
import {releaseColumns} from './grid/columns';
import moment from 'moment';
import {
  getOfficialReleaseDetails,
  cancleReleaseResult,
  editReleaseForm,
  runAutoCheck,
  getOnlineAutoResult,
  getOnlineEnv,
} from './axiosRequest/apiPage';
import {sucMessage} from '@/publicMethods/showMessages';
import {getCurrentUserInfo} from '@/publicMethods/authorityJudge';
import {history} from '@@/core/history';

// 编辑后的数据
let otherSaveCondition: any = {
  grayReleaseNums: [], // 灰度发布编号
  releaseEnv: '', // 发布集群
  releaseResult: 'unknown', // 发布结果
  onlineReleaseNum: '', // 正式发布编号
};
let onlineEnv: any = [];
const {Option} = Select;

const OfficialRelease: React.FC<any> = (props: any) => {

  const onlineReleaseNum = props.location?.query?.onlineReleaseNum; // 正式发布列表的数据
  const historyQuery = props.location?.query?.history === 'true';
  const releaseType = props.location?.query?.releaseType;
  const dutyNameArray = useRequest(() => loadDutyNamesSelect(true)).data; // 关联值班名单
  const pageData = useRequest(() => getOfficialReleaseDetails(onlineReleaseNum, releaseType)).data; // 界面数据获取
  onlineEnv = useRequest(() => getOnlineEnv(releaseType)).data; // 上线集群环境

  const releaseServiceGridApi = useRef<GridApi>();
  const serviceGridReady = (params: GridReadyEvent) => {
    releaseServiceGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const [formForOfficialRelease] = Form.useForm();

  /* region 检查总览 */
  // 检查总览的颜色
  const [processStatus, setProcessStatus] = useState({processColor: 'gray'});

  // 显示进度
  const showProcessStatus = () => {
    const releaseInfo = formForOfficialRelease.getFieldsValue();
    if (otherSaveCondition.releaseEnv && releaseInfo.pulishTime && releaseInfo.relateDutyName) {
      setProcessStatus({
        ...processStatus,
        processColor: '#2BF541',
      });
    } else {
      setProcessStatus({
        ...processStatus,
        processColor: 'gray',
      });
    }
  };

  /* endregion 编辑即保存 */

  /* region 发布结果 */
  const [pulishResultForm] = Form.useForm();
  // 自动化线上发布结果
  const [autoCheckRt, setAutoCheckRt] = useState(null);
  // 发布结果确认弹窗
  const [isModalVisible, setModalVisible] = useState({
    show: false,
    result: '',
    hintMsg: '',
    autoCheckDisabled: true,
  });

  // 取消发布
  const handleCancel = () => {
    setModalVisible({
      ...isModalVisible,
      result: 'unknown',
      show: false,
    });
  };

  // 保存发布方式及时间
  const saveReleaseInfo = async () => {
    debugger;
    console.log(otherSaveCondition);

    //   获取发布方式及时间
    const releaseInfo = formForOfficialRelease.getFieldsValue();
    otherSaveCondition.grayReleaseNums.length = 0;
    // 获取灰度所有的发布编号
    releaseServiceGridApi.current?.forEachNode((node: any) => {
      const readyReleaseNum = node.data?.ready_release_num;
      otherSaveCondition.grayReleaseNums.push(readyReleaseNum);
    });

    const result = await editReleaseForm(releaseInfo, otherSaveCondition);
    if (result.code === 200) {
      sucMessage('数据保存成功！');
      // 需要回显编辑人和编辑时间
      formForOfficialRelease.setFieldsValue({
        editor: getCurrentUserInfo().name,
        editTime: result?.data?.edit_time,
      });
      // 需要判断整体进度是否已完成
      showProcessStatus();
      setModalVisible({
        ...isModalVisible,
        result: otherSaveCondition.releaseResult,
        show: false,
      });
    }
  };

  // 点击保存按钮
  const handleOk = async () => {
    const formData = pulishResultForm.getFieldsValue();
    // 如果是发布成功，则需要判断下面自动化选项是否勾选
    if (!isModalVisible.autoCheckDisabled) {
      // 是发布成功
      if (formData.ignoreAfterCheck === undefined || formData.ignoreAfterCheck.length === 0) {
        // 不忽略的时候
        if (formData.checkResult === undefined || formData.checkResult.length === 0) {
          // 一个结果都没选中
          errorMessage('检查结果必须至少勾选一项！');
          return;
        }
      }

      // 发布成功才调用自动化检查接口
      const result = await runAutoCheck(formData, otherSaveCondition.onlineReleaseNum);
      if (result.code !== 200) {
        errorMessage(`发布成功后自动化检查结果保存失败：${result}`);
      } else {
        // 保存成功后获取自动化检查结果
        const autoRt: any = await getOnlineAutoResult(otherSaveCondition.onlineReleaseNum);
        setAutoCheckRt(autoRt);
      }
    }

    // 调用保存接口: 如果是取消，则单独调用取消接口
    if (isModalVisible.result === 'cancel') {
      const result = await cancleReleaseResult(otherSaveCondition.onlineReleaseNum);
      if (result.code === 200) {
        sucMessage('当前发布取消成功！');
        setModalVisible({
          ...isModalVisible,
          result: 'unknown',
          show: false,
        });
      }
    } else {
      saveReleaseInfo();
    }

    // 无论发布成功或者失败，都要跳转到详情页面
    history.push(`/onDutyAndRelease/releaseHistory`);
    //   需要清空原有的条件，不然重新进来保存时发布结果还是原有的，会报错。
    otherSaveCondition = {
      grayReleaseNums: [], // 灰度发布编号
      releaseEnv: '', // 发布集群
      releaseResult: 'unknown', // 发布结果
      onlineReleaseNum: '', // 正式发布编号
    }
  };

  // 发布结果下拉框选择
  const pulishResulttChanged = async (params: any) => {
    // 需要判断发布服务有没有填写完成(取消发布可以不填写全)
    if (processStatus.processColor === 'gray' && params !== 'cancel') {
      errorMessage('发布服务未填写完成，不能填写发布结果!');
      return;
    }

    // 不同选择弹出不同的提示框
    let autoDisable = true;
    let hintMsgs = '请确认是否修改服务发布结果为空！';
    if (params === 'success') {
      hintMsgs = '请确认服务是否发布成功，如有自动化也执行通过!';
      autoDisable = false;
    } else if (params === 'failure') {
      hintMsgs = '请确认服务是否发布失败！';
    } else if (params === 'cancel') {
      hintMsgs = '请确认是否取消发布！';
    }
    setModalVisible({
      autoCheckDisabled: autoDisable,
      hintMsg: hintMsgs,
      result: params,
      show: true,
    });

    pulishResultForm.resetFields();
    // 赋值发布结果
    otherSaveCondition.releaseResult = params;
  };

  /* endregion 发布结果 */

  // 显示界面
  const showPagesData = async (sourceData: any) => {
    if (sourceData && sourceData.length > 0) {
      // 当前只有一个Tab，不会有多个。
      const datas = sourceData[0];
      otherSaveCondition.onlineReleaseNum = datas.online_release_num;
      let releaseTime = null;
      if (datas.plan_release_time && datas.plan_release_time !== 'Invalid Date') {
        releaseTime = moment(datas.plan_release_time);
      }

      // 显示step1发布方式以及时间
      formForOfficialRelease.setFieldsValue({
        pulishType: datas.release_type,
        pulishMethod: datas.release_way,
        pulishTime: releaseTime,
        relateDutyName: datas.person_duty_num,
        editor: datas.edit_user,
        editTime: datas.edit_time,
      });

      // 显示step2 发布服务填写确认列表
      const gridData: any = [];
      const projectData = datas.project_info;
      if (projectData && projectData.length > 0) {
        projectData.forEach((ele: any, index: number) => {
          const details = {...ele};
          if (index === 0) {
            details['rowSpan'] = projectData.length;
          }
          details['release_env'] = datas.release_env;
          gridData.push(details);
        });
      }
      releaseServiceGridApi.current?.setRowData(gridData);
      setModalVisible({
        ...isModalVisible,
        result: datas.release_result,
      });

      // 显示自动化检查结果
      const autoRt: any = await getOnlineAutoResult(otherSaveCondition.onlineReleaseNum);
      setAutoCheckRt(autoRt);
    }
  };
  useEffect(() => {
    showPagesData(pageData);
  }, [pageData]);

  // 表格的屏幕大小自适应
  const [gridHeight, setGridHeight] = useState(getHeight() - 180);
  window.onresize = function () {
    setGridHeight(getHeight() - 180);
  };

  return (
    <PageContainer>
      <div style={{marginTop: -15}}>
        {/* 检查总览 */}
        <div style={{backgroundColor: 'white', paddingTop: 10, height: 45}}>
          <label style={{fontWeight: 'bold', marginLeft: 5}}>检查总览：</label>
          <label>
            <button
              style={{
                height: 13,
                width: 13,
                border: 'none',
                backgroundColor: processStatus.processColor,
              }}
            ></button>
            &nbsp;发布服务已填写完成
          </label>
          <label style={{marginLeft: 10}}>
            <label style={{fontWeight: 'bold'}}>线上发布结果：</label>
            <Select
              size={'small'}
              style={{width: 100}}
              onChange={pulishResulttChanged}
              value={isModalVisible.result}
              disabled={historyQuery}
            >
              <Option key={'success'} value={'success'}>
                发布成功
              </Option>
              <Option key={'failure'} value={'failure'}>
                发布失败
              </Option>
              <Option key={'cancel'} value={'cancel'}>
                取消发布
              </Option>
              <Option key={'unknown'} value={'unknown'}>
                {' '}
              </Option>
            </Select>
          </label>

          <label style={{marginLeft: 10}}>{autoCheckRt}</label>
        </div>
        {/* step 1 发布方式及时间 */}
        <div style={{backgroundColor: 'white', marginTop: 4}}>
          <fieldset className={'fieldStyle'} style={{height: 135}}>
            <legend className={'legendStyle'}>
              Step1 发布方式及时间
              <label style={{color: 'Gray'}}> (值班测试填写)</label>
            </legend>
            <div>
              <Form form={formForOfficialRelease}>
                <Row gutter={8} style={{marginTop: -5}}>
                  <Col span={7}>
                    {/* 发布类型 */}
                    <Form.Item label="发布类型:" name="pulishType">
                      <Select disabled={true}>
                        <Option key={'gray'} value={'gray'}>
                          灰度发布
                        </Option>
                        <Option key={'online'} value={'online'}>
                          正式发布
                        </Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    {/* 发布方式 */}
                    <Form.Item label="发布方式:" name="pulishMethod">
                      <Select onChange={saveReleaseInfo} disabled={historyQuery}>
                        <Option key={'stop_server'} value={'stop_server'}>
                          停服
                        </Option>
                        <Option key={'keep_server'} value={'keep_server'}>
                          不停服
                        </Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    {/* 发布时间 */}
                    <Form.Item label="计划发布时间" name="pulishTime">
                      <DatePicker
                        defaultValue={moment(moment().add(1, 'days').format('YYYY-MM-DD'))}
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        disabled={historyQuery}
                        style={{width: '100%'}}
                        onChange={saveReleaseInfo}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8} style={{marginTop: -10}}>
                  <Col span={14}>
                    {/* 关联值班名单 */}
                    <Form.Item label="关联值班名单" name="relateDutyName" style={{marginLeft: 5}}>
                      <Select
                        filterOption={(inputValue: string, option: any) =>
                          !!option.children.includes(inputValue)
                        }
                        showSearch
                        disabled={historyQuery}
                        onChange={saveReleaseInfo}
                      >
                        {dutyNameArray}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    {/* 编辑人 */}
                    <Form.Item label="编辑人:" name="editor">
                      <Input
                        style={{
                          border: 'none',
                          backgroundColor: 'white',
                          color: 'black',
                          marginLeft: -5,
                        }}
                        disabled
                      />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    {/* 编辑时间 */}
                    <Form.Item label="编辑时间:" name="editTime" style={{marginLeft: 5}}>
                      <Input
                        style={{
                          border: 'none',
                          backgroundColor: 'white',
                          color: 'black',
                          marginLeft: -5,
                        }}
                        disabled
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </fieldset>
        </div>

        {/* step 2 发布服务填写确认 */}
        <div style={{backgroundColor: 'white', marginTop: 4}}>
          <fieldset className={'fieldStyle'}>
            <legend className={'legendStyle'}>
              Step2 发布服务填写确认
              <label style={{color: 'Gray'}}> (值班测试填写)</label>
            </legend>
            <div>
              <div
                className="ag-theme-alpine"
                style={{height: gridHeight, width: '100%', marginTop: -12}}
              >
                <AgGridReact
                  columnDefs={releaseColumns} // 定义列
                  rowData={[]} // 数据绑定
                  defaultColDef={{
                    resizable: true,
                    sortable: true,
                    suppressMenu: true,
                    minWidth: 75,
                    cellStyle: {'line-height': '35px'},
                  }}
                  headerHeight={35}
                  rowHeight={30}
                  suppressRowTransform={true} // 合并单元格需要
                  onGridReady={serviceGridReady}
                  onGridSizeChanged={serviceGridReady}
                  onColumnEverythingChanged={serviceGridReady}
                  suppressRowTransform={true}
                  frameworkComponents={{
                    releaseEnvRenderer: (params: any) => {
                      if (params && params.data.rowSpan) {
                        let currentValue;
                        if (params.value) {
                          currentValue = params.value.split(',');
                          otherSaveCondition.releaseEnv = params.value;
                        }
                        showProcessStatus(); // 展示进度
                        return (
                          <Select
                            size={'small'}
                            placeholder={'请选择'}
                            defaultValue={currentValue}
                            bordered={false}
                            style={{width: '100%'}}
                            mode={'multiple'}
                            onChange={(newValue: any) => {
                              otherSaveCondition.releaseEnv = newValue.join(',');
                              saveReleaseInfo();
                            }}
                            maxTagCount={'responsive'}
                            disabled={historyQuery}
                          >
                            {onlineEnv}
                          </Select>
                        );
                      }
                      return '';
                    },
                  }}
                ></AgGridReact>
              </div>
            </div>
          </fieldset>
        </div>

        {/* 发布结果确认弹出窗   */}
        <Modal
          title="发布结果确认"
          visible={isModalVisible.show}
          width={400}
          onCancel={handleCancel}
          centered={true}
          bodyStyle={{height: 120}}
          footer={[
            <Button key="cancel" onClick={handleCancel} style={{borderRadius: 5}}>
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleOk}
              style={{
                color: '#46A0FC',
                backgroundColor: '#ECF5FF',
                borderRadius: 5,
              }}
            >
              确定
            </Button>,
          ]}
        >
          <Form form={pulishResultForm} style={{marginTop: -15}}>
            <Form.Item>{isModalVisible.hintMsg}</Form.Item>
            <Form.Item
              label="是否忽略发布成功后自动化检查:"
              name="ignoreAfterCheck"
              style={{marginTop: -25}}
            >
              <Checkbox.Group style={{width: '100%'}} disabled={isModalVisible.autoCheckDisabled}>
                <Checkbox value="yes">忽略检查</Checkbox>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item label="检查结果:" name="checkResult" style={{marginTop: -25}}>
              <Checkbox.Group style={{width: '100%'}} disabled={isModalVisible.autoCheckDisabled}>
                <Checkbox value="ui">UI执行通过</Checkbox>
                <Checkbox value="applet">小程序执行通过</Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageContainer>
  );
};

export default OfficialRelease;

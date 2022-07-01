import React, {useEffect, useState} from 'react';
import {Button, Col, DatePicker, Form, Input, message, Row, Select} from 'antd';
import {useModel} from '@@/plugin-model/useModel';
import {useRequest} from 'ahooks';
import {
  loadPrjNameSelect, loadReleaseTypeSelect, loadReleaseWaySelect, loadDutyNamesSelect
} from '../../comControl/controler';
import '../../style/style.css';
import moment from 'moment';
import {getLockStatus, deleteLockStatus} from '../../lock/rowLock';
import {savePreProjects} from './axiosRequest';
import {showProgressData} from '../../components/CheckProgress/processAnalysis';
import {getCheckProcess} from '../../components/CheckProgress/axiosRequest';
import {modifyTabsName} from "@/pages/onDutyAndRelease/preRelease/components/Tab/axiosRequest";
import {alalysisInitData} from "@/pages/onDutyAndRelease/preRelease/datas/dataAnalyze";

const userLogins: any = localStorage.getItem('userLogins');
const usersInfo = JSON.parse(userLogins);
const {Option} = Select;

const PreReleaseProject: React.FC<any> = () => {
  // 获取当前页面的进度数据
  const {tabsData, setTabsData, preReleaseData, modifyProcessStatus, lockedItem, modifyLockedItem, operteStatus} =
    useModel('releaseProcess');
  const [formForPreReleaseProject] = Form.useForm(); // 预发布

  const projectsArray = useRequest(() => loadPrjNameSelect()).data;
  const releaseTypeArray = useRequest(() => loadReleaseTypeSelect()).data;
  const releaseWayArray = useRequest(() => loadReleaseWaySelect()).data;
  const relateDutyNameArray = useRequest(() => loadDutyNamesSelect()).data;
  // 保存tab名
  const saveModifyName = async (activeKey: string, newTabName: string) => {
    // 被修改的一定是当前activekey中的数据
    const result = await modifyTabsName(activeKey, newTabName);
    if (result === '') {
      //   重置tab名
      // @ts-ignore
      const {tabPageInfo} = await alalysisInitData('tabPageInfo', '');
      if (tabPageInfo) {
        setTabsData(tabsData.activeKey, tabPageInfo.panes);
      }
    } else {
      message.error({
        content: result,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    }
  };

  // 自动修改tab名
  const autoModifyTabsName = (pulishType: any) => {

    // 获取当前标签页的真实名字
    const {activeKey} = tabsData;
    let activeTitle = "";
    if (tabsData.panes && (tabsData.panes).length > 0) {
      (tabsData.panes).forEach((ele: any) => {
        if (activeKey === ele.key) {
          activeTitle = (ele.title).toString();
        }

      });
    }

    // 判断选择的是灰度发布还是正式发布
    if (activeTitle === `${activeKey}正式预发布` && pulishType === "1") { // 灰度发布
      saveModifyName(activeKey, `${activeKey}灰度预发布`);

    } else if (activeTitle === `${activeKey}灰度预发布` && pulishType === "2") { // 正式发布
      saveModifyName(activeKey, `${activeKey}正式预发布`);
    }
  };
  // 保存预发布项目
  const savePreRelaseProjects = async () => {
    const datas = formForPreReleaseProject.getFieldsValue();
    const result = await savePreProjects(datas, tabsData.activeKey);

    if (result.errorMessage === '') {
      message.info({
        content: '保存成功！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      const modifyTime: any = result.datas;
      formForPreReleaseProject.setFieldsValue({
        editor: modifyTime.editor,
        editTime: modifyTime.editTime,
        checkListStatus: ""
      });
      // 保存成功后需要刷新状态
      const processData: any = await getCheckProcess(tabsData?.activeKey);
      if (processData) {
        modifyProcessStatus(await showProgressData(processData.data));
      }

      // 保存成功后需要判断tab标签有没有被修改过，如果有，则跳过，如果没有，上面的标签名字需要与发布类型同步，
      // 发布类型为正式发布，标签页需要改为xxxxxx正式预发布，如果是灰度发布，则改为xxxxx灰度预发布。
      autoModifyTabsName(datas.pulishType);

    } else {
      message.error({
        content: result.errorMessage,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    }

    // const lockedInfo = `${tabsData.activeKey}-step1-project-${datas.proid}`;
    deleteLockStatus(lockedItem);
  };

  // 编辑框聚焦时检查是否可以编辑
  const releaseItemFocus = async () => {

    const formData = formForPreReleaseProject.getFieldsValue();
    const proId = formData.proid;

    modifyLockedItem(`${tabsData.activeKey}-step1-project-${proId}`); // 如果是被锁了保存当前被锁的id
    const lockInfo = await getLockStatus(`${tabsData.activeKey}-step1-project-${proId}`);
    // console.log(lockInfo, `${tabsData.activeKey}-step1-project-${proId}`);
    if (lockInfo.errMessage) {
      const userInfo: any = lockInfo.data;
      if (userInfo.user_id !== usersInfo.userid) {
        message.error({
          content: `${lockInfo.errMessage}`,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      }
    }
  };

  useEffect(() => {
    if (preReleaseData) {
      formForPreReleaseProject.setFieldsValue({
        projectsName: preReleaseData?.projectId,
        pulishType: preReleaseData.release_type,
        pulishMethod: preReleaseData.release_way,
        pulishTime: moment(preReleaseData.plan_release_time),
        editor: preReleaseData.edit_user_name,
        editTime: preReleaseData.edit_time,
        proid: preReleaseData.pro_id,
        ignoreZentaoList: preReleaseData.ignoreZentaoList,
        checkListStatus: preReleaseData.checkListStatus,
        relateDutyName: preReleaseData.relateDutyName
      });
    }
  }, [preReleaseData]);

  return (
    <div>
      <div>
        <fieldset className={'fieldStyle'}>
          <legend className={'legendStyle'}>Step1 预发布项目
            <label style={{color: "Gray"}}> (值班测试填写)[只有global发布、修复0-7集群发布、修复2-7集群发布，选择"正式发布"; 其他都选择“灰度发布”]</label>
          </legend>

          <div style={{marginBottom: -20, marginTop: -5}}>
            <div style={{float: 'right', marginTop: 5}}>
              <Button
                type="primary"
                disabled={operteStatus}
                style={{
                  color: '#46A0FC',
                  backgroundColor: '#ECF5FF',
                  borderRadius: 5,
                  marginLeft: 10,
                  height: 60
                }}
                onClick={savePreRelaseProjects}
              >
                点击保存
              </Button>
            </div>

            <div>
              <Form form={formForPreReleaseProject}>
                <Row>
                  <Col span={11}>
                    {/* 项目名称 */}
                    <Form.Item label="项目名称:" name="projectsName">
                      <Select showSearch mode="multiple" onFocus={releaseItemFocus}>
                        {projectsArray}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={7}>
                    {/* 发布类型 */}
                    <Form.Item label="发布类型:" name="pulishType" style={{marginLeft: 5}}>
                      <Select onFocus={releaseItemFocus}>{releaseTypeArray}</Select>
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    {/* 发布方式 */}
                    <Form.Item label="发布方式:" name="pulishMethod" style={{marginLeft: 5}}>
                      <Select onFocus={releaseItemFocus}>{releaseWayArray}</Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row style={{marginTop: -15}}>
                  <Col span={11}>
                    {/* 发布时间 */}
                    <Form.Item label="发布时间" name="pulishTime" style={{marginLeft: 5}}>
                      <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        style={{width: '100%'}}
                        onFocus={releaseItemFocus}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={7}>
                    {/* 关联值班名单 */}
                    <Form.Item label="关联值班名单:" name="relateDutyName" style={{marginLeft: 5}}>
                      <Select onFocus={releaseItemFocus} showSearch
                              filterOption={(inputValue: string, option: any) =>
                                !!option.children.includes(inputValue)}>
                        {relateDutyNameArray}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    {/* 是否忽略禅道checklist */}
                    <Form.Item label="是否忽略禅道checklist:" name="ignoreZentaoList" style={{marginLeft: 5}}>
                      <Select onFocus={releaseItemFocus}>
                        <Option value="1">是</Option>
                        <Option value="2">否</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                </Row>
                <Row style={{marginTop: -20}}>
                  <Col span={12}>

                    <Form.Item label="禅道checklist检查状态:" name="checkListStatus">
                      <Input
                        style={{
                          border: 'none',
                          backgroundColor: 'white',
                          color: '#46A0FC',
                          marginLeft: -5,
                        }}
                        disabled
                      />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    {/* 编辑人信息 */}
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
                  <Col span={6}>
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
                  <Col span={1}>
                    {/* 隐藏的pro_id，对数据的操作需要 */}
                    <Form.Item name="proid">
                      <Input style={{display: 'none'}}/>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default PreReleaseProject;

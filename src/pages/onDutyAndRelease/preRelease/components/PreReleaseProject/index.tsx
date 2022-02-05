import React, {useEffect, useState} from 'react';
import {Button, Col, DatePicker, Form, Input, message, Row, Select} from 'antd';
import {useModel} from '@@/plugin-model/useModel';
import {useRequest} from 'ahooks';
import {
  loadPrjNameSelect,
  loadReleaseTypeSelect,
  loadReleaseWaySelect,
} from '../../comControl/controler';
import '../../style/style.css';
import moment from 'moment';
import {getLockStatus, deleteLockStatus} from '../../lock/rowLock';
import {savePreProjects} from './axiosRequest';
import {showProgressData} from '../../components/CheckProgress/processAnalysis';
import {getCheckProcess} from '../../components/CheckProgress/axiosRequest';

const userLogins: any = localStorage.getItem('userLogins');
const usersInfo = JSON.parse(userLogins);

const PreReleaseProject: React.FC<any> = () => {
  // 获取当前页面的进度数据
  const {tabsData, preReleaseData, modifyProcessStatus, lockedItem, modifyLockedItem} =
    useModel('releaseProcess');
  const [saveButtonDisable, setSaveButtonDisable] = useState(false); // 保存按钮是否可用
  const [formForPreReleaseProject] = Form.useForm(); // 预发布

  const projectsArray = useRequest(() => loadPrjNameSelect()).data;
  const releaseTypeArray = useRequest(() => loadReleaseTypeSelect()).data;
  const releaseWayArray = useRequest(() => loadReleaseWaySelect()).data;

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
      });
      // 保存成功后需要刷新状态
      const processData: any = await getCheckProcess(tabsData?.activeKey);
      if (processData) {
        modifyProcessStatus(showProgressData(processData.data));
      }
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

    const lockInfo = await getLockStatus(`${tabsData.activeKey}-step1-project-${proId}`);
    if (lockInfo.errMessage) {
      modifyLockedItem(`${tabsData.activeKey}-step1-project-${proId}`); // 如果是被锁了保存当前被锁的id
      const userInfo: any = lockInfo.data;
      if (userInfo.user_id !== usersInfo.userid) {
        message.error({
          content: `${lockInfo.errMessage}`,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
        setSaveButtonDisable(true);
      } else {
        setSaveButtonDisable(false);
      }
    } else {
      setSaveButtonDisable(false);
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
      });
    }
  }, [preReleaseData]);

  return (
    <div>
      <div>
        <fieldset className={'fieldStyle'}>
          <legend className={'legendStyle'}>Step1 预发布项目</legend>

          <div style={{marginBottom: -20, marginTop: -5}}>
            <div style={{float: 'right'}}>
              <Button
                type="primary"
                disabled={saveButtonDisable}
                style={{
                  color: '#46A0FC',
                  backgroundColor: '#ECF5FF',
                  borderRadius: 5,
                  marginLeft: 10,
                }}
                onClick={savePreRelaseProjects}
              >
                点击保存
              </Button>
            </div>

            <div>
              <Form form={formForPreReleaseProject}>
                <Row>
                  <Col span={8}>
                    {/* 项目名称 */}
                    <Form.Item label="项目名称:" name="projectsName">
                      <Select showSearch mode="multiple" onFocus={releaseItemFocus}>
                        {projectsArray}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={5}>
                    {/* 发布类型 */}
                    <Form.Item label="发布类型:" name="pulishType" style={{marginLeft: 5}}>
                      <Select onFocus={releaseItemFocus}>{releaseTypeArray}</Select>
                    </Form.Item>
                  </Col>

                  <Col span={5}>
                    {/* 发布方式 */}
                    <Form.Item label="发布方式:" name="pulishMethod" style={{marginLeft: 5}}>
                      <Select onFocus={releaseItemFocus}>{releaseWayArray}</Select>
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    {/* 发布时间 */}
                    <Form.Item label="发布时间:" name="pulishTime" style={{marginLeft: 5}}>
                      <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        style={{width: '100%'}}
                        onFocus={releaseItemFocus}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row style={{marginTop: -20}}>
                  <Col span={3}>
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

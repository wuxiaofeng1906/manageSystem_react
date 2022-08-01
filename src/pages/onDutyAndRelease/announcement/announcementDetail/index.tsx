import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { errorMessage, sucMessage } from '@/publicMethods/showMessages';
import { Button, DatePicker, Form, Input, Radio, Tabs, Divider, Popconfirm } from 'antd';
import './style.css';
import { useRequest } from 'ahooks';
import { postAnnouncement, getAnnouncement } from './axiosRequest/apiPage';
import moment from 'moment';
import { getHeight } from '@/publicMethods/pageSet';
import usePermission from '@/hooks/permission';
import { useParams } from 'umi';
import { isEmpty } from 'lodash';

const { TextArea } = Input;
const { TabPane } = Tabs;
let releaseTime = 'before'; // 升级前公告还是升级后公告
let announceId = 0; // 记录升级ID
const Announce: React.FC<any> = (props: any) => {
  const {
    id: releaseNum,
    status: operteStatus,
    type,
  } = useParams() as {
    id: string;
    status: string;
    type: 'add' | 'detail';
  };

  const { announcePermission } = usePermission();
  const hasPermission = announcePermission();

  const [announceContentForm] = Form.useForm();
  const [announcementNameForm] = Form.useForm();
  const [pageHeight, setPageHeight] = useState(getHeight());
  // 一键挂起公告按钮是否可用以及style
  const [buttonDisable, setButtonDisable] = useState({
    title: '前',
    disable: true,
    buttonStyle: '',
  });

  // 当表单种数据被改变时候
  const whenFormValueChanged = (changedFields: any, allFields: any) => {
    if (changedFields && changedFields.length > 0) {
      const fieldName = changedFields[0].name[0];
      let fieldValue = changedFields[0].value;
      switch (fieldName) {
        case 'announceTime':
          fieldValue = moment(fieldValue).format('YYYY-MM-DD HH:mm:ss');
          announceContentForm.setFieldsValue({
            showAnnounceTime: fieldValue,
          });
          break;
        case 'announceDetails_1':
          announceContentForm.setFieldsValue({
            announceDetails_1: fieldValue,
          });

          break;
        case 'announceDetails_2':
          announceContentForm.setFieldsValue({
            announceDetails_2: fieldValue,
          });

          break;
        case 'showUpdateDetails':
          announceContentForm.setFieldsValue({
            showUpdateDetails: fieldValue,
          });
          break;
        default:
          break;
      }

      const formData = announceContentForm.getFieldsValue();
      // 无论前面更新了哪个字段，后面的预览都要更新
      announceContentForm.setFieldsValue({
        UpgradeIntroDate: `"${formData.showAnnounceTime}"`,
        UpgradeDescription: `"${formData.announceDetails_1}${formData.showAnnounceTime}${formData.announceDetails_2}"`,
        isUpdated: `"${formData.showUpdateDetails}"`,
      });
    }
  };

  // 点击保存或者发布按钮
  const saveAndReleaseAnnouncement = async (releaseType: string) => {
    const basicInfo = {
      releaseNum,
      releaseTime,
      announceId,
      releaseType,
    };
    const nameValid = await announcementNameForm.validateFields();
    const formDatas = announceContentForm.getFieldsValue();
    if (!formDatas.announceDetails_1 || !formDatas.announceDetails_2) {
      errorMessage('公告详情不能为空！');
      return;
    }
    const result = await postAnnouncement({ ...formDatas, ...nameValid }, basicInfo);
    const operate = releaseType === 'save' ? '保存' : '公告挂起';
    if (result.code === 200) {
      sucMessage(`${operate}成功！`);
      setButtonDisable({
        ...buttonDisable,
        disable: false,
        buttonStyle: 'saveButtonStyle',
      });
    } else {
      errorMessage(`${operate}失败！`);
    }
  };
  const initForm = () => {
    const initTime = moment().add(1, 'day').startOf('day');

    announceContentForm.setFieldsValue({
      announceTime: initTime,
      announceDetails_1:
        releaseTime === 'after'
          ? '亲爱的用户：您好，企企经营管理平台已于'
          : '亲爱的用户：您好，企企经营管理平台将于',
      showAnnounceTime: initTime.format('YYYY-MM-DD HH:mm:ss'),
      announceDetails_2: '',
      showUpdateDetails: 'true',

      //   以下为预览数据
      UpgradeIntroDate: `"${initTime.format('YYYY-MM-DD HH:mm:ss')}"`,
      UpgradeDescription: '',
      isUpdated: 'true',
    });
  };

  // 展示界面数据
  const showFormData = (resData: any) => {
    //   有数据的时候需要显示在界面上
    if (resData.code === 4001) {
      // 没有发布公告，需要显示默认信息。
      initForm();
      setButtonDisable({
        title: releaseTime === 'after' ? '后' : '前',
        disable: true,
        buttonStyle: '',
      });
    } else if (resData.data) {
      // 有数据，则展示出来
      const { data } = resData;
      const time = data.upgrade_time;
      const details = data.upgrade_description.split(time);

      announceId = data.announcement_id;
      announceContentForm.setFieldsValue({
        announceTime: moment(time),
        announceDetails_1: details[0],
        showAnnounceTime: moment(time).format('YYYY-MM-DD HH:mm:ss'),
        announceDetails_2: details[1],
        showUpdateDetails: data.is_upgrade === 'yes' ? 'true' : 'false',

        //   以下为预览数据
        UpgradeIntroDate: `"${moment(time).format('YYYY-MM-DD HH:mm:ss')}"`,
        UpgradeDescription: `"${data.upgrade_description}"`,
        isUpdated: data.is_upgrade === 'yes' ? 'true' : 'false',
      });
      // 判断是否是历史信息(如果是历史信息，保存按钮和发布按钮都不能点击)
      setButtonDisable({
        title: releaseTime === 'after' ? '后' : '前',
        disable: operteStatus === 'true',
        buttonStyle: operteStatus === 'true' ? '' : 'saveButtonStyle',
      });
    }
  };

  // Tab 修改
  const onTabChanged = async (activeKey: string) => {
    releaseTime = activeKey;
    const announceContent = await getAnnouncement(releaseNum, activeKey);
    showFormData(announceContent);
  };

  const announceData =
    type == 'add' ? initForm() : useRequest(() => getAnnouncement(releaseNum, 'before')).data; // 关联值班名单
  useEffect(() => {
    if (announceData) {
      showFormData(announceData);
    }
  }, [announceData]);

  useEffect(() => {
    announcementNameForm.setFieldsValue({
      announcement_name:
        type == 'add' ? `${releaseNum}升级公告` : announceData?.data?.announcement_name ?? '',
    });
  }, [releaseNum, announceData?.data?.announcement_name]);

  window.onresize = function () {
    setPageHeight(getHeight());
  };

  return (
    <PageContainer>
      <div style={{ marginTop: -15, background: 'white', padding: 10 }}>
        <Form form={announcementNameForm}>
          <Form.Item
            label={'公告批次名称'}
            name={'announcement_name'}
            rules={[
              {
                required: true,
                validator: (r, v, callback) => {
                  if (isEmpty(v?.trim())) callback('请填写公告批次名称！');
                  else callback();
                },
              },
            ]}
          >
            <Input placeholder={'公告批次名称'} style={{ width: '300px' }} />
          </Form.Item>
        </Form>
        {/* Tab展示 */}
        <Tabs onChange={onTabChanged} type="card">
          <TabPane tab="升级前公告" key="before"></TabPane>
          <TabPane tab="升级后公告" key="after"></TabPane>
        </Tabs>

        {/* Tab内容 */}
        <div
          style={{
            backgroundColor: 'white',
            height: pageHeight,
            minHeight: '500px',
            marginTop: -15,
          }}
        >
          <Form
            form={announceContentForm}
            autoComplete="off"
            onFieldsChange={whenFormValueChanged}
            style={{ marginLeft: 15 }}
          >
            <Form.Item label="升级时间:" name="announceTime" style={{ paddingTop: 5 }}>
              <DatePicker allowClear={false} showTime disabled={!hasPermission?.edit} />
            </Form.Item>
            <Form.Item label="公告详情:" name="announceDetails_1" style={{ marginTop: -15 }}>
              <Input disabled={!hasPermission?.edit} />
            </Form.Item>
            <Form.Item name="showAnnounceTime" className={'itemStyle'}>
              <Input style={{ color: 'gray' }} disabled bordered={false}></Input>
            </Form.Item>
            <Form.Item name="announceDetails_2" className={'itemStyle'}>
              <TextArea rows={2} disabled={!hasPermission?.edit} />
            </Form.Item>
            <Form.Item
              label="展示查看更新详情:"
              name="showUpdateDetails"
              style={{ marginTop: -20 }}
            >
              <Radio.Group disabled={!hasPermission?.edit}>
                <Radio value={'true'}>是</Radio>
                <Radio value={'false'}>否</Radio>
              </Radio.Group>
            </Form.Item>
            {/* 预览界面 */}
            <Form.Item style={{ marginTop: -20 }}>
              <Divider orientation="left" style={{ fontSize: 'small' }}>
                预览
              </Divider>
              <div style={{ marginTop: -20 }}>
                <Form.Item>{'{'}</Form.Item>
                <Form.Item
                  label={'"UpgradeIntroDate"'}
                  name="UpgradeIntroDate"
                  className={'marginStyle'}
                >
                  <Input disabled bordered={false} style={{ color: 'black' }}></Input>
                </Form.Item>
                <Form.Item
                  label={'"UpgradeDescription"'}
                  name="UpgradeDescription"
                  className={'marginStyle'}
                >
                  <Input disabled bordered={false} style={{ color: 'black' }}></Input>
                </Form.Item>
                <Form.Item label={'"isUpdated"'} name="isUpdated" className={'marginStyle'}>
                  <Input disabled bordered={false} style={{ color: 'black' }}></Input>
                </Form.Item>
                <Form.Item style={{ marginTop: -25 }}>{'}'}</Form.Item>
              </div>
              <Divider orientation="left" style={{ marginTop: -20 }}></Divider>
            </Form.Item>
          </Form>

          {/* 保存按钮 */}
          <div style={{ float: 'right' }}>
            <Button
              type="primary"
              className={'saveButtonStyle'}
              onClick={() => saveAndReleaseAnnouncement('save')}
              disabled={operteStatus === 'true' || !hasPermission?.edit}
            >
              保存
            </Button>
            <Popconfirm
              placement="top"
              title={`确定一键挂起升级${buttonDisable.title}公告吗？`}
              okText="是"
              cancelText="否"
              disabled={buttonDisable.disable || !hasPermission?.push}
              onConfirm={() => saveAndReleaseAnnouncement('release')}
            >
              <Button
                type="primary"
                className={buttonDisable.buttonStyle}
                style={{ marginLeft: 10 }}
                disabled={buttonDisable.disable || !hasPermission?.push}
              >
                {`一键挂起升级${buttonDisable.title}公告`}
              </Button>
            </Popconfirm>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Announce;

import React, { memo, useEffect, useState } from 'react';
import { Form, Select } from 'antd';
import usePermission from '@/hooks/permission';
import AnnouncementServices from '@/services/announcement';
import { useModel } from '@@/plugin-model/useModel';
import '../../style/style.css';
import { alalysisInitData } from '@/pages/onDutyAndRelease/preRelease/datas/dataAnalyze';
const AnnounceSelector = ({
  type,
  ready_release_num,
  value,
  disabled,
}: {
  type: 'pre' | 'history';
  ready_release_num: string;
  value?: string;
  disabled: boolean;
}) => {
  const { processStatus } = useModel('releaseProcess');
  const [user] = useModel('@@initialState', (init) => [init.initialState?.currentUser]);

  const [announcementForm] = Form.useForm();
  const [announcementList, setAnnouncementList] = useState<any[]>([]);

  const { announcePermission } = usePermission();

  const getAnnouncementList = async () => {
    const res = await AnnouncementServices.preAnnouncement();
    setAnnouncementList(
      res.map((it: any) => ({ label: it.announcement_name, value: it.announcement_num })),
    );
  };

  const onSave = async () => {
    if (!ready_release_num) return;
    const announcement_num = announcementForm.getFieldValue('announcement_num');
    const request =
      type == 'pre'
        ? AnnouncementServices.preReleaseAssociation
        : AnnouncementServices.releaseHistoryAssociation;
    await request({
      announcement_num: announcement_num ?? '',
      ready_release_num,
      user_name: user?.name,
      user_id: user?.userid,
    });
    // 刷新界面
    await alalysisInitData('onlineBranch', ready_release_num);
  };
  useEffect(() => {
    getAnnouncementList();
  }, []);

  useEffect(() => {
    announcementForm.setFieldsValue({
      announcement_num: value == undefined ? processStatus.announcement_num : value,
    });
  }, [processStatus.announcement_num, value]);

  return (
    <>
      {announcePermission()?.check ? (
        <Form
          form={announcementForm}
          size={'small'}
          style={{ width: '25%', height: 25, float: 'right' }}
          className={'no-wrap-form'}
        >
          <Form.Item
            name={'announcement_num'}
            label={
              <strong style={{ marginLeft: 5 }}>
                <img
                  src="../../../annouce.png"
                  width="20"
                  height="20"
                  alt="发布公告"
                  title="发布公告"
                  style={{ marginRight: 5 }}
                />
                关联发布公告
              </strong>
            }
          >
            <Select
              showSearch
              disabled={disabled}
              options={announcementList}
              placeholder={'发布公告'}
              style={{ width: '100%' }}
              optionFilterProp={'label'}
              onBlur={onSave}
              onDeselect={onSave}
              allowClear
            />
          </Form.Item>
        </Form>
      ) : (
        <div />
      )}
    </>
  );
};
export default memo(AnnounceSelector);

import React, { memo, useEffect, useState } from 'react';
import { Form, Select } from 'antd';
import usePermission from '@/hooks/permission';
import AnnouncementServices from '@/services/announcement';
import { useModel } from '@@/plugin-model/useModel';
import '../../style/style.css';

const AnnounceSelector = ({
  type,
  ready_release_num,
  value,
  disabled,
  onRefresh,
}: {
  type: 'pre' | 'history';
  ready_release_num: string;
  value?: string;
  disabled: boolean;
  onRefresh?: (v: string) => void;
}) => {
  const { processStatus, modifyProcessStatus } = useModel('releaseProcess');
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
    if (type == 'pre') {
      modifyProcessStatus({ ...processStatus, announcement_num });
    } else onRefresh?.(announcement_num);
  };
  useEffect(() => {
    getAnnouncementList();
  }, []);

  useEffect(() => {
    announcementForm.setFieldsValue({
      announcement_num: value,
    });
  }, [value]);

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
                  alt="升级公告"
                  title="升级公告"
                  style={{ marginRight: 5 }}
                />
                关联升级公告
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
              onChange={onSave}
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

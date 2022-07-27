import React, { memo, useEffect, useState } from 'react';
import { Form, Select } from 'antd';
import usePermission from '@/hooks/permission';
import AnnouncementServices from '@/services/announcement';
import { useModel } from '@@/plugin-model/useModel';
const AnnounceSelector = ({
  type,
  ready_release_num,
}: {
  type: 'pre' | 'history';
  ready_release_num: string;
}) => {
  const { operteStatus } = useModel('releaseProcess');
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
  };
  useEffect(() => {
    getAnnouncementList();
  }, []);

  return (
    <>
      {announcePermission()?.check ? (
        <Form form={announcementForm} size={'small'} style={{ width: '25%', float: 'right' }}>
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
              disabled={operteStatus}
              options={announcementList}
              placeholder={'发布公告'}
              style={{ width: '100%' }}
              optionFilterProp={'label'}
              onBlur={onSave}
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

import React, { useEffect, useMemo, useState } from 'react';
import { Button, Space, Timeline, Modal, Tag, Collapse } from 'antd';
import {
  PlusCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  SendOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import { isEmpty } from 'lodash';
import PersonSelector, { OptionType } from '../PersonaSelector';
import cls from 'classnames';
import { useModel, useLocation } from 'umi';
import OnlineServices from '@/services/online';
import dayjs from 'dayjs';

import styles from './index.less';

interface IFlow {
  disabled?: boolean;
  data: any;
  remark: string;
  approveDetail?: Record<string, any>;
  onConfirm: () => void;
}
type TagType = 'cc' | 'duty' | 'director';
export type TagSource = {
  cc: OptionType[];
  duty: OptionType[];
  director: OptionType[];
} | null;

interface ITag {
  approveDetail?: Record<string, any>;
  title: string;
  list: TagSource;
  selector: TagType;
  disabled: boolean;
  clearable?: boolean;
  setList: (data: any) => void;
  setShow: (data: { visible: boolean; selector: TagType }) => void;
}
const sp_status_map = {
  1: { title: '审批中', color: 'blue' },
  2: { title: '已同意', color: 'green' },
  3: { title: '已驳回', color: 'red' },
  4: { title: '已转审', color: 'cyan' },
  11: { title: '已退回', color: 'gold' },
  12: { title: '已加签', color: 'lime' },
  13: { title: '已同意并加签', color: 'magenta' },
};

const TagSelector = ({
  title,
  list,
  selector,
  disabled,
  setList,
  setShow,
  clearable = true,
  approveDetail,
}: ITag) => {
  const index = selector == 'duty' ? 0 : selector == 'director' ? 1 : -1;
  const record = useMemo(
    () => (index == -1 ? null : approveDetail?.sp_record?.[index]),
    [approveDetail?.sp_record],
  );

  const edit = (clearable && ![1, 2].includes(approveDetail?.sp_status)) || disabled;
  return (
    <Collapse ghost className={'tagSelector'} defaultActiveKey={['cc', 'director', 'duty']}>
      <Collapse.Panel
        key={selector}
        header={
          <div>
            {title}
            <span className={'color-prefix'} style={{ marginLeft: 8 }}>
              {record?.approverattr && (record.approverattr == 1 ? '或签' : '会签')}
              {record?.sp_status && (
                <Tag color={sp_status_map[record?.sp_status].color} style={{ marginLeft: 8 }}>
                  {sp_status_map[record?.sp_status].title}
                </Tag>
              )}
            </span>
          </div>
        }
      >
        <div style={{ padding: isEmpty(approveDetail) ? '16px 0' : 0 }}>
          <div className={selector == 'cc' || isEmpty(approveDetail) ? 'flex-row' : ''}>
            {list?.[selector]?.map((it, index) => (
              <ul key={it.value}>
                <li
                  className={cls(styles.signWrap)}
                  style={
                    selector == 'cc' || isEmpty(approveDetail) ? { margin: '0 15px 15px' } : {}
                  }
                >
                  <div className={'personal'}>
                    {it.label}
                    {edit && (
                      <CloseCircleOutlined
                        onClick={() => {
                          list?.[selector].splice(index, 1);
                          setList({ ...list, [selector]: [...list?.[selector]] });
                        }}
                      />
                    )}
                    {it.status == 2 && ![3, 11].includes(approveDetail?.sp_status) && (
                      <CheckCircleFilled />
                    )}
                  </div>
                  <div className={cls('flex-row', 'info')}>
                    {it?.status && <span>{sp_status_map[it?.status].title}</span>}
                    {it?.date ? (
                      <span>{dayjs((it?.date || 0) * 1000).format('YYYY/MM/DD HH:mm') || ''}</span>
                    ) : (
                      ''
                    )}
                  </div>
                  {it?.mark && <span className={'mark'}>{it?.mark || ''}</span>}
                </li>
              </ul>
            ))}
          </div>

          {edit && (
            <PlusCircleOutlined
              onClick={() => setShow({ visible: true, selector })}
              className={styles.addAnticon}
            />
          )}
        </div>
      </Collapse.Panel>
    </Collapse>
  );
};

const ApproveFlow = ({ data, disabled, remark, approveDetail, onConfirm }: IFlow) => {
  const {
    query: { idx },
  } = useLocation() as any;
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
  const [list, setList] = useState<TagSource>();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState<{
    visible: boolean;
    selector: TagType;
  } | null>();

  const handleConfirm = async () => {
    setLoading(true);
    if (list?.cc.length == 0 || list?.duty?.length == 0 || list?.director?.length == 0) {
      Modal.confirm({
        content:
          list?.cc.length == 0
            ? '【抄送人】不能为空，请重新检查后再提交'
            : list?.duty?.length == 0
            ? '【值班人】不能为空，请重新检查后再提交'
            : '【总监审批】不能为空，请重新检查后再提交',
      });
      setLoading(false);
      return;
    }
    const data = {
      user_id: user?.userid,
      cc: list?.cc?.map((it) => it.value) || [],
      duty_user: list?.duty?.map((it) => it.value) || [],
      director_user: list?.director?.map((it) => it.value),
      release_num: idx,
      remark,
    };

    try {
      await OnlineServices.updateApproval(data);
      setLoading(false);
      onConfirm();
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setList(data);
  }, [data]);

  return (
    <div className={styles.approveFlow}>
      <Timeline>
        <Timeline.Item dot={<UserOutlined />}>
          <div style={{ marginLeft: 24 }}>
            <p>发起人</p>
            <p>{approveDetail?.applyer_name || user?.name}</p>
          </div>
        </Timeline.Item>
        <Timeline.Item dot={<UserOutlined />}>
          <TagSelector
            title={'开发值班人'}
            selector={'duty'}
            list={list || null}
            disabled={disabled || false}
            approveDetail={approveDetail}
            setShow={(v) => setShow(v)}
            setList={(v) => setList(v)}
          />
        </Timeline.Item>
        <Timeline.Item dot={<UserOutlined />}>
          <TagSelector
            title={'总监审批'}
            list={list || null}
            selector={'director'}
            approveDetail={approveDetail}
            disabled={disabled || false}
            setShow={(v) => setShow(v)}
            setList={(v) => setList(v)}
          />
        </Timeline.Item>
        <Timeline.Item dot={<SendOutlined />}>
          <TagSelector
            title={'抄送人'}
            selector={'cc'}
            clearable={false}
            list={list || null}
            disabled={disabled || false}
            setList={(v) => setList(v)}
            setShow={(v) => setShow(v)}
          />
        </Timeline.Item>
      </Timeline>
      <Space size={8}>
        {approveDetail?.sp_status && (
          <Button
            type={'primary'}
            disabled={disabled || approveDetail?.sp_status}
            onClick={handleConfirm}
            loading={loading}
          >
            {approveDetail?.sp_status && sp_status_map[approveDetail?.sp_status].title}
          </Button>
        )}
        {![2, 13].includes(approveDetail?.sp_status) && (
          <Button
            type={'primary'}
            disabled={disabled || [1, 2].includes(approveDetail?.sp_status)}
            onClick={handleConfirm}
            loading={loading}
          >
            {approveDetail?.sp_status ? '重新提交审批' : '提交审批'}
          </Button>
        )}
      </Space>
      <PersonSelector
        {...show}
        data={show?.selector && list ? list[show.selector] : []}
        onCancel={() => setShow(null)}
        onOk={(v: OptionType[], selector: TagType) => {
          setList({ ...list, [selector]: v } as any);
          setShow(null);
        }}
      />
    </div>
  );
};
export default ApproveFlow;

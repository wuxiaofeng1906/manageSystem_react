import React, { useEffect, useState } from 'react';
import { Button, Space, Timeline, Modal } from 'antd';
import {
  PlusSquareOutlined,
  CloseCircleOutlined,
  UserOutlined,
  SendOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import PersonSelector, { OptionType } from '../PersonaSelector';
import cls from 'classnames';
import { useModel, useLocation } from 'umi';
import OnlineServices from '@/services/online';

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
  1: '审批中',
  2: '已同意',
  3: '已驳回',
  4: '已转审',
  11: '已退回',
  12: '已加签',
  13: '已同意并加签',
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
  const record = index == -1 ? null : approveDetail?.sp_record?.[index];
  const edit = (clearable && ![1, 2].includes(approveDetail?.sp_status)) || disabled;
  return (
    <div>
      <p style={{ marginBottom: 10 }}>
        {title}:
        <span className={'color-prefix'}>
          {record?.sp_status && record?.approverattr
            ? `${record.approverattr == 1 ? '或签' : '会签'}【${sp_status_map[record.sp_status]}】`
            : ''}
        </span>
      </p>
      <div className={'flex-row'}>
        <div className={'flex-row'}>
          {list?.[selector]?.map((it, index) => (
            <div key={it.value} className={cls(styles.signWrap, 'ellipsis')}>
              <span>{it.label}</span>
              <br />
              {it.status == 2 && <CheckCircleFilled />}
              {edit && (
                <CloseCircleOutlined
                  onClick={() => {
                    list?.[selector].splice(index, 1);
                    setList({ ...list, [selector]: [...list?.[selector]] });
                  }}
                />
              )}
            </div>
          ))}
        </div>
        {edit && (
          <PlusSquareOutlined
            onClick={() => setShow({ visible: true, selector })}
            className={styles.addAnticon}
          />
        )}
      </div>
    </div>
  );
};

const ApproveFlow = ({ data, disabled, remark, approveDetail, onConfirm }: IFlow) => {
  const {
    query: { idx },
  } = useLocation() as any;
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
  const [list, setList] = useState<TagSource>();
  const [show, setShow] = useState<{
    visible: boolean;
    selector: TagType;
  } | null>();

  const handleConfirm = async () => {
    if (list?.cc.length == 0 || list?.duty?.length == 0 || list?.director?.length == 0) {
      Modal.confirm({
        content:
          list?.cc.length == 0
            ? '【抄送人】不能为空，请重新检查后再提交'
            : list?.duty?.length == 0
            ? '【值班人】不能为空，请重新检查后再提交'
            : '【总监审批】不能为空，请重新检查后再提交',
      });
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
    await OnlineServices.updateApproval(data);
    onConfirm();
  };

  useEffect(() => {
    setList(data);
  }, [data]);

  return (
    <div className={styles.approveFlow}>
      <Timeline>
        <Timeline.Item dot={<UserOutlined />}>
          <div>
            <p>发起人</p>
            <p>{user?.name}</p>
          </div>
        </Timeline.Item>
        <Timeline.Item dot={<UserOutlined />}>
          <TagSelector
            title={'开发值班人'}
            list={list || null}
            disabled={disabled || false}
            setList={(v) => setList(v)}
            selector={'duty'}
            approveDetail={approveDetail}
            setShow={(v) => setShow(v)}
          />
        </Timeline.Item>
        <Timeline.Item dot={<UserOutlined />}>
          <TagSelector
            title={'总监审批'}
            list={list || null}
            disabled={disabled || false}
            setList={(v) => setList(v)}
            selector={'director'}
            approveDetail={approveDetail}
            setShow={(v) => setShow(v)}
          />
        </Timeline.Item>
        <Timeline.Item dot={<SendOutlined />}>
          <TagSelector
            title={'抄送人'}
            list={list || null}
            disabled={disabled || false}
            setList={(v) => setList(v)}
            selector={'cc'}
            clearable={false}
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
          >
            {approveDetail?.sp_status && sp_status_map[approveDetail?.sp_status]}
          </Button>
        )}
        {![2, 13].includes(approveDetail?.sp_status) && (
          <Button
            type={'primary'}
            disabled={disabled || [1, 2].includes(approveDetail?.sp_status)}
            onClick={handleConfirm}
          >
            {approveDetail?.sp_status ? '重新提交审批' : '提交审批'}
          </Button>
        )}

        {/*<Button type={'primary'} style={{ color: '#ffb012' }}>*/}
        {/*  撤销审批*/}
        {/*</Button>*/}
      </Space>
      <PersonSelector
        {...show}
        data={show?.selector && list ? list[show.selector] : []}
        onOk={(v: OptionType[], selector: TagType) => {
          setList({ ...list, [selector]: v } as any);
          setShow(null);
        }}
        onCancel={() => setShow(null)}
      />
    </div>
  );
};
export default ApproveFlow;

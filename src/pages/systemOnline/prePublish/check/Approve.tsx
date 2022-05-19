import React, { useEffect, useState } from 'react';
import { Timeline, Modal, Select, Button, Space } from 'antd';
import {
  PlusSquareOutlined,
  CloseCircleOutlined,
  UserOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { ModalFuncProps } from 'antd/lib/modal/Modal';
import styles from './index.less';
import cls from 'classnames';

const checkStaus = {
  green: '#099409',
  red: '#e02c2c',
  blue: '#21aff3',
  yellow: '#d4d453',
};

interface IFlow {
  data: any;
  onAdd: (data: any[]) => void;
  onConfirm: (data: any) => void;
  onCancel: () => void;
}

interface OptionType {
  value: string;
  label: string;
  key: string;
}

const Approve = () => {
  return (
    <div className={styles.approve}>
      <div>
        <h3>一、发布项目：</h3>
        <ul style={{ marginLeft: 40 }}>
          <li>
            <Space size={40}>
              <span>笑果文化</span>
              <span>项目负责人： 张三</span>
            </Space>
          </li>
          <li>
            <Space size={40}>
              <span>采购发票</span>
              <span>项目负责人： 李珊珊</span>
            </Space>
          </li>
        </ul>
      </div>
      <ul>
        <li>
          <strong>二、发布分支：</strong>release
        </li>
        <li>
          <strong>三、发布类型：</strong>灰度发布
        </li>
        <li>
          <strong>四、发布方式：</strong>不停服
        </li>
        <li>
          <strong>五、发布时间：</strong>2022-03-08 12：11
        </li>
      </ul>
      <div style={{ margin: '16px 0' }}>
        <h3>六、检查信息：</h3>
        <ul style={{ marginLeft: 40 }}>
          <li>
            1、前端单元测试运行是否通过：<span>暂无</span>
          </li>
          <li>
            2、后端单元测试运行是否通过：<span style={{ color: checkStaus['green'] }}>是</span>
          </li>
          <li>
            3、图标一致性检查是否通过：<span style={{ color: checkStaus['green'] }}>是</span>
          </li>
          <li>
            4、版本检查是否通过：<span style={{ color: checkStaus['green'] }}>是</span>
          </li>
          <li>
            5、创建库对比校验是否通过：<span style={{ color: checkStaus['red'] }}>否</span>
          </li>
          <li>
            6、环境一致性检查是否通过：<span style={{ color: checkStaus['blue'] }}>进行中</span>
          </li>
          <li>
            7、上线前自动化检查是否通过：<span>未开始</span>
          </li>
          <li>
            8、升级后自动化检查是否通过：<span style={{ color: checkStaus['yellow'] }}>忽略</span>
          </li>
          <li>
            9、前端是否封板：<span>未封板</span>
          </li>
          <li>
            10、后端是否封板：<span style={{ color: checkStaus['green'] }}>已封板</span>
          </li>
        </ul>
      </div>
      <div>
        <h3>七、审批流程：</h3>
        <ApproveFlow
          data={[]}
          onAdd={(v) => {
            console.log(v);
          }}
          onCancel={() => {}}
          onConfirm={() => {}}
        />
      </div>
      <Space size={8}>
        <Button type={'primary'}>提交审批</Button>
        <Button type={'primary'} style={{ color: '#ffb012' }}>
          撤销审批
        </Button>
      </Space>
    </div>
  );
};
export default Approve;

const ApproveFlow = ({ data, onAdd, onConfirm, onCancel }: IFlow) => {
  const [list, setList] = useState<OptionType[]>([]);
  const [show, setShow] = useState(false);
  return (
    <div style={{ margin: '20px 0 0 40px' }}>
      <Timeline>
        <Timeline.Item dot={<UserOutlined />}>
          <div>
            <p>发起人</p>
            <p>发发七</p>
          </div>
        </Timeline.Item>
        <Timeline.Item dot={<UserOutlined />}>
          <div>
            <p style={{ marginBottom: 10 }}>
              开发值班人：<span className={'color-prefix'}>会签</span>
            </p>
            <div className={'flex-row'}>
              <div className={'flex-row'}>
                {list.map((it, index) => (
                  <div key={it.value} className={cls(styles.signWrap, 'ellipsis')}>
                    <span>{it.label}</span>
                    <CloseCircleOutlined
                      onClick={() => {
                        list.splice(index, 1);
                        setList([...list]);
                      }}
                    />
                  </div>
                ))}
              </div>
              <PlusSquareOutlined onClick={() => setShow(true)} className={styles.addAnticon} />
            </div>
          </div>
        </Timeline.Item>
        <Timeline.Item dot={<UserOutlined />}>
          <div>
            <p>
              总监审批：<span className={'color-prefix'}>会签</span>
            </p>
          </div>
        </Timeline.Item>
        <Timeline.Item dot={<SendOutlined />}>
          <div>
            <p>抄送人</p>
          </div>
        </Timeline.Item>
      </Timeline>
      <PersonSelector
        visible={show}
        data={list}
        onOk={(v: any[]) => {
          setList(v);
          setShow(false);
        }}
        onCancel={() => setShow(false)}
      />
    </div>
  );
};

const PersonSelector = (props: ModalFuncProps & { data: OptionType[] }) => {
  const [list, setList] = useState<OptionType[]>([]);
  const [checkData, setCheckData] = useState<string[]>([]);

  const formatNode = () => {
    const result: OptionType[] = [];
    checkData.map((v) =>
      list.forEach((it) => {
        if (it.value == v) result.push(it);
      }),
    );
    return result;
  };
  useEffect(() => {
    if (props.visible) {
      setList([
        {
          label: '张三',
          value: '101',
          key: '101',
        },
        {
          label: '刘德饭',
          value: '102',
          key: '102',
        },
        {
          label: '王麻子',
          value: '201',
          key: '201',
        },
        {
          label: '赵思',
          value: '202',
          key: '202',
        },
        {
          label: '加斯',
          value: '203',
          key: '203',
        },
      ]);
      setCheckData(props.data?.map((it) => it.value) || []);
    }
  }, [props.visible, props.data]);
  return (
    <Modal
      title={'人员选择'}
      visible={props.visible}
      onOk={() => {
        props.onOk?.(formatNode());
      }}
      onCancel={props.onCancel}
    >
      <Select
        showArrow
        options={list}
        value={checkData}
        mode={'multiple'}
        style={{ width: '100%' }}
        maxTagCount={5}
        onChange={(v) => setCheckData(v)}
      />
    </Modal>
  );
};

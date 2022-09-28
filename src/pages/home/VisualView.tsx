import React, { useEffect, useMemo, useState } from 'react';
import styles from './index.less';
import cns from 'classnames';
import { Collapse, Form, Select, DatePicker, Col } from 'antd';
import { useModel } from 'umi';
import PreReleaseServices from '@/services/preRelease';

interface Iitem {
  id?: string;
  project: string;
  branch: string;
  server: string[];
  env?: string;
  time: string;
  from?: number;
  to?: number;
  bg?: string;
}

const thead = ['类别', '线下版本', '集群0', '集群1', '线上'];
const initBg = ['#93db9326', '#e83c3c26', '#519ff240'];
const Item = (params: { data: Iitem; bg?: string; child?: React.ReactNode }) => {
  const [user] = useModel('@@initialState', (init) => [init.initialState?.currentUser]);

  const hasPermission = useMemo(() => user?.group == 'superGroup', [user]);

  return (
    <div style={{ background: params.bg || params.data.bg || initBg[0] }} className={styles.item}>
      {params.child || <div />}
      <p>发布项目:{params.data.project}</p>
      <p>发布分支:{params.data.branch}</p>
      <p>发布服务:{params.data.server?.join(',')}</p>
      <p>发布集群:{params.data.server?.join(',')}</p>
      {hasPermission ? (
        <img
          src={require('../../../public/delete_black_2.png')}
          className={styles.deleteIcon}
          onClick={() => {
            console.log(params.data);
          }}
        />
      ) : (
        <div />
      )}
    </div>
  );
};

const VisualView = () => {
  const [online, setOnline] = useState<any[]>([]);
  const [source, setSource] = useState<Iitem[]>([]);
  const [project, setProject] = useState<any[]>([]);
  const [branch, setBranch] = useState<any[]>([]);

  useEffect(() => {
    getProject();
    setOnline([{ name: '集群2-3' }, { name: '集群4-6' }, { name: '集群7-8' }]);
    setSource([
      {
        id: '1',
        time: '2022-09-12 12:32',
        server: ['web', 'h5'],
        project: '自定义门户',
        branch: 'hotfix',
        env: '',
        from: 1,
        to: 150,
        bg: initBg[0],
      },
      {
        id: '2',
        time: '2022-09-12 12:32',
        server: ['web', 'app'],
        project: '库存管理',
        branch: 'hotfix',
        env: '',
        from: 1,
        to: 50,
        bg: initBg[0],
      },
      {
        id: '3',
        time: '2022-09-12 12:32',
        server: ['web', 'app'],
        project: '库存管理',
        branch: 'hotfix',
        env: '',
        from: 1,
        to: 50,
        bg: initBg[0],
      },
      {
        id: '4',
        time: '2022-09-12 12:32',
        server: ['web', 'app'],
        project: '库存管理',
        branch: 'hotfix',
        env: '',
        from: 1,
        to: 50,
        bg: initBg[0],
      },
    ]);
  }, []);

  const getProject = async () => {
    const projectList = await PreReleaseServices.project();
    const branchList = await PreReleaseServices.branch();
    setProject(
      projectList?.map((it: any) => ({
        label: it.project_name,
        value: it.project_id,
        key: it.project_id,
      })),
    );
    setBranch(
      branchList?.map((it: any) => ({
        label: it.branch_name,
        value: it.branch_id,
        key: it.branch_id,
      })),
    );
  };

  const renderEmptyTD = (len: number) => {
    if (len <= 0) return '';
    const arr = Array.from({ length: len }).fill('1');
    return (
      <>
        {arr.map((it, index) => (
          <td key={index} />
        ))}
      </>
    );
  };

  const memoLen = useMemo(() => online.length || 0, [online]);

  return (
    <div className={styles.visualView}>
      <table>
        <colgroup>
          <col style={{ maxWidth: 50, width: 30 }} />
          <col style={{ width: 100, maxWidth: 120 }} />
        </colgroup>
        <thead>
          <tr>
            {thead.map((title) => {
              const isOnline = title == '线上';
              const singleW = 200;
              return (
                <th
                  key={title}
                  rowSpan={isOnline ? 1 : 2}
                  colSpan={isOnline ? memoLen : title == '类别' ? 2 : 1}
                  style={
                    title == '类别'
                      ? { width: 130, maxWidth: 170 }
                      : {
                          width: `${isOnline ? singleW * (memoLen || 1) : singleW}px`,
                        }
                  }
                >
                  {title}
                </th>
              );
            })}
          </tr>
          <tr>
            {online.map((it) => (
              <th key={it.name}>{it.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/*这一行需特殊处理*/}
          <tr>
            <th colSpan={2} style={{ wordBreak: 'break-all' }}>
              版本基准
            </th>
            <td className={styles.obliqueLine} />
            <td>
              <div className={styles.stackWrapper}>
                <Collapse defaultActiveKey={['1', '2']}>
                  {source.map((it, index) => (
                    <Collapse.Panel key={it.id || index} header={it.project}>
                      <Item data={it} />
                    </Collapse.Panel>
                  ))}
                </Collapse>
              </div>
            </td>
            <td></td>
            <td>
              <Item
                data={{
                  id: '4',
                  time: '2022-09-12 12:32',
                  server: ['web', 'app'],
                  project: '库存管理',
                  branch: 'hotfix',
                  env: '',
                  from: 1,
                  to: 50,
                  bg: initBg[0],
                }}
              />
            </td>
            <td>
              <Item
                data={{
                  id: '4',
                  time: '2022-09-12 12:32',
                  server: ['web', 'app'],
                  project: '库存管理',
                  branch: 'hotfix',
                  env: '',
                  from: 1,
                  to: 50,
                  bg: initBg[0],
                }}
              />
            </td>
            <td>
              <Item
                data={{
                  id: '4',
                  time: '2022-09-12 12:32',
                  server: ['web', 'app'],
                  project: '库存管理',
                  branch: 'hotfix',
                  env: '',
                  from: 1,
                  to: 50,
                  bg: initBg[0],
                }}
              />
            </td>
          </tr>
          <tr>
            <th rowSpan={2}>
              当<br />天<br />待<br />发<br />版
            </th>
            <td className={styles.time}>2022-10-13</td>
            <td>
              <Item
                data={{
                  id: '4',
                  time: '2022-09-12 12:32',
                  server: ['web', 'app'],
                  project: '库存管理',
                  branch: 'hotfix',
                  env: '',
                  from: 1,
                  to: 50,
                  bg: initBg[2],
                }}
                child={
                  <div
                    className={cns(styles.dotLineBasic, styles.dotLinePrimary)}
                    style={{ width: `calc(450% + 7px)` }}
                  />
                }
              />
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td className={styles.time}>2022-10-14</td>
            <td>
              <Item
                data={{
                  id: '4',
                  time: '2022-09-12 12:32',
                  server: ['web', 'app'],
                  project: '库存管理',
                  branch: 'hotfix',
                  env: '',
                  from: 1,
                  to: 50,
                  bg: initBg[2],
                }}
                child={<div className={cns(styles.dotLineBasic, styles.dotLinePrimary)} />}
              />
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          {/*搜索条件*/}
          <tr>
            <td colSpan={memoLen + 5}>
              <Form size={'small'} layout={'inline'} className={styles.condition}>
                <Col span={8}>
                  <Form.Item name={'project'} label={'项目名称'}>
                    <Select style={{ width: '100%' }} options={project} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name={'branch'} label={'分支名称'}>
                    <Select style={{ width: '100%' }} options={branch} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name={'date'} label={'计划上线日期'}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Form>
            </td>
          </tr>
          <tr>
            <th rowSpan={2}>
              上<br />
              线<br />计<br />划<br />日<br />历
            </th>
            <td className={styles.time}>2022-10-13</td>
            <td>
              <Item
                data={{
                  id: '4',
                  time: '2022-09-12 12:32',
                  server: ['web', 'app'],
                  project: '库存管理',
                  branch: 'hotfix',
                  env: '',
                  from: 1,
                  to: 50,
                  bg: initBg[1],
                }}
                child={
                  <div>
                    <div className={cns(styles.dotLineBasic, styles.dotLineEmergency)} />
                    <div
                      className={cns(styles.dotLineBasic, styles.dotLineEmergency)}
                      style={{ width: `calc(150% + 7px)` }}
                    />
                  </div>
                }
              />
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default VisualView;

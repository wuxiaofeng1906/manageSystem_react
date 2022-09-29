import React, { useEffect, useMemo, useState } from 'react';
import styles from './index.less';
import cns from 'classnames';
import { Collapse, Form, Select, DatePicker, Col } from 'antd';
import { useModel } from 'umi';
import PreReleaseServices from '@/services/preRelease';
import { isEmpty } from 'lodash';

const thead = ['类别', '线下版本', '集群0', '集群1', '线上'];
const ignore = ['cn-northwest-0', 'cn-northwest-1'];
const initBg = ['#93db9326', '#e83c3c26', '#519ff240'];
const Item = (params: { data: any; bg?: string; child?: React.ReactNode }) => {
  const [user] = useModel('@@initialState', (init) => [init.initialState?.currentUser]);

  const hasPermission = useMemo(() => user?.group == 'superGroup', [user]);

  return (
    <div style={{ background: params.bg || params.data.bg || initBg[0] }} className={styles.item}>
      {params.child || <div />}
      <p>发布项目:{params.data.project ?? ''}</p>
      <p>发布分支:{params.data.branch ?? ''}</p>
      <p>发布需求:{params.data.ztno ?? ''}</p>
      <p>发布服务:{params.data.apps ?? ''}</p>
      <p>发布集群:{params.data.release_env ?? ''}</p>
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
  const [project, setProject] = useState<any[]>([]);
  const [branch, setBranch] = useState<any[]>([]);
  const [online, setOnline] = useState<any[]>([]); // 线上动态列
  const [source, setSource] = useState<any[]>([]);
  const [baseSource, setBaseSource] = useState<any[]>([]); // 基准版本
  const [currentSource, setCurrentSource] = useState<any[]>([]); // 当天待发版
  const [calator, setCalator] = useState<any[]>([]); // 上线日历

  useEffect(() => {
    getSelectData();
    getViewData();
    setSource([
      {
        id: '1',
        time: '2022-09-12 12:32',
        server: ['web', 'h5'],
        project: '自定义门户',
        branch: 'hotfix',
        env: '集群1',
        from: 1,
        to: 150,
        bg: initBg[0],
        ztno: 2234,
      },
      {
        id: '2',
        time: '2022-09-12 12:32',
        server: ['web', 'app'],
        project: '库存管理',
        branch: 'hotfix',
        env: '集群1',
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
        env: '集群1',
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
        env: '集群1',
        from: 1,
        to: 50,
        bg: initBg[0],
      },
    ]);
  }, []);

  const getViewData = async () => {
    // const base = await PreReleaseServices.releaseBaseline();
    // const currentDay = await PreReleaseServices.releaseView();
    //
    // const basicOnline = base.map((it: any) => it.cluster)?.flat() ?? [];
    // const currentOnline = currentDay.map((it: any) => it.cluster)?.flat() ?? [];
    //
    // setOnline(
    //   [...new Set([...basicOnline, ...currentOnline])]
    //     .flatMap((it) => (ignore.includes(it) ? [] : [it]))
    //     .map((key) => ({ name: key })),
    // );
    // setBaseSource(base);
    // setCurrentSource(currentDay);
    setOnline([{ name: '集群2-4', value: 'cn-northwest-24' }]);
    // 线上集群： 顺序：对应前的数据
    setCurrentSource([
      {
        project: 'CESHI',
        branch: 'hotfix',
        ztno: '212',
        apps: 'app',
        release_env: 'ddd',
        cluster: ['cn-northwest-0', 'cn-northwest-1', 'cn-northwest-1-4'],
        from: 0,
        to: [1, 2, 3],
      },
      {
        project: 'CESHI',
        branch: 'hotfix',
        ztno: '212',
        apps: 'app',
        release_env: 'ddd',
        baseline_cluster: 'cn-northwest-0',
        cluster: ['cn-northwest-0', 'cn-northwest-1', 'cn-northwest-1-4'],
      },
    ]);
  };
  const getSelectData = async () => {
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

  const renderTD = (len: number, data: any) => {
    if (len <= 0) return '';
    const arr = Array.from({ length: len }).fill('1');
    // 线下版本 ： 空  集群1：<td/><td><itme/></td> 集群2:
    return (
      <>
        {arr.map((it, index) => (
          <td key={index}>
            {isEmpty(data.baseline_cluster) && index == 0 ? (
              <Item
                data={data}
                child={
                  <div>
                    {data.cluster?.map((line: any) => {
                      let onlineIndex = online.findIndex((env) => env.name == line);
                      if (onlineIndex == -1) onlineIndex = 0;
                      const percent =
                        line == ignore[0] ? 1 : line == ignore[1] ? 2 : onlineIndex + 3;
                      return (
                        <div
                          className={cns(styles.dotLineBasic, styles.dotLineEmergency)}
                          style={{ width: `calc(${percent * 100 - 50}% + ${percent * 7}px)` }}
                        />
                      );
                    })}
                  </div>
                }
              />
            ) : (
              ''
            )}
          </td>
        ))}
      </>
    );
  };

  const onlineLen = useMemo(() => online.length || 1, [online]);

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
                  colSpan={isOnline ? onlineLen : title == '类别' ? 2 : 1}
                  style={
                    title == '类别'
                      ? { width: 130, maxWidth: 170 }
                      : {
                          width: `${isOnline ? singleW * (onlineLen || 1) : singleW}px`,
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
              <th key={it.name}>{it.name ?? ''}</th>
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
          </tr>
          {/*当天待发版*/}
          {currentSource.map((it, index) => {
            return (
              <tr>
                {index == 0 && (
                  <th rowSpan={currentSource.length}>
                    当<br />天<br />待<br />发<br />版
                  </th>
                )}
                <td className={styles.time}>{it.plan_release_time}</td>
                {/*{renderTD(onlineLen + 3, it)}*/}
                {renderTD(4, it)}
              </tr>
            );
          })}
          {/*搜索条件*/}
          <tr>
            <td colSpan={onlineLen + 5}>
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
          {/*上线计划日历*/}
          <tr>
            <th rowSpan={2}>
              上<br />
              线<br />计<br />划<br />日<br />历
            </th>
            <td className={styles.time}>2022-10-13</td>
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

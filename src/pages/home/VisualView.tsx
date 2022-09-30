import React, { useEffect, useMemo, useState, Fragment } from 'react';
import styles from './index.less';
import cns from 'classnames';
import { Collapse, Form, Select, DatePicker, Col, Card } from 'antd';
import { useModel } from 'umi';
import PreReleaseServices from '@/services/preRelease';
import { isEmpty, sortBy, uniqBy } from 'lodash';

const thead = ['类别', '线下版本', '集群0', '集群1', '线上'];
const ignore = ['cn-northwest-0', 'cn-northwest-1'];
const baseColumn = [
  { name: '线下版本', value: 'offline' },
  { name: '集群0', value: 'cn-northwest-0' },
  { name: '集群1', value: 'cn-northwest-1' },
];
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
  const [online, setOnline] = useState<{ name: string; value: string }[]>([]); // 线上动态列
  const [source, setSource] = useState<any[]>([]);
  const [baseSource, setBaseSource] = useState<any[]>([]); // 基准版本
  const [currentSource, setCurrentSource] = useState<any[]>([]); // 当天待发版
  const [calendar, setCalendar] = useState<any[]>([]); // 上线日历

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
        bg: initBg[0],
      },
      {
        id: '3',
        time: '2022-09-12 12:32',
        server: ['web', 'app'],
        project: '库存管理',
        branch: 'hotfix',
        env: '集群1',
        bg: initBg[0],
      },
      {
        id: '4',
        time: '2022-09-12 12:32',
        server: ['web', 'app'],
        project: '库存管理',
        branch: 'hotfix',
        env: '集群1',
        bg: initBg[0],
      },
    ]);
  }, []);

  const getViewData = async () => {
    const basic = await PreReleaseServices.releaseBaseline();
    const currentDay = await PreReleaseServices.releaseView();

    const basicOnline = basic.map((it: any) => it.cluster)?.flat() ?? [];
    const currentOnline = currentDay.map((it: any) => it.cluster)?.flat() ?? [];
    setBaseSource(basic);
    setCurrentSource(
      currentDay?.map((it: any) => ({
        ...it,
        baseline_cluster: isEmpty(it.baseline_cluster) ? 'offline' : it.baseline_cluster,
        cls: styles.dotLineEmergency,
        bg: initBg[0],
      })),
    );
    // 去重并排序(动态列)
    setOnline(
      sortBy(
        uniqBy([...basicOnline, ...currentOnline], 'name').flatMap((it) =>
          ignore.includes(it.name) ? [] : [it],
        )['value'],
      ),
    );

    // setOnline(
    //   sortBy(
    //     [
    //       { name: '集群3-5', value: 'cn-northwest-35' },
    //       { name: '集群2-4', value: 'cn-northwest-24' },
    //     ],
    //     ['value'],
    //   ),
    // );
    // setCurrentSource([
    //   {
    //     project: 'CESHI',
    //     branch: 'hotfix',
    //     ztno: '212',
    //     apps: 'app',
    //     release_env: 'ddd',
    //     baseline_cluster: 'delay',
    //     cluster: ['cn-northwest-0', 'cn-northwest-1', 'cn-northwest-24'],
    //     cls: styles.dotLineEmergency,
    //     bg: initBg[1],
    //   },
    //   {
    //     project: 'CESHI',
    //     branch: 'hotfix',
    //     ztno: '212',
    //     apps: 'app',
    //     release_env: 'ddd',
    //     baseline_cluster: 'cn-northwest-0',
    //     cluster: ['cn-northwest-1', 'cn-northwest-24'],
    //     cls: styles.dotLinePrimary,
    //     bg: initBg[2],
    //   },
    // ]);
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

  const renderTr = (arr: any[], title: string) => {
    if (arr.length == 0) {
      const source = [...baseColumn, ...online];
      return (
        <tr>
          <th rowSpan={source.length}>
            <span className={styles.title}>{title.split('').map((text) => `${text}\n`)}</span>
          </th>
          <td />
          {[...baseColumn, ...online].map((_, index) => (
            <td key={index} />
          ))}
        </tr>
      );
    }
    return (
      <Fragment>
        {arr.map((it, index) => {
          return (
            <tr key={index + it.plan_release_time}>
              {index == 0 && (
                <th rowSpan={arr.length}>
                  <span className={styles.title}>{title.split('').map((text) => `${text}\n`)}</span>
                </th>
              )}
              <td className={styles.time}>{it.plan_release_time}</td>
              {renderTd(it)}
            </tr>
          );
        })}
      </Fragment>
    );
  };

  const renderTd = (data: any) => {
    const arr = [...baseColumn, ...online];
    return (
      <Fragment>
        {arr.map((it) => {
          return (
            <td key={it.value}>
              {data.baseline_cluster == it.value ? (
                <Item
                  data={data}
                  child={
                    <div>
                      {data.cluster?.map((env: any, i: number) => {
                        const baseIndex = arr.findIndex((v) => data.baseline_cluster == v.value);
                        const envIndex = arr.findIndex((v) => v.value == env.value);
                        const alpha = envIndex - baseIndex;
                        if (envIndex < 0) return '';
                        return (
                          <div
                            key={env}
                            className={cns(styles.dotLineBasic, data.cls)}
                            style={{
                              width: `calc(${alpha * 100 - 50}% + ${alpha * 7 + i * 6}px)`,
                            }}
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
          );
        })}
      </Fragment>
    );
  };

  const onlineLen = useMemo(() => online.length || 1, [online]);

  return (
    <div className={styles.visualView}>
      <Card title={'待发布视图'}>
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
            {renderTr(currentSource, '当天待发版')}
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
            {renderTr([], '上线计划日历')}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
export default VisualView;

import React, { useEffect, useMemo, useState, useCallback, Fragment, memo } from 'react';
import styles from './index.less';
import cns from 'classnames';
import { Collapse, Form, Select, DatePicker, Col, Card, Modal } from 'antd';
import { useModel } from 'umi';
import PreReleaseServices from '@/services/preRelease';
import { isEmpty, sortBy, uniqBy, cloneDeep } from 'lodash';
import moment from 'moment';

const thead = ['类别', '线下版本', '集群0', '集群1', '线上'];
const ignore = ['cn-northwest-0', 'cn-northwest-1'];
const baseColumn = [
  { name: 'offline', value: thead[1] },
  { name: ignore[0], value: thead[2] },
  { name: ignore[1], value: thead[3] },
];
const initBg = ['#93db9326', '#e83c3c26', '#519ff240'];

const ICard = (params: {
  data: any;
  isBasic?: boolean;
  child?: React.ReactNode;
  onRefresh: Function;
}) => {
  const [user] = useModel('@@initialState', (init) => [init.initialState?.currentUser]);
  const isLink = params.data.baseline_cluster == 'office';
  const hasPermission = useMemo(() => user?.group == 'superGroup', [user]);
  const onRemove = async (data: any) => {
    Modal.confirm({
      centered: true,
      title: '删除发布提醒：',
      content: '请确认是否要删除该发布！',
      onOk: async () => {
        await PreReleaseServices.removeRelease({
          user_id: user?.userid ?? '',
          release_num: data.release_num ?? '',
        });
        params.onRefresh?.();
      },
    });
  };
  return (
    <div style={{ background: params.data.bg || initBg[0] }} className={styles.item}>
      {params.child || <div />}
      <div className={styles.wrapper}>
        <span className={styles.label}>发布项目:</span>
        {params.data.project?.map((it: any) => (
          <span
            className={cns(isLink ? styles.link : '', styles.value)}
            onClick={() => {
              if (!it.value || !isLink) return;
              window.open(`http://zentao.77hub.com/zentao/execution-task-${it.value}.html`);
            }}
          >
            {it.name ?? ''}
          </span>
        ))}
      </div>
      <p>发布分支:{params.data.branch ?? ''}</p>
      <p>
        发布需求:
        {params.data.story?.split(',')?.map((ztno: number) => (
          <span
            className={isLink ? styles.link : ''}
            onClick={() => {
              if (!ztno || !isLink) return;
              window.open(`http://zentao.77hub.com/zentao/story-view-${ztno}.html`);
            }}
          >
            {ztno ?? ''}
          </span>
        ))}
      </p>
      <p>发布服务:{params.data.apps ?? ''}</p>
      {params.isBasic ? (
        <p>发布时间:{params.data.release_time ?? ''}</p>
      ) : (
        <p>发布集群:{params.data.release_env ?? ''}</p>
      )}

      {hasPermission ? (
        <img
          src={require('../../../public/delete_black_2.png')}
          className={styles.deleteIcon}
          onClick={() => onRemove(params.data)}
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
  const [online, setOnline] = useState<{ name: string; value: string }[]>([
    { name: '', value: '' },
  ]); // 线上动态列
  const [basicSource, setBasicSource] = useState<any[]>([]); // 基准版本
  const [currentSource, setCurrentSource] = useState<any[]>([]); // 当天待发版
  const [planSource, setPlanSource] = useState<any[]>([]); // 计划上线日历

  useEffect(() => {
    getSelectData();
    getViewData();
  }, []);

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
  const getViewData = async () => {
    const basic = await PreReleaseServices.releaseBaseline();
    const currentDay = await PreReleaseServices.releaseView();

    const basicOnline = basic.map((it: any) => it.cluster)?.flat() ?? [];
    const currentOnline = currentDay.map((it: any) => it.cluster)?.flat() ?? [];
    setCurrentSource(
      currentDay?.map((it: any) => {
        const isRed =
          it.project.includes('stage-patch') ||
          it.project.includes('stagepatch') ||
          it.project.includes('emergency');
        return {
          ...it,
          baseline_cluster: isEmpty(it.baseline_cluster) ? 'offline' : it.baseline_cluster,
          cls: isRed ? styles.dotLineEmergency : styles.dotLineSuccess,
          bg: isRed ? initBg[1] : initBg[0],
        };
      }),
    );
    // 去重并排序(动态列计算)
    let formatOnline = sortBy(
      uniqBy([...basicOnline, ...currentOnline], 'name').flatMap((it) =>
        ignore.includes(it.name) ? [] : [it],
      )['value'],
    );
    if (isEmpty(formatOnline)) formatOnline = [{ name: '', value: '' }];
    const basicGroup: any[] = [];
    cloneDeep(baseColumn)
      .splice(1)
      .concat(formatOnline)
      .forEach((it) => {
        basicGroup.push({
          name: it.name,
          children: basic.filter((re: any) => re.cluster.includes(it.name)) ?? [],
        });
      });
    setBasicSource(basicGroup);
    setOnline(formatOnline);
  };

  const onlineLen = useMemo(() => online.length, [online]);
  // 动态列
  const dynamicColumn = useMemo(() => [...baseColumn, ...online], [online]);

  const renderTr = (arr: any[], title: string) => {
    if (isEmpty(arr)) {
      return (
        <tr>
          <th>
            <span className={styles.title}>{title.split('').map((text) => `${text}\n`)}</span>
          </th>
          <td />
          {dynamicColumn.map((_, index) => (
            <td key={index} style={{ height: 130 }} />
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
              <td className={styles.time}>
                第{index + 1}步：
                <br />
                {it.plan_release_time
                  ? moment(it.plan_release_time).format('YYYY-MM-DD HH:mm')
                  : ''}
              </td>
              {renderTd(it)}
            </tr>
          );
        })}
      </Fragment>
    );
  };

  const renderTd = (data: any) => {
    return (
      <Fragment>
        {dynamicColumn.map((it, index) => {
          return (
            <td key={index}>
              {data.baseline_cluster == it?.name ? (
                <ICard
                  data={data}
                  onRefresh={getViewData}
                  child={
                    <div>
                      {data.cluster?.map((env: any, i: number) => {
                        const baseIndex = dynamicColumn.findIndex(
                          (v) => data.baseline_cluster == v.name,
                        );
                        const envIndex = dynamicColumn.findIndex((v) => v.name == env.name);
                        const alpha = envIndex - baseIndex;
                        if (envIndex < 0) return '';
                        return (
                          <div
                            key={env}
                            className={cns(styles.dotLineBasic, data.cls ?? styles.dotLinePrimary)}
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

  const renderBasicTd = useMemo(() => {
    let source: any[] = cloneDeep(basicSource);
    const empty = Array.from({ length: onlineLen + 2 });
    if (isEmpty(basicSource)) return empty.map((it, i) => <td key={i} />);
    return (
      <Fragment>
        {source?.map((it, index) => {
          return isEmpty(it.children) ? (
            <td />
          ) : (
            <td>
              <div className={styles.stackWrapper}>
                <Collapse defaultActiveKey={[1, 2]}>
                  {it.children?.map((child: any, i: number) => (
                    <Collapse.Panel key={i + 1} header={child.project}>
                      <ICard data={child} onRefresh={getViewData} isBasic={true} />
                    </Collapse.Panel>
                  ))}
                </Collapse>
              </div>
            </td>
          );
        })}
      </Fragment>
    );
  }, [basicSource, onlineLen]);

  return (
    <Card title={'待发布视图'} className={styles.card}>
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
                const singleW = 240;
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
              {online.map((it) => (it.name == '' ? '' : <th key={it.name}>{it.name ?? ''}</th>))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th colSpan={2}>版本基准</th>
              <td className={styles.obliqueLine} />
              {renderBasicTd}
            </tr>
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
            {renderTr([], '上线计划日历')}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
export default VisualView;

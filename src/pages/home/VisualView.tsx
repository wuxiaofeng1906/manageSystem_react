import React, { useEffect, useMemo, useState, Fragment } from 'react';
import styles from './index.less';
import cns from 'classnames';
import { Collapse, Form, Select, DatePicker, Card, Modal, Spin, Switch } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import PreReleaseServices from '@/services/preRelease';
import { isEmpty, sortBy, uniqBy, cloneDeep, isArray, intersection } from 'lodash';
import dayjs from 'dayjs';

const thead = ['类别', '线下版本', '集群0', '集群1', '线上'];
const ignore = ['cn-northwest-0', 'cn-northwest-1'];
const baseColumn = [
  { name: 'offline', value: thead[1] },
  { name: ignore[0], value: thead[2] },
  { name: ignore[1], value: thead[3] },
];
const initBg = ['#93db9326', '#e83c3c26', '#519ff240'];
const userLogins: any = localStorage.getItem('userLogins');
const user = JSON.parse(userLogins);

const ICard = (params: {
  data: any;
  isBasic?: boolean;
  child?: React.ReactNode;
  onRefresh: Function;
  deleteIcon?: boolean;
  open: boolean;
}) => {
  const baseline = params.data.baseline_cluster == 'offline';
  const hasPermission = useMemo(() => user?.group == 'superGroup', [user]);
  const [activeKey, setActiveKey] = useState('');

  const title = useMemo(
    () =>
      isArray(params.data.project)
        ? params.data.project?.map((it: any) => it.pro_name)?.join(',')
        : params.data.project,
    [JSON.stringify(params.data.project)],
  );

  const onRemove = async (data: any) => {
    Modal.confirm({
      centered: true,
      title: '删除积压工单提醒：',
      okText: '确认',
      cancelText: '取消',
      content: '请确认是否删除该积压单，点确认将彻底从积压单中删除！',
      icon: <InfoCircleOutlined style={{ color: 'red' }} />,
      onOk: async () => {
        await PreReleaseServices.removeRelease({
          user_id: user?.userid ?? '',
          release_num: data.release_num ?? '',
        });
        params.onRefresh?.();
      },
    });
  };

  useEffect(() => {
    setActiveKey(params.open ? params.data.release_num : '');
  }, [params.open]);

  return (
    <div className={styles.stackWrapper}>
      {params.child || <div />}
      <Collapse
        activeKey={activeKey}
        onChange={(v) => setActiveKey(!v.includes(activeKey) ? '' : params.data.release_num)}
      >
        <Collapse.Panel key={params.data.release_num} header={title}>
          <div style={{ background: params.data.bg || initBg[0] }} className={styles.icard}>
            <div className={styles.container}>
              <span className={styles.label}>发布项目:</span>
              <div className={styles.box} title={title}>
                {isArray(params.data.project)
                  ? params.data.project?.map((it: any) => {
                      const linkProject =
                        it.pro_name?.startsWith('emergency') ||
                        it.pro_name?.startsWith('stagepatch') ||
                        it.pro_name?.startsWith('stage-patch');
                      return (
                        <span
                          className={cns(baseline && linkProject ? styles.link : '', styles.value)}
                          onClick={() => {
                            if (!it.pro_id || !(baseline && linkProject)) return;
                            window.open(
                              `http://zentao.77hub.com/zentao/execution-task-${it.pro_id}.html`,
                            );
                          }}
                        >
                          {it.pro_name ?? ''}
                        </span>
                      );
                    })
                  : params.data.project}
              </div>
            </div>
            <div className={styles.container}>
              <span className={styles.label}>发布分支:</span>
              <div className={styles.box} title={params.data.branch ?? ''}>
                {params.data.branch ?? ''}
              </div>
            </div>
            {isEmpty(params.data.story) ? (
              ''
            ) : (
              <div className={styles.container}>
                <span className={styles.label}>发布需求:</span>
                <div className={styles.box} title={params.data.story ?? ''}>
                  {params.data.story?.split(',')?.map((ztno: number) => (
                    <span
                      className={baseline ? styles.link : ''}
                      onClick={() => {
                        if (!ztno || !baseline) return;
                        window.open(`http://zentao.77hub.com/zentao/story-view-${ztno}.html`);
                      }}
                    >
                      {ztno ?? ''}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className={styles.container}>
              <span className={styles.label}>发布服务:</span>
              <div className={styles.box} title={params.data.apps ?? ''}>
                {params.data.apps ?? ''}
              </div>
            </div>
            {params.isBasic ? (
              <div className={styles.container}>
                <span className={styles.label}>发布时间:</span>
                {params.data.release_time ?? ''}
              </div>
            ) : (
              <div className={styles.container}>
                <span className={styles.label}>发布集群:</span>
                <div className={styles.box} title={params.data.release_env ?? ''}>
                  {params.data.release_env ?? ''}
                </div>
              </div>
            )}

            {hasPermission && params.deleteIcon == true ? (
              <img
                src={require('../../../public/delete_black_2.png')}
                className={styles.deleteIcon}
                onClick={() => onRemove(params.data)}
              />
            ) : (
              <div />
            )}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

const VisualView = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<any[]>([]);
  const [branch, setBranch] = useState<any[]>([]);
  const [online, setOnline] = useState<{ name: string; value: string }[]>([
    { name: '', value: '' },
  ]); // 线上动态列
  const [basicSource, setBasicSource] = useState<any[]>([]); // 基准版本
  const [currentSource, setCurrentSource] = useState<any[]>([]); // 当天待发版
  const [planSource, setPlanSource] = useState<any[]>([]); // 计划上线日历
  const [open, setOpen] = useState(false);

  useEffect(() => {
    Modal.destroyAll();
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
        value: it.branch_name,
        key: it.branch_id,
      })),
    );
  };

  const getPlanList = async () => {
    const values = form.getFieldsValue();
    const plan = await PreReleaseServices.releasePlan({
      project_id: values.project_id?.join(',') ?? '',
      branch: values.branch?.join(',') ?? '',
      plan_time: values.plan_time ? dayjs(values.plan_time).format('YYYY-MM-DD') : '',
    });
    setPlanSource(
      plan?.map((it: any, i: number) => ({
        ...it,
        baseline_cluster: isEmpty(it.baseline_cluster) ? 'offline' : it.baseline_cluster,
        cls: styles.dotLinePrimary,
        bg: initBg[2],
        plan_release_time: it.plan_time,
        release_num: it.branch + i,
      })),
    );
  };

  const computeFn = (origin: any[], key?: string) => {
    let source: any[] = [];
    const hasKey = !isEmpty(key);
    if (isEmpty(origin)) return [];
    origin.forEach((it: any) => {
      const base = it?.baseline_cluster;
      if (!isEmpty(it?.cluster)) {
        it.cluster?.forEach((o: any) => {
          source.push(o);
        });
      }
      if (!isEmpty(base) || hasKey) {
        const resetV = hasKey ? it : base;
        const text = resetV?.replace('cn-northwest-', '集群');
        const value = text.length > 3 ? `${text.slice(0, 3)}-${text.slice(text.length - 1)}` : text;
        source.push({ value, name: resetV });
      }
    });
    return source;
  };

  const getViewData = async () => {
    setLoading(true);
    try {
      const basic = await PreReleaseServices.releaseBaseline();
      const currentDay = await PreReleaseServices.releaseView();
      const plan = await PreReleaseServices.releasePlan({});

      const basicOnline =
        basic.map((it: any) => [...(it.cluster ?? []), ...(it.exist_clu ?? [])])?.flat() ?? [];
      const formatBasicCluster = computeFn(basicOnline, 'key');
      const currentOnline = computeFn(currentDay);
      const planOnline = computeFn(plan);

      setCurrentSource(
        currentDay?.map((it: any) => {
          const isRed = it.project?.some(
            (pro: any) =>
              pro.pro_name?.startsWith('emergency') ||
              pro.pro_name?.startsWith('stagepatch') ||
              pro.pro_name?.startsWith('stage-patch'),
          );
          return {
            ...it,
            baseline_cluster: isEmpty(it.baseline_cluster) ? 'offline' : it.baseline_cluster,
            cls: isRed ? styles.dotLineEmergency : styles.dotLineSuccess,
            bg: isRed ? initBg[1] : initBg[0],
          };
        }),
      );
      setPlanSource(
        plan?.map((it: any, i: number) => ({
          ...it,
          baseline_cluster: isEmpty(it.baseline_cluster) ? 'offline' : it.baseline_cluster,
          cls: styles.dotLinePrimary,
          bg: initBg[2],
          plan_release_time: it.plan_time,
          release_env: it.cluster?.map((it: any) => it.value)?.join(',') ?? '',
          release_num: it.branch + i,
        })),
      );
      // 去重并排序(动态列计算)
      let formatOnline = sortBy(
        uniqBy([...formatBasicCluster, ...currentOnline, ...planOnline], 'name').flatMap((it) =>
          ignore.includes(it.name) ? [] : [it],
        ),
        ['name'],
      );

      if (isEmpty(formatOnline)) formatOnline = [{ name: '', value: '' }];
      const basicGroup: any[] = [];
      cloneDeep(baseColumn)
        .splice(1)
        .concat(formatOnline)
        .forEach((it) => {
          basicGroup.push({
            name: it.name,
            children: basic.flatMap((re: any) => (re.cluster.includes(it.name) ? [re] : [])) ?? [],
          });
        });
      setBasicSource(basicGroup);
      setOnline(formatOnline);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const renderTr = (arr: any[], title: string, showStep = true, deleteIcon?: boolean) => {
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
                {showStep ? (
                  <Fragment>
                    第{index + 1}步：
                    <br />
                    {it.plan_release_time
                      ? dayjs(it.plan_release_time).format('YYYY-MM-DD HH:mm')
                      : ''}
                  </Fragment>
                ) : it.plan_release_time ? (
                  dayjs(it.plan_release_time).format('YYYY-MM-DD')
                ) : (
                  ''
                )}
              </td>
              {renderTd(it, deleteIcon)}
            </tr>
          );
        })}
      </Fragment>
    );
  };

  const renderTd = (data: any, deleteIcon?: boolean) => {
    return (
      <Fragment>
        {dynamicColumn.map((it, index) => {
          return (
            <td key={index} style={{ verticalAlign: 'middle' }}>
              {data.baseline_cluster == it?.name ? (
                <ICard
                  data={data}
                  onRefresh={getViewData}
                  deleteIcon={deleteIcon ?? ignore.includes(data.baseline_cluster)}
                  open={open}
                  child={
                    <div>
                      {data?.cluster?.map((env: any, i: number) => {
                        const baseIndex = dynamicColumn.findIndex(
                          (v) => data.baseline_cluster == v.name,
                        );
                        const envIndex = dynamicColumn.findIndex((v) => v.name == env.name);
                        const alpha = envIndex - baseIndex;
                        if (envIndex < 0 || env.name == data.baseline_cluster) return '';
                        return (
                          <div
                            key={env}
                            className={cns(styles.dotLineBasic, data.cls ?? styles.dotLinePrimary)}
                            style={{
                              width: `calc(${alpha * 100 - 50}% - ${(i + 1) * 2}px)`,
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

  const onlineLen = useMemo(() => online.length, [online]);
  const renderBasicTd = useMemo(() => {
    const empty = Array.from({ length: onlineLen + 2 });
    if (isEmpty(basicSource)) return empty.map((it, i) => <td key={i} />);
    return (
      <Fragment>
        {basicSource?.map((it, index) => {
          return isEmpty(it.children) ? (
            <td />
          ) : (
            <td>
              {it.children?.map((child: any) => {
                return (
                  <ICard
                    key={child.release_num}
                    data={child}
                    onRefresh={getViewData}
                    isBasic={true}
                    open={open}
                    deleteIcon={intersection(ignore, child.cluster ?? []).length > 0 && index < 2}
                  />
                );
              })}
            </td>
          );
        })}
      </Fragment>
    );
  }, [basicSource, onlineLen, open]);
  // 动态列
  const dynamicColumn = useMemo(() => [...baseColumn, ...online], [online]);

  return (
    <Card
      className={styles.card}
      title={
        <div>
          <span style={{ marginRight: 5 }}>待发布视图</span>
          <Switch
            checkedChildren={'展开全部'}
            unCheckedChildren={'收起全部'}
            onChange={(v) => setOpen(v)}
          />
        </div>
      }
    >
      <Spin spinning={loading} tip={'数据加载中...'}>
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
                          : { width: `${isOnline ? singleW * (onlineLen || 1) : singleW}px` }
                      }
                    >
                      {title}
                    </th>
                  );
                })}
              </tr>
              <tr>
                {online.map((it) => (it.name == '' ? '' : <th key={it.name}>{it.value ?? ''}</th>))}
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
                  <Form
                    form={form}
                    size={'small'}
                    layout={'inline'}
                    className={styles.condition}
                    onFieldsChange={getPlanList}
                  >
                    <Form.Item name={'project_id'} label={'项目名称'}>
                      <Select
                        style={{ width: '300px' }}
                        options={project}
                        placeholder={'项目名称'}
                        mode={'multiple'}
                        showSearch
                        optionFilterProp={'label'}
                      />
                    </Form.Item>
                    <Form.Item name={'branch'} label={'分支名称'}>
                      <Select
                        style={{ width: '300px' }}
                        options={branch}
                        placeholder={'分支名称'}
                        mode={'multiple'}
                        showSearch
                        optionFilterProp={'label'}
                      />
                    </Form.Item>
                    <Form.Item name={'plan_time'} label={'计划上线日期'}>
                      <DatePicker style={{ width: '170px' }} />
                    </Form.Item>
                  </Form>
                </td>
              </tr>
              {renderTr(planSource, '上线计划日历', false, false)}
            </tbody>
          </table>
        </div>
      </Spin>
    </Card>
  );
};
export default VisualView;

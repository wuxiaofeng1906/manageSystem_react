import React, { useMemo } from 'react';
import { Select, DatePicker, Button, Form, message, Spin, Modal, Alert } from 'antd';
import styles from './index.less';
import { useEffect, useState } from 'react';
import { useParams, useModel } from 'umi';
import DutyListServices from '@/services/dutyList';
import html2canvas from 'html2canvas';
import {
  isEmpty,
  isEqual,
  omit,
  pick,
  intersection,
  orderBy,
  xorBy,
  uniq,
  cloneDeep,
} from 'lodash';
import { ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import moment from 'moment';
import { SelectProps } from 'antd/lib/select';
import * as dayjs from 'dayjs';
import { useUnmount } from 'ahooks';
import useLock from '@/hooks/lock';

const opts = {
  showSearch: true,
  mode: 'multiple',
  optionFilterProp: 'label',
  filterOption: (input, option) => (option!.label as unknown as string)?.includes(input),
};
const recentType = {
  前端: 'front',
  后端: 'backend',
  测试: 'test',
  运维: 'operations',
  SQA: 'sqa',
};
const envType = {
  '集群1-8':
    'cn-northwest-1,cn-northwest-2,cn-northwest-3,cn-northwest-4,cn-northwest-5,cn-northwest-6,cn-northwest-7,cn-northwest-8',
  '集群2-8':
    'cn-northwest-2,cn-northwest-3,cn-northwest-4,cn-northwest-5,cn-northwest-6,cn-northwest-7,cn-northwest-7',
  global: 'cn-northwest-global',
};
const tbodyConfig = [
  { title: '前端值班', name: 'front', tech: 1 },
  { title: '后端值班', name: 'backend', tech: 2 },
  { title: '测试值班', name: 'test', tech: 3 },
  { title: '运维值班', name: 'operations' },
  { title: 'SQA值班', name: 'sqa' },
];
const FilterSelector = ({
  // options = [],
  name,
  placeholder = '',
  init = {},
  onDeselect,
  onSelect,
  onBlur,
  disabled,
  tech,
}: {
  name: string;
  disabled: boolean;
  init?: Record<string, any>;
  tech?: number;
} & SelectProps) => {
  const [options, setOptions] = useState([]);

  const getPerson = async () => {
    const res = await DutyListServices.getDevperson(tech ? { tech } : {});
    setOptions(
      res?.map((it: any) => ({
        key: it.user_name,
        value: `${it.user_id}_${it.user_type}`,
        label: it.user_name,
        type: it.user_type,
        fit: `${it.user_id}_${it.user_type == 'scene' ? 'remote' : 'scene'}`,
      })),
    );
  };
  useEffect(() => {
    getPerson();
  }, [tech]);

  return (
    <Form.Item noStyle shouldUpdate={(pre, current) => pre[name] !== current[name]}>
      {({ getFieldValue }) => {
        return (
          <Form.Item name={name}>
            <Select
              {...opts}
              bordered={false}
              placeholder={placeholder}
              onDeselect={onDeselect}
              onSelect={onSelect}
              onBlur={onBlur}
              disabled={disabled}
              options={(isEmpty(init) ? [] : [init]).concat(
                options
                  .map((it: any) => ({
                    ...it,
                    disabled: getFieldValue(name)?.includes(it.fit),
                  }))
                  .filter((it) => it.key !== init.key),
              )}
            />
          </Form.Item>
        );
      }}
    </Form.Item>
  );
};

const DutyCatalog = () => {
  const { id } = useParams() as { id: string };
  const { getAllLock, updateLockStatus, singleLock } = useLock();
  // const [allPerson, setAllPerson] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [envList, setEnvList] = useState<any[]>([]);
  const [methodList, setMethodList] = useState<any[]>([]);
  const [title, setTitle] = useState(`${moment().format('YYYYMMDD')}值班名单`);
  const [visible, setVisible] = useState(true);
  const [recentDuty, setRecentDuty] = useState<Record<string, any>>();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<Record<string, any>>();
  const [dutyPerson, setDutyPerson] = useState<Record<string, any>[]>([]);
  const [isSameDuty, setIsSameDuty] = useState(true);
  const [initDuty, setInitDuty] = useState([]);
  const [currentUser] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
  const [stageOwner, setStageOwner] = useState<{
    front: string[];
    backend: string[];
    test: string[];
  }>({ front: [], backend: [], test: [] });
  const [form] = Form.useForm();
  // scene(现场) remote(远程) head(负责人)

  // 默认第一值班人
  const getFirstDuty = async () => {
    const dateStart = dayjs().day(0);
    const dateEnd = dayjs().day(6);
    const oldSafari = {
      start_time: dayjs(
        `${dateStart.year()}-${dateStart.month() + 1}-${dateStart.date() + 1}`,
      ).format('YYYY/MM/DD'),
      end_time: dayjs(`${dateEnd.year()}-${dateEnd.month() + 1}-${dateEnd.date() + 1}`).format(
        'YYYY/MM/DD',
      ),
    };
    const firstDuty = await DutyListServices.getFirstDutyPerson(oldSafari);
    const duty = firstDuty?.data
      ?.flat()
      .filter(
        (it: any) =>
          it.duty_order == '1' && Object.keys(recentType).includes(it.user_tech) && it.user_name,
      );
    const data = duty.map((o: any, i: number) => ({
      value: `${o.user_id}_head`,
      key: o.user_id,
      type: 'head',
      fit: `${o.user_id}_head`,
      disabled: true,
      user_tech: o.user_tech,
      label: `${o.user_name}(${o.user_tech}值班负责人)`,
    }));
    setInitDuty(data);
  };

  const getSource = async () => {
    try {
      setLoading(true);
      const [envs, methods] = await Promise.all([
        DutyListServices.releaseEnv(),
        DutyListServices.releaseMethod(),
      ]);
      setLoading(false);

      setEnvList(
        envs.map((it: any) => ({
          value: it.env,
          label: it.env_name,
          key: it.env,
          type: envType[it.env_name] ?? 'other',
        })),
      );
      setMethodList(
        methods.map((it: any) => ({
          value: it.method,
          label: it.method_name,
          key: it.method_name,
        })),
      );
    } catch (e) {
      setLoading(false);
    }
  };
  // 获取项目负责人
  const getProjectUser = async () => {
    if (!hasPermission) return;
    // 项目关联的值班人员
    const values = await form.getFieldsValue();
    let persons = {} as any;
    if (!isEmpty(values.project_ids)) {
      persons = await getProjectToPersons();
    }
    let result: any[] = [];
    values.project_ids?.forEach((id: string) => {
      const o = projects.find(
        (it: any) => id.toString() == it.project_id.toString() && !isEmpty(it.user),
      );
      o && result.push(o);
    });
    const autoFront = persons?.front?.map((it: any) => `${it.user_id}_${it.user_type}`) ?? [];
    const autoBackend = persons?.backend?.map((it: any) => `${it.user_id}_${it.user_type}`) ?? [];
    const autoTest = persons?.test?.map((it: any) => `${it.user_id}_${it.user_type}`) ?? [];

    form.setFieldsValue({
      front: uniq([...stageOwner.front, ...autoFront]),
      backend: uniq([...stageOwner.backend, ...autoBackend]),
      test: uniq([...stageOwner.test, ...autoTest]),
      project_pm: result?.map((it: any) => it.user),
    });
    console.log(values?.front, autoFront);
    await onSave();
  };
  // 推送
  const onScreenShot = async () => {
    if (!hasPermission) return;
    const errTip = {
      project_ids: '请填写项目名称!',
      project_pm: '请填写负责人!',
      duty_date: '请填写值班日期!',
      release_time: '请填写发布时间!',
      release_env: '请填写发布环境!',
      release_method: '请填写发布方式!',
      front: '请填写前端值班人员!',
      backend: '请填写后端值班人员!',
      test: '请填写测试值班人员!',
      operations: '请填写运维值班人员!',
      sqa: '请填写SQA值班人员!',
    };
    const values = await form.getFieldsValue();
    const valid = Object.values(values).some((it) => isEmpty(it));
    if (valid) {
      const errArr = Object.entries(values).find(([k, v]) => isEmpty(v)) as any[];
      message.warning(errTip[errArr?.[0]]);
      setVisible(true);
      return;
    }
    // 截图推送提醒
    Modal.confirm({
      title: '推送提醒',
      icon: <ExclamationCircleOutlined />,
      content: '请确认是否发送到研发中心群?',
      onCancel: () => setVisible(true),
      onOk: () => {
        const dom = document.getElementById('dutyForm') as HTMLElement;
        if (!dom) return;
        html2canvas(dom, {
          scale: window.devicePixelRatio || 2,
          allowTaint: true,
        }).then((canvas) => {
          canvas.toBlob(async (blob) => {
            if (!blob) return;
            const filename = new Date().getTime().toString();
            const file = new File([blob], filename, { type: 'image/png' });
            let formData = new FormData();
            formData.append('file', file);
            formData.append('person_duty_num', id);
            formData.append('user_id', currentUser?.userid ?? '');
            await DutyListServices.pushWechat(formData);
          });
          setVisible(true);
        });
      },
    });
  };
  // 保存
  const onSave = async (updateDutyData?: Record<string, any>, pm?: string[]) => {
    if (!hasPermission) return;
    const dutyKey = ['front', 'backend', 'test', 'operations', 'sqa'];
    const values = await form.getFieldsValue();
    const title = await updateTitle();
    const pickDuty = pick(values, dutyKey);
    let dutyPersons: Record<string, any> = {};
    Object.entries(pickDuty).forEach(([k, v]) => {
      dutyPersons[k] = v?.map((it: string) => ({
        user_type: it?.split('_')?.[1],
        user_id: it?.split('_')?.[0],
      }));
    });
    // 更新为最新的值班人员【更新保存后，可能修改了值班负责人数据情况】
    if (updateDutyData) {
      dutyKey.forEach((key: string) => {
        if (!isEqual(dutyPersons[key]?.[0], updateDutyData[key]) && !isEmpty(updateDutyData[key])) {
          dutyPersons[key][0] = updateDutyData[key];
        }
      });
    }

    const data = {
      person_duty_num: id,
      duty_name: title,
      user_id: currentUser?.userid,
      ...dutyPersons,
      duty_date: moment(values.duty_date).format('YYYY-MM-DD'),
      project_ids: values.project_ids ? values.project_ids?.join() : undefined,
      project_pm: !isEmpty(pm)
        ? pm?.join()
        : values.project_pm?.map((it: any) => it.user_id)?.join(),
      release_env: values?.release_env?.join(),
      release_method: values.release_method,
      release_time: moment(values.release_time).format('YYYY-MM-DD HH:mm:ss'),
    };
    const flag = isEqual(omit(data, 'user_id'), {
      ...detail,
      project_pm: detail?.project_pm?.map((it: any) => it.user_id).join(),
      release_method: detail?.release_method == 'unknown' ? undefined : detail?.release_method,
    });
    if (flag) return;
    await DutyListServices.addDuty(data);
    setIsSameDuty(true);
    getDetail();
    // 【未加锁】保存后：加锁
    if (singleLock?.param.replace('duty_', '') == id) return;
    updateLockStatus(id, 'post');
  };
  // 详情
  const getDetail = async () => {
    try {
      setLoading(true);
      const res = await DutyListServices.getDutyDetail({ person_duty_num: id });
      setLoading(false);
      if (isEmpty(res)) {
        form.setFieldsValue({
          duty_date: moment(),
          release_time: moment().hour(23).minute(0).second(0),
        });
        return;
      }
      setDetail(res);
      form.setFieldsValue({
        front: res?.front?.map((it: any) => `${it.user_id}_${it.user_type}`),
        backend: res?.backend?.map((it: any) => `${it.user_id}_${it.user_type}`),
        test: res?.test?.map((it: any) => `${it.user_id}_${it.user_type}`),
        sqa: res?.sqa?.map((it: any) => `${it.user_id}_${it.user_type}`),
        operations: res?.operations?.map((it: any) => `${it.user_id}_${it.user_type}`),
        project_ids: res?.project_ids ? res?.project_ids?.split(',') : undefined,
        project_pm: res?.project_pm,
        release_time: moment(res?.release_time),
        duty_date: moment(res?.duty_date),
        release_env:
          res?.release_env == 'unknown' || !res?.release_env
            ? undefined
            : res?.release_env.split(','),
        release_method:
          res?.release_method == 'unknown' || !res?.release_method
            ? undefined
            : res?.release_method,
      });
      res?.duty_name && setTitle(res?.duty_name);
    } catch (e) {
      setLoading(false);
    }
  };
  // 保存后【默认值班人】
  const formatSaveDuty = (data: Record<string, any>) => {
    const front = data.front
      ?.filter((it: any) => it.user_type == 'head')
      .map((it: any) => ({ ...it, user_tech: '前端' }));
    const backend = data.backend
      ?.filter((it: any) => it.user_type == 'head')
      .map((it: any) => ({ ...it, user_tech: '后端' }));
    const test = data.test
      ?.filter((it: any) => it.user_type == 'head')
      .map((it: any) => ({ ...it, user_tech: '测试' }));
    const sqa = data.sqa
      ?.filter((it: any) => it.user_type == 'head')
      .map((it: any) => ({ ...it, user_tech: 'SQA' }));
    const operations = data.operations
      ?.filter((it: any) => it.user_type == 'head')
      .map((it: any) => ({ ...it, user_tech: '运维' }));

    const duty = front.concat(backend, test, operations, sqa).map((o: any, i: number) => ({
      value: `${o.user_id}_head`,
      key: o.user_id,
      type: 'head',
      disabled: true,
      user_tech: o.user_tech,
      label: `${o.user_name}(${o.user_tech}值班负责人)`,
      fit: `${o.user_id}_head`,
    }));
    setDutyPerson(duty);
    // 存在某个默认值班负责人为空的情况【替换后】
    if (duty.length != initDuty.length) {
      const flag = initDuty.every((it: any) => duty.map((o: any) => o.value).includes(it.value));
      setIsSameDuty(flag);
    } else {
      const flag = isEqual(orderBy(duty, 'user_tech'), orderBy(initDuty, 'user_tech'));
      setIsSameDuty(flag);
    }
  };

  const updateTitle = async () => {
    if (!hasPermission) return;
    const greyEnv = ['cn-northwest-0', 'cn-northwest-1'];
    const values = await form.getFieldsValue();
    const greyLength = intersection(values.release_env, greyEnv).length;
    const releaseEnvLength = values.release_env?.length;
    const time = moment(values.duty_date).format('YYYYMMDD');
    let type = '';
    if (isEmpty(values.release_env)) type = '';
    else if (greyLength == 1 && releaseEnvLength == 1) {
      type = `${values.release_env[0].replace('cn-northwest-', '')}级灰度发布`;
    } else if (releaseEnvLength == 2 && greyLength == 2) type = '灰度发布';
    else type = '线上发布';
    return `${time}_${type}值班名单`;
  };

  // form 格式【默认值班人员disabled,并过滤值班人员的现场、远程】
  const initalFormDuty = (data: any[]) => {
    let initDutyObj: any = {};
    if (isEmpty(data)) return;
    data?.forEach((o: any) => {
      initDutyObj[recentType[o.user_tech]] = { ...o };
    });
    isEmpty(detail) &&
      form.setFieldsValue({
        front: initDutyObj?.front?.value.split(),
        backend: initDutyObj?.backend?.value.split(),
        test: initDutyObj?.test?.value.split(),
        sqa: initDutyObj?.sqa?.value.split(),
        operations: initDutyObj?.operations?.value.split(),
      });
    return initDutyObj;
  };

  // 更新为最新值班负责人员【修改了值班数据且与保存的默认值班人不一致】
  const updateFirstDuty = async () => {
    setVisible(false);
    Modal.confirm({
      title: '更新值班负责人提醒:',
      icon: <ExclamationCircleOutlined />,
      content: '请确认是否需要将当前值班负责人更新为本周最新值班负责人?',
      onOk: async () => {
        // 更新默认值班人员及含特性项目项目对应的负责人
        let initDutyObj = {};
        const { project_ids } = await form.getFieldsValue();

        initDuty?.forEach((o: any) => {
          initDutyObj[recentType[o.user_tech]] = {
            user_type: o?.type,
            user_id: o?.key,
          };
        });
        const formatPro = projects
          ?.filter((it: any) => project_ids?.includes(it.project_id.toString()))
          .map((o: any) => ({
            user: ['sprint', 'emergency', 'hotfix', 'stage-emergency', 'stagepatch'].includes(
              o.sprint_type,
            )
              ? initDutyObj?.backend?.user_id
              : o.user?.user_id,
            project_id: o.project_id.toString(),
          }));
        const projectPM = project_ids?.map(
          (pro: string) => formatPro?.find((it) => it.project_id == pro)?.user,
        );
        await onSave(initDutyObj, projectPM);
        setVisible(true);
      },
      onCancel: () => {
        setVisible(true);
      },
    });
  };

  // 根据项目获取对应的负责人
  const getProjectToPersons = async () => {
    const data = form.getFieldsValue();
    if (isEmpty(data.project_ids)) return;
    // 项目关联人员
    const res = await DutyListServices.projectDuty(data.project_ids.join() ?? '');
    return res;
  };

  useEffect(() => {
    if (!id) return;
    getAllLock(id, true);
    getFirstDuty();
    DutyListServices.getProject().then((res) => setProjects(res));
    getDetail();
    getSource();
  }, [id]);

  const onDeleteLock = () => {
    if (singleLock?.user_id == currentUser?.userid) {
      updateLockStatus(id, 'delete');
    }
  };

  // 保存后的第一值班人
  useEffect(() => {
    if (isEmpty(dutyPerson)) return;
    const initDutyObj = initalFormDuty(dutyPerson);
    const formatProject = projects?.map((it: any) => ({
      ...it,
      user: ['sprint', 'emergency', 'hotfix', 'stagepatch'].includes(it.sprint_type)
        ? {
            user_id: initDutyObj?.backend?.key,
            user_name: initDutyObj?.backend?.label.replace('(后端值班负责人)', ''),
          }
        : it.user,
    }));
    setProjects(formatProject);
    setRecentDuty(initDutyObj);
    // 设置手动添加暂存的默认值班人员
    setStageOwner({
      front: initDutyObj?.front?.value.split(),
      backend: initDutyObj?.backend?.value.split(),
      test: initDutyObj?.test?.value.split(),
    });
  }, [dutyPerson]);

  useEffect(() => {
    if (isEmpty(initDuty)) return;
    if (isEmpty(detail)) {
      setDutyPerson(initDuty);
      return;
    }
    formatSaveDuty(detail);
  }, [detail, initDuty]);

  const otherEnv = envList
    .filter((o: any) => !Object.values(envType).includes(o.value))
    .map((it) => it.value);

  // 值班名单权限： 超级管理员、开发经理/总监、前端管理人员 、测试部门与业务经理
  const hasPermission = useMemo(
    () =>
      (detail?.is_push_msg == 'no' || isEmpty(detail)) && // 未推送
      ['superGroup', 'devManageGroup', 'frontManager', 'projectListMG'].includes(
        currentUser?.group || '',
      ) && // 有权限
      (singleLock?.user_id == currentUser?.userid || isEmpty(singleLock)), // 未锁定
    [currentUser?.group, singleLock, detail?.is_push_msg],
  );

  useEffect(() => {
    let timer: any;
    if (singleLock?.user_id == currentUser?.userid) return;
    timer = setInterval(() => {
      getAllLock(id, true).then((res) => {
        if (isEmpty(res)) updateLockStatus(id, 'post');
      });
    }, 3000);
    return () => {
      clearInterval(timer);
    };
  }, [singleLock]);

  useUnmount(() => {
    onDeleteLock();
  });

  return (
    <Spin spinning={loading} tip={'数据加载中...'}>
      {singleLock?.user_id != currentUser?.userid && !isEmpty(singleLock) ? (
        <Alert
          message={`【${singleLock?.user_name ?? ''}】正在编辑中，请稍等...`}
          type={'warning'}
          closable
          showIcon
          banner
        />
      ) : (
        <div />
      )}
      <div className={styles.dutyCatalog} id={'dutyForm'}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              visibility: visible ? 'visible' : 'hidden',
            }}
          >
            <Button
              style={{ visibility: isSameDuty || !hasPermission ? 'hidden' : 'visible' }}
              type={'text'}
              icon={<SyncOutlined style={{ color: '#1597e1' }} />}
              disabled={!visible || !hasPermission}
              onClick={updateFirstDuty}
            >
              更新值班负责人
            </Button>
            <Button
              type={'text'}
              disabled={!visible || !hasPermission}
              icon={
                <img
                  src={require('../../../../public/navigation.png')}
                  width={20}
                  style={
                    hasPermission
                      ? { marginRight: 8 }
                      : { filter: 'grayscale(1)', cursor: 'not-allowed', marginRight: 8 }
                  }
                />
              }
              onClick={() => {
                setVisible(false);
                onScreenShot();
              }}
            >
              一键推送
            </Button>
          </div>
        </div>
        <Form form={form}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>项目名称</th>
                <th style={{ minWidth: 240, maxWidth: 400 }}>
                  <Form.Item name={'project_ids'}>
                    <Select
                      {...opts}
                      disabled={!hasPermission}
                      bordered={false}
                      placeholder={'项目名称'}
                      showSearch
                      onDeselect={(v: any) => getProjectUser()}
                      onDropdownVisibleChange={(open) => !open && getProjectUser()}
                    >
                      {projects.map((it: any) => (
                        <Select.Option
                          key={it.project_id}
                          label={it.project_name}
                          disabled={it.status == 'closed'}
                        >
                          <span
                            style={{
                              color: it.status == 'closed' ? '#ccc' : it.is_pm ? 'initial' : 'red',
                            }}
                          >
                            {it.project_name}
                          </span>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </th>
                <th style={{ width: 100 }}>项目负责人</th>
                <th style={{ minWidth: 100, maxWidth: 200 }}>
                  <Form.Item
                    noStyle
                    shouldUpdate={(pre, next) => pre.project_pm != next.project_pm}
                  >
                    {({ getFieldValue }) => (
                      <Form.Item name={'project_pm'}>
                        {getFieldValue('project_pm')?.map(
                          (it: any, index: number) =>
                            it.user_id && (
                              <p
                                key={it.user_id + index}
                                style={{ margin: '5px 0', fontWeight: 'initial' }}
                              >
                                {`${it?.user_name}${
                                  index == getFieldValue('project_pm')?.length - 1 ? '' : '、'
                                }`}
                              </p>
                            ),
                        )}
                      </Form.Item>
                    )}
                  </Form.Item>
                </th>
                <th>值班日期</th>
                <th style={{ width: 150, maxWidth: 170 }}>
                  <Form.Item name={'duty_date'}>
                    <DatePicker
                      format={'YYYY-MM-DD'}
                      allowClear={false}
                      disabled={!hasPermission}
                      onBlur={() => onSave()}
                      onChange={async () => {
                        const title = (await updateTitle()) || '';
                        setTitle(title);
                      }}
                    />
                  </Form.Item>
                </th>
                <th>发布环境</th>
                <th style={{ width: 120, maxWidth: 170 }}>
                  <Form.Item
                    noStyle
                    shouldUpdate={(pre, next) => pre.release_env != next.release_env}
                  >
                    {({ getFieldValue }) => {
                      const env = getFieldValue('release_env');
                      const limitEnv = envList.map((it: any) => ({
                        ...it,
                        disabled:
                          isEmpty(env) ||
                          (it.type == 'other' && intersection(otherEnv, env).length > 0) ||
                          it.label == 'global' ||
                          env?.join(',') == 'cn-northwest-global'
                            ? false
                            : !env.includes(it.type),
                      }));
                      return (
                        <Form.Item name={'release_env'}>
                          <Select
                            options={limitEnv}
                            mode={'multiple'}
                            disabled={!hasPermission}
                            onSelect={async () => {
                              const title = (await updateTitle()) || '';
                              setTitle(title);
                            }}
                            onDeselect={async () => {
                              const title = (await updateTitle()) || '';
                              setTitle(title);
                              await onSave();
                            }}
                            onDropdownVisibleChange={(open) => !open && onSave()}
                          />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                </th>
                <th>发布方式</th>
                <th style={{ width: 120, maxWidth: 170 }}>
                  <Form.Item name={'release_method'}>
                    <Select
                      disabled={!hasPermission}
                      options={methodList}
                      bordered={false}
                      showSearch={false}
                      showArrow={false}
                      onChange={() => onSave()}
                    />
                  </Form.Item>
                </th>
                <th>发布时间</th>
                <th style={{ width: 150, maxWidth: 170 }}>
                  <Form.Item name={'release_time'}>
                    <DatePicker
                      format={'YYYY-MM-DD HH:mm'}
                      allowClear={false}
                      onBlur={() => onSave()}
                      showTime={{ defaultValue: moment('23:00:00', 'HH:mm') }}
                      disabled={!hasPermission}
                    />
                  </Form.Item>
                </th>
              </tr>
            </thead>
            <tbody>
              {tbodyConfig.map((config) => {
                return (
                  <tr key={config.name}>
                    <td>{config.title}</td>
                    <td colSpan={11}>
                      <FilterSelector
                        // options={allPerson}
                        tech={config.tech}
                        name={config.name}
                        placeholder={`${config.title}人员`}
                        init={recentDuty?.[config.name]}
                        onDeselect={(v: string) => {
                          if (['front', 'backend', 'test'].includes(config.name)) {
                            setStageOwner({
                              ...stageOwner,
                              [config.name]: stageOwner[config.name].filter(
                                (key: string) => key !== v,
                              ),
                            });
                          }
                          onSave();
                        }}
                        onBlur={() => onSave()}
                        disabled={!hasPermission}
                        onSelect={(v: string) => {
                          if (['front', 'backend', 'test'].includes(config.name)) {
                            let stageArr = [];
                            let stage = cloneDeep(stageOwner);
                            stageArr.push(v);
                            stage = {
                              ...stage,
                              [config.name]: [...stage[config.name], ...stageArr],
                            };
                            setStageOwner(stage);
                          }
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Form>
      </div>
    </Spin>
  );
};
export default DutyCatalog;

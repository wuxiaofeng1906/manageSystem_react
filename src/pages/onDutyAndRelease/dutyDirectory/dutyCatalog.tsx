import React, { useMemo } from 'react';
import { Select, DatePicker, Button, Form, message, Spin, Modal } from 'antd';
import styles from './index.less';
import { useEffect, useState } from 'react';
import { useParams, useModel } from 'umi';
import DutyListServices from '@/services/dutyList';
import html2canvas from 'html2canvas';
import { isEmpty, isEqual, omit, pick, intersection } from 'lodash';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { SelectProps } from 'antd/lib/select';
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
  '集群1-7':
    'cn-northwest-1cn-northwest-2cn-northwest-3cn-northwest-4cn-northwest-5cn-northwest-6cn-northwest-7',
  '集群2-7': 'cn-northwest-2cn-northwest-3cn-northwest-4cn-northwest-5cn-northwest-6cn-northwest-7',
  global: 'cn-northwest-global',
};
const tbodyConfig = [
  { title: '前端值班', name: 'front' },
  { title: '后端值班', name: 'backend' },
  { title: '测试值班', name: 'test' },
  { title: '运维值班', name: 'operations' },
  { title: 'SQA值班', name: 'sqa' },
];
const FilterSelector = ({
  options = [],
  name,
  placeholder = '',
  init = {},
  onDeselect,
  onBlur,
  disabled,
}: {
  name: string;
  disabled: boolean;
  init?: Record<string, any>;
} & SelectProps) => {
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
  const [allPerson, setAllPerson] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [envList, setEnvList] = useState<any[]>([]);
  const [methodList, setMethodList] = useState<any[]>([]);
  const [title, setTitle] = useState(`${moment().format('YYYYMMDD')}值班名单`);
  const [visible, setVisible] = useState(true);
  const [recentDuty, setRecentDuty] = useState<Record<string, any>>();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<Record<string, any>>();
  const [dutyPerson, setDutyPerson] = useState<Record<string, any>[]>([]);
  const [currentUser] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
  const [form] = Form.useForm();
  // scene(现场) remote(远程) head(负责人)

  // 默认第一值班人
  const getFirstDuty = async () => {
    const params = {
      start_time: moment().startOf('week').format('YYYY/MM/DD'),
      end_time: moment().endOf('week').format('YYYY/MM/DD'),
    };
    const firstDuty = await DutyListServices.getFirstDutyPerson(params);
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
    setDutyPerson(data);
  };

  const getSource = async () => {
    try {
      setLoading(true);
      const [allPersons, envs, methods] = await Promise.all([
        DutyListServices.getDevperson(),
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

      setAllPerson(
        allPersons?.map((it: any) => ({
          key: it.user_id,
          value: `${it.user_id}_${it.user_type}`,
          label: it.user_name,
          type: it.user_type,
          fit: `${it.user_id}_${it.user_type == 'scene' ? 'remote' : 'scene'}`,
        })),
      );
    } catch (e) {
      setLoading(false);
    }
  };

  const getProjectUser = async () => {
    if (!hasPermission) return;
    const values = await form.getFieldsValue();
    let result: any[] = [];
    values.project_ids?.forEach((id: string) => {
      const o = projects.find(
        (it: any) => id.toString() == it.project_id.toString() && !isEmpty(it.user),
      );
      o && result.push(o);
    });
    form.setFieldsValue({ project_pm: result?.map((it: any) => it.user) });
    await onSave();
  };

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

  const onSave = async () => {
    if (!hasPermission) return;
    const values = await form.getFieldsValue();
    const title = await updateTitle();
    const pickDuty = pick(values, ['front', 'backend', 'test', 'operations', 'sqa']);
    let dutyPersons: Record<string, any> = {};
    Object.entries(pickDuty).forEach(([k, v]) => {
      dutyPersons[k] = v?.map((it: string) => ({
        user_type: it?.split('_')?.[1],
        user_id: it?.split('_')?.[0],
      }));
    });

    const data = {
      person_duty_num: id,
      duty_name: title,
      user_id: currentUser?.userid,
      ...dutyPersons,
      duty_date: moment(values.duty_date).format('YYYY-MM-DD'),
      project_ids: values.project_ids ? values.project_ids?.join() : undefined,
      project_pm: values.project_pm?.map((it: any) => it.user_id)?.join(),
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
    getDetail();
  };

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
        getFirstDuty();
        return;
      }
      const front = res.front
        ?.filter((it: any) => it.user_type == 'head')
        .map((it: any) => ({ ...it, user_tech: '前端' }));
      const backend = res.backend
        ?.filter((it: any) => it.user_type == 'head')
        .map((it: any) => ({ ...it, user_tech: '后端' }));
      const test = res.test
        ?.filter((it: any) => it.user_type == 'head')
        .map((it: any) => ({ ...it, user_tech: '测试' }));
      const sqa = res.sqa
        ?.filter((it: any) => it.user_type == 'head')
        .map((it: any) => ({ ...it, user_tech: 'SQA' }));
      const operations = res.operations
        ?.filter((it: any) => it.user_type == 'head')
        .map((it: any) => ({ ...it, user_tech: '运维' }));

      setDutyPerson(
        front.concat(backend, test, operations, sqa).map((o: any, i: number) => ({
          value: `${o.user_id}_head`,
          key: o.user_id,
          type: 'head',
          disabled: true,
          user_tech: o.user_tech,
          label: `${o.user_name}(${o.user_tech}值班负责人)`,
          fit: `${o.user_id}_head`,
        })),
      );
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

  const updateTitle = async () => {
    if (!hasPermission) return;
    const values = await form.getFieldsValue();
    const time = moment(values.duty_date).format('YYYYMMDD');
    let type = '';
    if (isEmpty(values.release_env)) type = '';
    else if (values.release_env?.includes('cn-northwest-1') && values.release_env?.length == 1) {
      type = '灰度发布';
    } else type = '线上发布';
    return `${time}${type}值班名单`;
  };

  useEffect(() => {
    if (!id) return;
    DutyListServices.getProject().then((res) => setProjects(res));
    getDetail();
    getSource();
  }, [id]);

  // 保存后的第一值班人
  useEffect(() => {
    let initDutyObj: any = {};
    if (isEmpty(dutyPerson)) return;
    dutyPerson?.forEach((o: any) => {
      initDutyObj[recentType[o.user_tech]] = { ...o };
    });
    const formatProject = projects?.map((it: any) => ({
      ...it,
      user: ['sprint', 'emergency', 'hotfix'].includes(it.sprint_type)
        ? {
            user_id: initDutyObj?.backend?.key,
            user_name: initDutyObj?.backend?.label.replace('(后端值班负责人)', ''),
          }
        : it.user,
    }));
    form.setFieldsValue({
      front: initDutyObj?.front ? [initDutyObj?.front?.value] : undefined,
      backend: initDutyObj?.backend ? [initDutyObj?.backend?.value] : undefined,
      test: initDutyObj?.test ? [initDutyObj?.test?.value] : undefined,
      sqa: initDutyObj?.sqa ? [initDutyObj?.sqa?.value] : undefined,
      operations: initDutyObj?.operations ? [initDutyObj?.operations?.value] : undefined,
    });
    setProjects(formatProject);
    setRecentDuty(initDutyObj);
  }, [dutyPerson]);

  const otherEnv = envList
    .filter((o: any) => !Object.values(envType).includes(o.value))
    .map((it) => it.value);

  // 值班名单权限： 超级管理员、开发经理/总监、前端管理人员
  const hasPermission = useMemo(
    () =>
      ['superGroup', 'devManageGroup', 'frontManager', 'projectListMG'].includes(
        currentUser?.group || '',
      ),
    [currentUser?.group],
  );

  return (
    <Spin spinning={loading} tip={'数据加载中...'}>
      <div className={styles.dutyCatalog} id={'dutyForm'}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <Button
            type={'text'}
            disabled={!visible || !hasPermission}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              visibility: visible ? 'visible' : 'hidden',
            }}
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
                      onDeselect={getProjectUser}
                      onDropdownVisibleChange={(open) => !open && getProjectUser()}
                    >
                      {projects.map((it: any) => (
                        <Select.Option key={it.project_id} label={it.project_name}>
                          <span style={{ color: it.is_pm ? 'initial' : 'red' }}>
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
                      onChange={async () => {
                        const title = (await updateTitle()) || '';
                        setTitle(title);
                      }}
                      onBlur={onSave}
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
                      onChange={onSave}
                    />
                  </Form.Item>
                </th>
                <th>发布时间</th>
                <th style={{ width: 150, maxWidth: 170 }}>
                  <Form.Item name={'release_time'}>
                    <DatePicker
                      format={'YYYY-MM-DD HH:mm'}
                      allowClear={false}
                      onBlur={onSave}
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
                        options={allPerson}
                        name={config.name}
                        placeholder={`${config.title}人员`}
                        init={recentDuty?.[config.name]}
                        onDeselect={onSave}
                        onBlur={onSave}
                        disabled={!hasPermission}
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

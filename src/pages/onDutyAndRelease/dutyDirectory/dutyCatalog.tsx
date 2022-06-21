import { Select, DatePicker, Button, Form, message, Spin } from 'antd';
import styles from './index.less';
import { useEffect, useState } from 'react';
import { useParams, useModel } from 'umi';
import DutyListServices from '@/services/dutyList';
import html2canvas from 'html2canvas';
import { isEmpty, isEqual, omit } from 'lodash';
import moment from 'moment';
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

const FilterSelector = ({
  options = [],
  name,
  placeholder = '',
  init = {},
}: {
  options: any[];
  name: string;
  placeholder?: string;
  init?: Record<string, any>;
}) => {
  return (
    <Form.Item noStyle shouldUpdate={(pre, current) => pre[name] !== current[name]}>
      {({ getFieldValue }) => {
        return (
          <Form.Item name={name}>
            <Select
              {...opts}
              bordered={false}
              placeholder={placeholder}
              removeIcon={''}
              options={[{ ...init, label: init.name }]
                .concat(options)
                .map((it: any) => ({
                  ...it,
                  value: `${it.value}_${it.type}`,
                  disabled: getFieldValue(name)?.includes(it.fit),
                }))
                .filter((it) => it.type == 'head' || it.key !== init.key)}
            />
          </Form.Item>
        );
      }}
    </Form.Item>
  );
};

const DutyCatalog = () => {
  const { id } = useParams() as { id: string };
  const [allPerson, setAllPerson] = useState([]);
  const [projects, setProjects] = useState([]);
  const [envList, setEnvList] = useState<any[]>([]);
  const [methodList, setMethodList] = useState<any[]>([]);
  const [user, setUser] = useState([]);
  const [title, setTitle] = useState(`${moment().format('YYYYMMDD')}值班名单`);
  const [visible, setVisible] = useState(true);
  const [recentDuty, setRecentDuty] = useState<Record<string, any>>();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<Record<string, any>>();
  const [currentUser] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);

  const [form] = Form.useForm();
  // scene(现场) remote(远程) head(负责人)

  const getSource = async () => {
    const params = {
      start_time: moment().startOf('week').format('YYYY/MM/DD'),
      end_time: moment().endOf('week').format('YYYY/MM/DD'),
    };
    const [allPersons, projects, envs, methods, firstDuty] = await Promise.all([
      DutyListServices.getDevperson(),
      DutyListServices.getProject(),
      DutyListServices.releaseEnv(),
      DutyListServices.releaseMethod(),
      DutyListServices.getFirstDutyPerson(params),
    ]);
    let initDutyObj = {};
    const duty = firstDuty?.data
      ?.flat()
      .filter(
        (it: any) =>
          it.duty_order == '1' && Object.keys(recentType).includes(it.user_tech) && it.user_name,
      );
    const first = envs
      ?.filter((it: any) => !['cn-northwest-global'].includes(it.env))
      .map((it: any) => it.env)
      ?.join();
    const second = envs
      ?.filter((it: any) => !['cn-northwest-global', 'cn-northwest-1'].includes(it.env))
      .map((it: any) => it.env)
      ?.join();
    setEnvList(
      [
        { value: first, label: '集群1-7', key: first },
        { value: second, label: '集群2-7', key: second },
      ].concat(envs.map((it: any) => ({ value: it.env, label: it.env_name, key: it.env }))),
    );
    setMethodList(
      methods.map((it: any) => ({ value: it.method, label: it.method_name, key: it.method_name })),
    );
    duty.forEach((o: any) => {
      initDutyObj[recentType[o.user_tech]] = {
        value: o.user_id,
        label: o.user_name,
        key: o.user_id,
        type: 'head',
        disabled: true,
        name: `${o.user_name}(${o.user_tech}值班负责人)`,
        fit: `${o.user_id}_head`,
      };
    });
    setRecentDuty(initDutyObj);

    setAllPerson(
      allPersons?.map((it: any) => ({
        key: it.user_id,
        value: it.user_id,
        label: it.user_name,
        type: it.user_type,
        disabled: it.user_type,
        fit: `${it.user_id}_${it.user_type == 'scene' ? 'remote' : 'scene'}`,
      })),
    );
    const formatProject = projects?.map((it: any) => ({
      ...it,
      user: ['newfeature', 'enhancements'].includes(it.sprint_type)
        ? it.user
        : { user_id: initDutyObj?.backend?.key, user_name: initDutyObj?.backend?.label },
    }));
    setProjects(formatProject);
  };

  const getProjectUser = async () => {
    const values = await form.getFieldsValue();
    let result: any[] = [];
    values.project_ids?.forEach((id: string) => {
      const o = projects.find(
        (it: any) => id.toString() == it.project_id.toString() && !isEmpty(it.user),
      );
      o && result.push(o);
    });
    setUser((result?.map((it: any) => it.user) as any) || []);
    form.setFieldsValue({ project_pm: result?.map((it: any) => it.user?.user_id) });
  };

  const onScreenShot = async () => {
    const errTip = {
      project_ids: '请填写项目名称!',
      project_pm: '请填写负责人!',
      duty_date: '请填写值班日期!',
      release_time: '请填写发布时间!',
      release_env: '请填写发布环境!',
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
  };

  const onSave = async () => {
    const values = await form.getFieldsValue();
    let release_env = '';
    if (!isEmpty(values?.release_env)) {
      release_env = Array.from(new Set(values?.release_env))?.join(',');
    }
    const data = {
      person_duty_num: id,
      duty_name: title,
      user_id: currentUser?.userid,
      duty_date: moment(values.duty_date).format('YYYY-MM-DD'),
      project_ids: values.project_ids?.join(),
      project_pm: user?.map((it: any) => it.user_id)?.join(),
      release_env: Array.from(new Set(release_env.split(',')))?.join(','),
      release_method: values.release_method,
      release_time: `${moment(values.duty_date).format('YYYY-MM-DD')} ${moment(
        values.release_time,
      ).format('HH:mm:ss')}`,
      front: values.front?.map((it: any) => ({
        user_type: it?.split('_')?.[1],
        user_id: it?.split('_')?.[0],
      })),
      backend: values.backend?.map((it: any) => ({
        user_type: it?.split('_')?.[1],
        user_id: it?.split('_')?.[0],
      })),
      test: values.test?.map((it: any) => ({
        user_type: it?.split('_')?.[1],
        user_id: it?.split('_')?.[0],
      })),
      sqa: values.sqa?.map((it: any) => ({
        user_type: it?.split('_')?.[1],
        user_id: it?.split('_')?.[0],
      })),
      operations: values.operations?.map((it: any) => ({
        user_type: it?.split('_')?.[1],
        user_id: it?.split('_')?.[0],
      })),
    };
    const flag = isEqual(omit(data, 'user_id'), {
      ...detail,
      project_pm: detail?.project_pm?.map((it: any) => it.user_id).join(),
    });
    if (flag) return;
    await DutyListServices.addDuty(data);
    getDetail();
  };

  const getDetail = async () => {
    const res = await DutyListServices.getDutyDetail({ person_duty_num: id });
    if (isEmpty(res)) {
      form.setFieldsValue({ duty_date: moment(), release_time: moment().hour(23).minute(0) });
      return;
    }
    setDetail(res);
    setUser(res?.project_pm);
    res?.duty_name && setTitle(res?.duty_name);
  };

  const updateTitle = async () => {
    const values = await form.getFieldsValue();
    const time = moment(values.duty_date).format('YYYYMMDD');
    let type = '';
    if (values.release_env?.includes('cn-northwest-1') && values.release_env?.length == 1) {
      type = '灰度发布';
    } else type = '线上发布';
    setTitle(`${time}${type}值班名单`);
  };

  useEffect(() => {
    if (recentDuty && !isEmpty(recentDuty)) {
      form.setFieldsValue({
        front: [`${recentDuty?.front.value}_${recentDuty?.front.type}`],
        backend: [`${recentDuty?.backend.value}_${recentDuty?.backend.type}`],
        test: [`${recentDuty?.test.value}_${recentDuty?.test.type}`],
        sqa: [`${recentDuty?.sqa.value}_${recentDuty?.sqa.type}`],
        operations: [`${recentDuty?.operations.value}_${recentDuty?.operations.type}`],
      });
    }
  }, [recentDuty]);

  useEffect(() => {
    try {
      setLoading(true);
      getSource();
      getDetail();
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let release_env: string[] =
      detail?.release_env == 'unknown' || !detail?.release_env
        ? undefined
        : detail?.release_env.split(',');
    const env = detail?.release_env?.split(',');
    if (!isEmpty(envList) && !isEmpty(detail)) {
      const first = envList[0].key?.split(',');
      const second = envList[1].key?.split(',');
      const global = ['cn-northwest-global'];
      if (isEqual(env, first)) {
        release_env = [first.join(',')];
      }
      if (isEqual(env, second)) {
        release_env = [second.join(',')];
      }
      if (isEqual(env, first.concat(global))) {
        release_env = [first.join(','), global.join()];
      }
      if (isEqual(env, second.concat(global))) {
        release_env = [second.join(','), global.join()];
      }
      form.setFieldsValue({
        front: detail?.front?.map((it: any) => `${it.user_id}_${it.user_type}`),
        backend: detail?.backend?.map((it: any) => `${it.user_id}_${it.user_type}`),
        test: detail?.test?.map((it: any) => `${it.user_id}_${it.user_type}`),
        sqa: detail?.sqa?.map((it: any) => `${it.user_id}_${it.user_type}`),
        operations: detail?.operations?.map((it: any) => `${it.user_id}_${it.user_type}`),
        project_ids: detail?.project_ids?.split(','),
        project_pm: detail?.project_pm?.map((it: any) => it.user_id),
        release_time: moment(
          `${moment(detail?.duty_date).format('YYYY-MM-DD')} ${moment(detail?.release_time).format(
            'HH:mm:ss',
          )}`,
        ),
        duty_date: moment(detail?.duty_date),
        release_env,
        release_method:
          detail?.release_method == 'unknown' || !detail?.release_method
            ? undefined
            : detail?.release_method,
      });
    }
  }, [envList, detail]);

  return (
    <Spin spinning={loading} tip={'数据加载中...'}>
      <div className={styles.dutyCatalog} id={'dutyForm'}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <Button
            type={'text'}
            disabled={!visible}
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
                style={{ marginRight: 8 }}
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
        <Form form={form} onBlur={onSave}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>项目名称</th>
                <th style={{ minWidth: 240 }}>
                  <Form.Item name={'project_ids'}>
                    <Select
                      {...opts}
                      bordered={false}
                      placeholder={'项目名称'}
                      onChange={getProjectUser}
                      onDeselect={getProjectUser}
                      removeIcon={''}
                      options={projects.map((it: any) => ({
                        label: it.project_name,
                        value: it.project_id?.toString(),
                        key: it.project_id,
                      }))}
                      onDropdownVisibleChange={(open) => !open && onSave()}
                    />
                  </Form.Item>
                </th>
                <th style={{ width: 100 }}>项目负责人</th>
                <th style={{ minWidth: 100, maxWidth: 200 }}>
                  <Form.Item name={'project_pm'}>
                    {user?.map((it: any, index: number) => (
                      <p key={it.user_id} style={{ margin: '5px 0', fontWeight: 'initial' }}>
                        {`${it?.user_name}${index == user?.length - 1 ? '' : '、'}`}
                      </p>
                    ))}
                  </Form.Item>
                </th>
                <th>值班日期</th>
                <th style={{ width: 150, maxWidth: 170 }}>
                  <Form.Item name={'duty_date'}>
                    <DatePicker
                      format={'YYYY-MM-DD'}
                      allowClear={false}
                      onChange={updateTitle}
                      onBlur={onSave}
                    />
                  </Form.Item>
                </th>
                <th>发布环境</th>
                <th style={{ width: 120, maxWidth: 170 }}>
                  <Form.Item name={'release_env'}>
                    <Select
                      options={envList}
                      mode={'multiple'}
                      onSelect={updateTitle}
                      onDropdownVisibleChange={(open) => !open && onSave()}
                    />
                  </Form.Item>
                </th>
                <th>发布方式</th>
                <th style={{ width: 120, maxWidth: 170 }}>
                  <Form.Item name={'release_method'}>
                    <Select
                      options={methodList}
                      bordered={false}
                      showSearch={false}
                      showArrow={false}
                      onBlur={onSave}
                    />
                  </Form.Item>
                </th>
                <th>发布时间</th>
                <th style={{ width: 90, maxWidth: 120 }}>
                  <Form.Item name={'release_time'}>
                    <DatePicker.TimePicker format={'HH:mm'} allowClear={false} onBlur={onSave} />
                  </Form.Item>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>前端值班</td>
                <td colSpan={11}>
                  <FilterSelector
                    options={allPerson}
                    name={'front'}
                    placeholder={'前端值班人员'}
                    init={recentDuty?.front}
                  />
                </td>
              </tr>
              <tr>
                <td>后端值班</td>
                <td colSpan={11}>
                  <Form.Item name={'backend'}>
                    <FilterSelector
                      init={recentDuty?.backend}
                      options={allPerson}
                      name={'backend'}
                      placeholder={'后端值班人员'}
                    />
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td>测试值班</td>
                <td colSpan={11}>
                  <Form.Item name={'test'}>
                    <FilterSelector
                      options={allPerson}
                      name={'test'}
                      placeholder={'测试值班人员'}
                      init={recentDuty?.test}
                    />
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td>运维值班</td>
                <td colSpan={11}>
                  <Form.Item name={'operations'}>
                    <FilterSelector
                      options={allPerson}
                      name={'operations'}
                      placeholder={'运维值班人员'}
                      init={recentDuty?.operations}
                    />
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td>SQA值班</td>
                <td colSpan={11}>
                  <Form.Item name={'sqa'}>
                    <FilterSelector
                      options={allPerson}
                      name={'sqa'}
                      placeholder={'SQA值班人员'}
                      init={recentDuty?.sqa}
                    />
                  </Form.Item>
                </td>
              </tr>
            </tbody>
          </table>
        </Form>
      </div>
    </Spin>
  );
};
export default DutyCatalog;

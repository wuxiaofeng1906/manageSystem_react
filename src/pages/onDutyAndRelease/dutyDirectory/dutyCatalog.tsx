import { Select, DatePicker, Button, Form, message, Spin } from 'antd';
import styles from './index.less';
import { useEffect, useState } from 'react';
import { useParams, useModel } from 'umi';
import DutyListServices from '@/services/dutyList';
import html2canvas from 'html2canvas';
import { isEmpty, isEqual, uniqWith } from 'lodash';
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
              options={[{ ...init, label: init.name }].concat(options).map((it: any) => ({
                ...it,
                value: `${it.value}_${it.type}`,
                disabled: getFieldValue(name)?.includes(it.fit),
              }))}
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
  const [currentUser] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);

  const [form] = Form.useForm();
  // scene(现场) remote(远程) head(负责人)

  const resetArr = (arr1: any[], arr2: any[]) => {
    var set = arr2.map((item) => item.user_id);
    return arr1.filter((item) => !set.includes(item.value));
  };

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
    setEnvList(
      [
        { value: '2-7', label: '集群2-7' },
        { value: '1-7', label: '集群1-7' },
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

  const onShort = async () => {
    const values = await form.getFieldsValue();
    if (Object.values(values).some((it) => isEmpty(it))) {
      message.warning('所有数据均为必填项，请仔细填写');
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
        const res = await DutyListServices.pushWechat(formData);
      });
      setVisible(true);
    });
  };

  const onSave = async () => {
    const values = await form.getFieldsValue();
    let release_env = '';
    if (values.release_env?.includes('2-7')) {
      release_env = envList
        ?.filter(
          (it) => !['cn-northwest-global', 'cn-northwest-1', '2-7', '1-7'].includes(it.value),
        )
        .map((it) => it.value)
        ?.join();
    } else if (values.release_env?.includes('1-7')) {
      release_env = envList
        ?.filter((it) => !['cn-northwest-global', '1-7', '2-7'].includes(it.value))
        .map((it) => it.value)
        ?.join();
    } else release_env = uniqWith(values?.release_env, isEqual)?.join();

    const data = {
      person_duty_num: id,
      duty_name: title,
      user_id: currentUser?.userid,
      duty_date: moment(values.duty_date).format('YYYY-MM-DD'),
      project_ids: values.project_ids?.join(),
      project_pm: user?.map((it: any) => it.user_id)?.join(),
      release_env,
      release_method: values.release_method,
      release_time: moment(values.release_time).format('YYYY-MM-DD HH:mm:ss'),
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
    const res = await DutyListServices.addDuty(data);
    getDetail();
  };

  const getDetail = async () => {
    setLoading(true);
    try {
      const res = await DutyListServices.getDutyDetail({ person_duty_num: id });
      setLoading(false);
      if (isEmpty(res)) return;
      let release_env = [];
      const first = envList?.filter(
        (it) => !['cn-northwest-global', '2-7', '1-7'].includes(it.value),
      );
      const second = envList?.filter(
        (it) => !['cn-northwest-global', '2-7', '1-7', 'cn-northwest-1'].includes(it.value),
      );
      if (!isEmpty(envList)) {
        if (isEqual(res.release_env?.split(','), first)) {
          release_env = ['1-7'];
        } else if (isEqual(res.release_env?.split(','), second)) {
          release_env = ['2-7'];
        } else
          release_env =
            res.release_env == 'unknown' || !res.release_env
              ? undefined
              : res?.release_env?.split(',');
      }
      setUser(res?.project_pm);

      setTitle(res?.duty_name);
      form.setFieldsValue({
        front: res?.front?.map((it: any) => `${it.user_id}_${it.user_type}`),
        backend: res?.backend?.map((it: any) => `${it.user_id}_${it.user_type}`),
        test: res?.test?.map((it: any) => `${it.user_id}_${it.user_type}`),
        sqa: res?.sqa?.map((it: any) => `${it.user_id}_${it.user_type}`),
        operations: res?.operations?.map((it: any) => `${it.user_id}_${it.user_type}`),
        project_ids: res?.project_ids?.split(','),
        project_pm: res?.project_pm?.map((it: any) => it.user_id),
        release_time: moment(res?.release_time),
        duty_date: moment(res?.duty_date),
        release_env,
        release_method:
          res.release_method == 'unknown' || !res.release_method ? undefined : res.release_method,
      });
    } catch (e) {
      setLoading(false);
    }
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
    form.setFieldsValue({ duty_date: moment(), release_time: moment().hour(23).minute(0) });
  }, []);

  useEffect(() => {
    if (recentDuty) {
      form.setFieldsValue({
        front: [`${recentDuty.front.value}_${recentDuty.front.type}`],
        backend: [`${recentDuty.backend.value}_${recentDuty.backend.type}`],
        test: [`${recentDuty.test.value}_${recentDuty.test.type}`],
        sqa: [`${recentDuty.sqa.value}_${recentDuty.sqa.type}`],
        operations: [`${recentDuty.operations.value}_${recentDuty.operations.type}`],
      });
      return;
    }
  }, [recentDuty]);

  useEffect(() => {
    getSource().then((res) => {
      getDetail();
    });
  }, [id]);

  return (
    <Spin spinning={loading} tip={'数据加载中...'}>
      <div className={styles.dutyCatalog} id={'dutyForm'}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <Button
            type={'text'}
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
              onShort();
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

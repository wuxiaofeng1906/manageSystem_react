import { Modal, Form, Select, Table, Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { publishListColumn } from './UpgradeService/grid/columns';
import { useModel } from '@@/plugin-model/useModel';
import PreReleaseServices from '@/services/preRelease';
import { isEmpty } from 'lodash';

const StoryListModal = () => {
  const {
    setShowStoryModal,
    showStoryModal,
    getStoryList,
    updateStoryList,
    tabsData,
    autoStoryList,
    storyExecutionId,
  } = useModel('releaseProcess');

  const [form] = Form.useForm();
  const [executionList, setExecutionList] = useState<any[]>([]);
  const [storyNum, setStoryNum] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [stageFilter, setStageFilter] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      console.log(selected);
      await updateStoryList(selected);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getList = async () => {
    const executions_id = form.getFieldValue('execution_ids')?.join() ?? '';
    const res = await getStoryList({
      executions_id,
      ready_release_num: tabsData.activeKey ?? '',
    });
    setStageFilter(res);
  };

  const getSelectList = async () => {
    const executions = await PreReleaseServices.getExecutions(tabsData.activeKey ?? '');
    const storyNums = await PreReleaseServices.getStoryNum(storyExecutionId?.join() ?? '');
    setExecutionList(
      executions?.map((it: any) => ({
        label: it.project_name,
        value: it.project_id,
        type: it.sprint_type,
      })),
    );
    setStoryNum(storyNums.map((id: number) => ({ label: id, value: id })));
  };

  const onFilter = async () => {
    const values = form.getFieldsValue();
    const data = autoStoryList.filter(
      (it) =>
        (values.story_num ?? []).includes(it.story_num) ||
        (values.execution_ids ?? []).includes(it.execution),
    );
    setStageFilter(data);
  };

  useEffect(() => {
    if (!showStoryModal) return;
    try {
      setLoading(true);
      form.setFieldsValue({
        execution_ids: storyExecutionId ?? undefined,
      });
      getSelectList();
      getList();
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }, [showStoryModal]);

  const formData = form.getFieldsValue();
  const tableSource = useMemo(
    () =>
      isEmpty(formData.execution_ids) && isEmpty(formData.story_num) ? autoStoryList : stageFilter,
    [JSON.stringify(formData)],
  );

  return (
    <Modal
      title={'待发布需求列表'}
      visible={showStoryModal}
      onCancel={() => setShowStoryModal(false)}
      onOk={onConfirm}
      width={1200}
      destroyOnClose
      maskClosable={false}
      okButtonProps={{ disabled: loading }}
      okText={'确定'}
      cancelText={'取消'}
    >
      <Spin spinning={loading}>
        <Form form={form} size={'small'} layout={'inline'} onBlur={onFilter}>
          <Form.Item name={'execution_ids'} label={'所属执行'}>
            <Select
              style={{ width: 500 }}
              options={executionList}
              mode={'multiple'}
              showSearch
              allowClear
            />
          </Form.Item>
          <Form.Item name={'story_num'} label={'需求编号'}>
            <Select
              style={{ width: 400 }}
              options={storyNum}
              mode={'multiple'}
              showSearch
              allowClear
            />
          </Form.Item>
        </Form>
        <Table
          style={{ maxHeight: 500, width: '100%', margin: '4px 0' }}
          size={'small'}
          rowKey={(record) => record.story_num}
          columns={publishListColumn}
          dataSource={tableSource}
          pagination={false}
          rowSelection={{
            defaultSelectedRowKeys: selected?.map((it) => it.story_num),
            onChange: (selectedRowKeys, record) => {
              console.log(record);
              setSelected(
                isEmpty(selectedRowKeys)
                  ? []
                  : record?.map((it) => ({ story_num: it.story_num, execution: it.execution })),
              );
            },
          }}
        />
        <div>提示：如本次发布不涉及的需求，请将对应需求前勾选的复选框去掉</div>
      </Spin>
    </Modal>
  );
};
export default StoryListModal;

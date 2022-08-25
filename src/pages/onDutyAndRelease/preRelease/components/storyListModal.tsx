import { Modal, Form, Select, Table, Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { publishListColumn } from './UpgradeService/grid/columns';
import { useModel } from '@@/plugin-model/useModel';
import PreReleaseServices from '@/services/preRelease';
import { isEmpty, groupBy } from 'lodash';
import { useUnmount } from 'ahooks';
import { infoMessage } from '@/publicMethods/showMessages';

const StoryListModal = (props: { onRefersh?: Function }) => {
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
    if (isEmpty(selected)) return infoMessage('请至少勾选一条需求！');
    try {
      setLoading(true);
      const checked = tableSource.filter((it) => selected.includes(String(it.story_num)));
      const group = groupBy(checked, 'execution_id');
      const data = Object.entries(group).map(([executions_id, arr]) => ({
        story_num: isEmpty(selected) ? '' : arr.map((o) => o.story_num)?.join(),
        execution: executions_id,
        ready_release_num: tabsData.activeKey,
      }));
      await updateStoryList(data);
      setLoading(false);
      props.onRefersh?.(false);
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
    const initChecked = isEmpty(res?.check_story)
      ? res.story_data?.map((it: any) => it.story_num) ?? []
      : res?.check_story;
    setStageFilter(res.story_data);
    setSelected(initChecked);
  };

  const getSelectList = async () => {
    const executions = await PreReleaseServices.getExecutions(tabsData.activeKey ?? '');
    const storyNums = await PreReleaseServices.getStoryNum(storyExecutionId?.join() ?? '');
    setExecutionList(
      executions?.map((it: any) => ({
        label: it.execution_name,
        value: it.execution_id,
      })),
    );
    setStoryNum(storyNums.map((id: number) => ({ label: id, value: id })));
  };

  const onFilter = async () => {
    const values = form.getFieldsValue();
    const data = autoStoryList.filter(
      (it) =>
        (values.story_num ?? []).includes(it.story_num) ||
        (values.execution_ids ?? []).includes(String(it.execution_id)),
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
  useUnmount(() => {
    setShowStoryModal(false);
  });

  return (
    <Modal
      title={'待发布需求列表'}
      visible={showStoryModal}
      onCancel={() => {
        setShowStoryModal(false);
        props.onRefersh?.(false);
      }}
      onOk={onConfirm}
      width={1200}
      destroyOnClose
      maskClosable={false}
      okButtonProps={{ disabled: loading }}
      okText={'确定'}
      cancelText={'取消'}
      centered
    >
      <Spin spinning={loading}>
        <Form form={form} size={'small'} layout={'inline'} onFieldsChange={onFilter}>
          <Form.Item name={'execution_ids'} label={'所属执行'}>
            <Select
              style={{ width: 500 }}
              options={executionList}
              mode={'multiple'}
              showSearch
              allowClear
              getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
            />
          </Form.Item>
          <Form.Item name={'story_num'} label={'需求编号'}>
            <Select
              style={{ width: 400 }}
              options={storyNum}
              mode={'multiple'}
              showSearch
              allowClear
              getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
            />
          </Form.Item>
        </Form>
        <Table
          style={{ width: '100%', margin: '4px 0' }}
          size={'small'}
          rowKey={(record) => String(record.story_num)}
          columns={publishListColumn}
          dataSource={tableSource ?? []}
          pagination={false}
          scroll={{ y: 500, x: 1000 }}
          rowSelection={{
            selectedRowKeys: selected,
            onChange: (selectedRowKeys) => setSelected(selectedRowKeys),
          }}
        />
        <div>提示：如本次发布不涉及的需求，请将对应需求前勾选的复选框去掉</div>
      </Spin>
    </Modal>
  );
};
export default StoryListModal;

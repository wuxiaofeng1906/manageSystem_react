import { Modal, Form, Select, Table, Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { publishListColumn } from './UpgradeService/grid/columns';
import { useModel } from '@@/plugin-model/useModel';
import PreReleaseServices from '@/services/preRelease';
import { isEmpty, groupBy } from 'lodash';
import { useUnmount } from 'ahooks';
import { infoMessage } from '@/publicMethods/showMessages';

const StoryListModal = (props: { onRefresh?: Function }) => {
  const {
    setShowStoryModal,
    showStoryModal,
    getStoryList,
    updateStoryList,
    tabsData,
    autoStoryList,
    storyExecutionId,
    operteStatus,
  } = useModel('releaseProcess');

  const [form] = Form.useForm();
  const [executionList, setExecutionList] = useState<any[]>([]);
  const [storyNum, setStoryNum] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [stageFilter, setStageFilter] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancelDisabled, setCancelDisabled] = useState(false);
  const [init, setInit] = useState(true);

  const onConfirm = async () => {
    if (operteStatus) return;
    const checked = tableSource.filter((it) => selected.includes(String(it.story_num)));
    const group = groupBy(checked, 'execution_id');
    const data = Object.entries(group).map(([executions_id, arr]) => ({
      story_num: isEmpty(selected) ? '' : arr.map((o) => o.story_num)?.join(),
      execution: executions_id,
      ready_release_num: tabsData.activeKey,
    }));
    if (isEmpty(data) || isEmpty(selected)) return infoMessage('请至少勾选一条需求！');
    try {
      setLoading(true);
      await updateStoryList(data);
      setLoading(false);
      setShowStoryModal(false);
      props.onRefresh?.(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getList = async () => {
    setLoading(true);
    try {
      const executions_id = form.getFieldValue('execution_ids')?.join() ?? '';
      const res = await getStoryList({
        executions_id,
        ready_release_num: tabsData.activeKey ?? '',
      });
      setCancelDisabled(isEmpty(res?.check_story) && !isEmpty(res.story_data));
      const initChecked = isEmpty(res?.check_story)
        ? res.story_data?.map((it: any) => String(it.story_num)) ?? []
        : res?.check_story;
      setStageFilter(res.story_data);
      setSelected(initChecked);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
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
    if (isEmpty(values.story_num) && isEmpty(values.execution_ids)) setStageFilter(autoStoryList);
    else
      setStageFilter(
        autoStoryList.filter(
          (it) =>
            (values.story_num ?? []).includes(it.story_num) ||
            (values.execution_ids ?? []).includes(String(it.execution_id)),
        ),
      );
  };

  useEffect(() => {
    if (!showStoryModal) {
      setInit(true);
      return;
    }
    try {
      form.setFieldsValue({
        execution_ids: storyExecutionId ?? undefined,
      });
      getSelectList();
      getList();
      setInit(false);
    } catch (e) {
      setLoading(false);
    }
  }, [showStoryModal]);

  const tableSource = useMemo(() => (init ? autoStoryList : stageFilter) ?? [], [
    init,
    autoStoryList,
    stageFilter,
  ]);

  useUnmount(() => {
    setInit(true);
    setShowStoryModal(false);
  });

  return (
    <Modal
      title={'待发布需求列表'}
      visible={showStoryModal}
      width={1200}
      destroyOnClose
      okText={'保存'}
      cancelText={'取消'}
      centered
      closable={false}
      maskClosable={false}
      onOk={onConfirm}
      onCancel={() => setShowStoryModal(false)}
      okButtonProps={{ disabled: loading || operteStatus }}
      cancelButtonProps={{ disabled: cancelDisabled || loading }}
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
          dataSource={tableSource}
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

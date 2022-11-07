import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Form, Select, Checkbox, Table } from 'antd';
import { preServerColumn } from '@/pages/onlineSystem/common/column';
import { groupBy, isEmpty, uniq } from 'lodash';
import { mergeCellsTable, valueMap } from '@/utils/utils';

const ProcessDetail = () => {
  const [serverData, setServerData] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [checked, setChecked] = useState(false);
  const [checkBoxOpt, setCheckBoxOpt] = useState<string[]>([]);

  useEffect(() => {
    const mock = [
      { project_name: '笑果文化', release_num: '202209190001', applicant: 'h5' },
      { project_name: '薪资提计', release_num: '202209190003', applicant: 'h5' },
      { project_name: '笑果文化', release_num: '202209190004', applicant: 'web' },
      { project_name: 'stage-patch20220919', release_num: '202209190009', applicant: 'app' },
    ];
    setServerData(mock);
  }, []);

  const memoGroup = useMemo(() => {
    const table = mergeCellsTable(serverData ?? [], 'applicant');
    return {
      opts: uniq(serverData?.map((it) => it.applicant)),
      table,
    };
  }, [serverData]);
  return (
    <div>
      <h3>一、项目名称&分支</h3>
      <h3>二、应用服务</h3>
      <Checkbox
        checked={checked}
        onChange={({ target }) => {
          setSelectedRowKeys(target.checked ? serverData : []);
          setChecked(target.checked);
        }}
      >
        全部项目
      </Checkbox>
      <Checkbox.Group
        options={memoGroup.opts}
        value={checked ? memoGroup.opts : uniq(checkBoxOpt)}
        onChange={(v) => {
          setCheckBoxOpt(v as string[]);
          setChecked(v?.length == memoGroup.opts?.length);
          setSelectedRowKeys(serverData?.flatMap((it) => (v.includes(it.applicant) ? [it] : [])));
        }}
      />
      <Table
        size={'small'}
        rowKey={(record) => String(record.release_num)}
        dataSource={memoGroup.table}
        columns={preServerColumn}
        pagination={false}
        scroll={{ y: 400 }}
        rowSelection={{
          selectedRowKeys: selectedRowKeys?.map((it) => it.release_num),
          onChange: (v, arr) => {
            let group: string[] = [];
            let compare = groupBy(arr, 'applicant');
            let compareAll = groupBy(serverData, 'applicant');
            Object.entries(compareAll).forEach(([k, v]) => {
              if (compare[k]?.length == v?.length) group.push(k);
            });
            setCheckBoxOpt(group);
            setChecked(arr.length == serverData?.length);
            setSelectedRowKeys(arr);
          },
        }}
      />
    </div>
  );
};
export default ProcessDetail;

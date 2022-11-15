import { Button, InputNumber, Select } from 'antd';
import React, { useMemo } from 'react';
interface IParam {
  page: Record<'page_size' | 'page' | 'total', number>;
  onChange: (page: number) => void;
  showQuickJumper: (page: number) => void;
  onShowSizeChange: (page: number) => void;
}

const IPagination = ({ page, onChange, showQuickJumper, onShowSizeChange }: IParam) => {
  const pages = useMemo(() => Math.ceil(page.total / page.page_size), [page.total, page.page_size]);
  return (
    <div style={{ background: 'white', marginTop: 2, height: 50, paddingTop: 10 }}>
      <label style={{ marginLeft: 20, fontWeight: 'bold' }}> 共 {page.total} 条</label>
      <label style={{ marginLeft: 20, fontWeight: 'bold' }}>每页</label>
      <Select
        size={'small'}
        style={{ marginLeft: 10, width: 80 }}
        onChange={onShowSizeChange}
        value={page.page_size}
        options={[
          { value: 20, label: 20 },
          { value: 50, label: 50 },
          { value: 100, label: 100 },
          { value: 200, label: 200 },
        ]}
      />
      <label style={{ marginLeft: 10, fontWeight: 'bold' }}>条</label>
      <label style={{ marginLeft: 10, fontWeight: 'bold' }}>共 {pages} 页</label>
      <Button
        size={'small'}
        style={{
          fontWeight: 'bold',
          marginLeft: 20,
          color: 'black',
          backgroundColor: 'WhiteSmoke',
        }}
        disabled={page.page <= 1}
        onClick={() => onChange(page.page - 1)}
      >
        &lt;
      </Button>
      <span
        style={{
          display: 'inline-block',
          marginLeft: 10,
          textAlign: 'center',
          fontWeight: 'bold',
          backgroundColor: '#46A0FC',
          color: 'white',
          width: '40px',
        }}
      >
        {page.page || 1}
      </span>
      <Button
        size={'small'}
        style={{
          fontWeight: 'bold',
          marginLeft: 10,
          color: 'black',
          backgroundColor: 'WhiteSmoke',
        }}
        disabled={page.page >= pages}
        onClick={() => onChange(page.page + 1)}
      >
        &gt;
      </Button>
      <label style={{ marginLeft: 20, fontWeight: 'bold' }}> 跳转到第 </label>
      <InputNumber
        size={'small'}
        style={{ display: 'inline-block' }}
        onBlur={(e) => {
          let current = +e.target.value;
          if (+e.target.value <= 0) current = 1;
          else if (+e.target.value > pages) current = pages;
          if (current == page.page) return;
          showQuickJumper(current);
        }}
        max={pages}
        min={1}
      />
      <label style={{ marginLeft: 2, fontWeight: 'bold' }}> 页 </label>
    </div>
  );
};
export default IPagination;

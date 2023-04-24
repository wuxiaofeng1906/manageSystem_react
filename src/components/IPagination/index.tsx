import {Button, InputNumber, Select} from 'antd';
import React, {useMemo} from 'react';

interface IParam {
  page: Record<'page_size' | 'page' | 'total', number>;
  onChange: (page: number) => void;
  showQuickJumper: (page: number) => void;
  onShowSizeChange: (page: number) => void;
}

const IPagination = ({page, onChange, showQuickJumper, onShowSizeChange}: IParam) => {
  const pages = useMemo(() => Math.ceil(page.total / page.page_size), [page.total, page.page_size]);

  const onJump = (value: any) => {
    let current = +value;
    if (+value <= 0) current = 1;
    else if (+value > pages) current = pages;
    if (current == page.page) return;
    showQuickJumper(current);
  };
  return (
    <div style={{background: 'white', marginTop: 2, height: 50, paddingTop: 10}}>
      <strong> 共 {page.total} 条</strong>
      <strong style={{marginLeft: 20}}>每页</strong>
      <Select
        size={'small'}
        style={{marginLeft: 10, width: 80}}
        onChange={onShowSizeChange}
        value={page.page_size}
        options={[
          {value: 20, label: 20},
          {value: 50, label: 50},
          {value: 100, label: 100},
          {value: 200, label: 200},
        ]}
      />
      <strong style={{marginLeft: 10}}>条</strong>
      <strong style={{marginLeft: 10}}>共 {pages} 页</strong>
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
      <strong
        style={{
          display: 'inline-block',
          marginLeft: 10,
          textAlign: 'center',
          backgroundColor: '#46A0FC',
          color: 'white',
          width: '40px',
        }}
      >
        {page.page || 1}
      </strong>
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
      <strong style={{marginLeft: 20}}> 跳转到第 </strong>
      <InputNumber
        size={'small'}
        max={pages}
        min={1}
        style={{display: 'inline-block'}}
        onBlur={(e) => onJump(e.target.value)}
      />
      <strong style={{marginLeft: 2}}> 页 </strong>
    </div>
  );
};
export default IPagination;

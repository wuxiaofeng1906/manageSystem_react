import { Button, Input, Select } from 'antd';
import React from 'react';

const IPagation = ({ onNext, page, onPre, showQuickJumper, onShowSizeChange }) => {
  return (
    <div style={{ background: 'white', marginTop: 2, height: 50, paddingTop: 10 }}>
      <label style={{ marginLeft: 20, fontWeight: 'bold' }}> 共 {page.totalCounts} 条</label>
      <label style={{ marginLeft: 20, fontWeight: 'bold' }}>每页</label>
      <Select
        style={{ marginLeft: 10, width: 80 }}
        onChange={onShowSizeChange}
        value={page.countsOfPage}
        options={[
          { value: 20, label: 20 },
          { value: 50, label: 50 },
          { value: 100, label: 100 },
          { value: 200, label: 200 },
        ]}
      />
      <label style={{ marginLeft: 10, fontWeight: 'bold' }}>条</label>

      <label style={{ marginLeft: 10, fontWeight: 'bold' }}>共 {page.totalpage} 页</label>

      <Button
        size={'small'}
        style={{
          fontWeight: 'bold',
          marginLeft: 20,
          color: 'black',
          backgroundColor: 'WhiteSmoke',
        }}
        disabled={page.currentPage <= 1}
        onClick={onPre}
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
        {page.currentPage}
      </span>

      <Button
        size={'small'}
        style={{
          fontWeight: 'bold',
          marginLeft: 10,
          color: 'black',
          backgroundColor: 'WhiteSmoke',
        }}
        disabled={page.totalpage < page.currentPage + 1}
        onClick={onNext}
      >
        &gt;
      </Button>

      <label style={{ marginLeft: 20, fontWeight: 'bold' }}> 跳转到第 </label>
      <Input
        style={{ textAlign: 'center', width: 50, marginLeft: 2 }}
        defaultValue={1}
        onBlur={showQuickJumper}
      />
      <label style={{ marginLeft: 2, fontWeight: 'bold' }}> 页 </label>
    </div>
  );
};
export default IPagation;

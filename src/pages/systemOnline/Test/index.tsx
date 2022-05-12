import React from 'react';
import FlowArrow from '../components/FlowArrow';

const Test = () => {
  return (
    <div>
      <FlowArrow
        data={[
          {
            title: 'child',
            info: 'sdad',
            start: 1,
            end: 1,
            status: 'allReject',
          },
          {
            title: 'child2',
            info: 'sdad',
            start: 2,
            end: 2,
            status: 'success',
          },
          {
            title: 'child2',
            info: 'sdad',
            start: 3,
            end: 3,
            status: 'partReject',
          },
          {
            title: 'child2',
            info: 'sdad',
            start: 4,
            end: 4,
            status: 'no',
          },
          {
            title: 'child2',
            info: '好几个就感觉韩国锦湖就感觉返回',
            start: 5,
            end: 5,
            status: 'partReject',
          },
          {
            title: 'child2',
            info: 'sdad',
            start: 6,
            end: 6,
            status: 'noStart',
          },
          {
            title: 'child2',
            info: 'sdad',
            start: 7,
            end: 7,
            status: 'noStart',
          },
          {
            title: 'child2',
            info: 'sdad',
            start: 8,
            end: 8,
            status: 'noStart',
          },
          {
            title: 'child2',
            info: 'sdad',
            start: 9,
            end: 9,
            status: 'noStart',
          },
        ]}
      />
    </div>
  );
};
export default Test;

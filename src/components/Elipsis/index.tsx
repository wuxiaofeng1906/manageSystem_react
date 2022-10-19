import { Tooltip } from 'antd';
import React, { useState } from 'react';
import { TooltipPropsWithTitle } from 'antd/lib/tooltip';
import cs from 'classnames';
import './index.css';

interface EllipsisProps extends TooltipPropsWithTitle {
  width?: number;
}
const Ellipsis = ({ width = 80, className, ...props }: EllipsisProps) => {
  const [visible, setVisible] = useState(false);

  return visible ? (
    <Tooltip {...props}>
      <div className={cs('ellipsis', className)} style={{ width }}>
        {props.title}
      </div>
    </Tooltip>
  ) : (
    <div
      className={cs('ellipsis', className)}
      style={{ width }}
      ref={(e) => {
        if (e && e?.scrollWidth > e?.clientWidth) {
          setVisible(true);
        }
      }}
    >
      {props.title}
    </div>
  );
};
export default Ellipsis;

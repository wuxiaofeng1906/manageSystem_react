import { Tooltip } from 'antd';
import React, { useState } from 'react';
import { TooltipPlacement } from 'antd/lib/tooltip';
import cs from 'classnames';
import './index.css';

interface EllipsisProps {
  value: string;
  width?: number;
  height?: number;
  className?: string;
  placement?: TooltipPlacement;
}
const Ellipsis = ({ value, width = 80, className, placement }: EllipsisProps) => {
  const [visible, setVisible] = useState(false);

  return visible ? (
    <Tooltip title={value} placement={placement}>
      <div className={cs('ellipsis', className)} style={{ width }}>
        {value}
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
      {value}
    </div>
  );
};
export default Ellipsis;

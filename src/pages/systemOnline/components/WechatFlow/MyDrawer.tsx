import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Drawer } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';

interface IDrawer extends DrawerProps {
  [key: string]: any;
}

const ApproverDrawer = forwardRef(({ children, title, ...other }: IDrawer, ref) => {
  const [visible, setVisible] = useState(false);
  const onClose = () => {
    setVisible(false);
  };
  useImperativeHandle(ref, () => ({
    openModal: () => setVisible(true),
    closeModal: onClose,
  }));
  return (
    <Drawer title={title} placement="right" onClose={onClose} visible={visible} {...other}>
      {children}
    </Drawer>
  );
});

export default ApproverDrawer;

import { Space } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import { useUser } from '@/hooks/user';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC<any> = () => {
  const { setUser } = useUser();
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }
  useEffect(() => {
    setUser();
  }, []);

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <Space className={className}>
      <Avatar />
    </Space>
  );
};
export default GlobalHeaderRight;

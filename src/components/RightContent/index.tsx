import { Space } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { useModel } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import { checkLogin } from '@/utils/utils';
import { isEmpty } from 'lodash';
import { history } from '@@/core/history';
import { useGqlClient } from '@/hooks/index';
import { useSetUser } from '@/hooks/user';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC<any> = () => {
  const gqlClient = useGqlClient();
  const { setUser } = useSetUser();
  const { initialState } = useModel('@@initialState');
  const { flag, redirect } = checkLogin();
  if (!flag && isEmpty(initialState?.currentUser)) return history.push(redirect);

  const getUserAuth = useCallback(async () => {
    await setUser({ client: gqlClient, userInfo: initialState });
  }, []);

  if (!initialState || !initialState.settings) {
    return null;
  }
  useEffect(() => {
    getUserAuth();
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

import { Redirect } from 'umi';
import React, { useEffect } from 'react';
import { checkLogin } from '@/utils/utils';
import { useModel } from 'umi';
import { isEmpty } from 'lodash';
export default (props: any) => {
  const { flag, redirect } = checkLogin();
  const [getEnvs, globalEnv] = useModel('env', (env) => [env.getEnvs, env.globalEnv]);

  useEffect(() => {
    if (isEmpty(globalEnv) && flag) {
      getEnvs();
    }
  }, [globalEnv, flag]);

  if (flag) {
    return <div style={{ height: '100%' }}>{props.children}</div>;
  } else {
    return <Redirect to={redirect} />;
  }
};

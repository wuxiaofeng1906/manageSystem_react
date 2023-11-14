import React, {useState} from 'react';
import ProForm from '@ant-design/pro-form';
import {history} from 'umi';
import {useIntl} from '@@/plugin-locale/localeExports';
import {useModel} from '@@/plugin-model/useModel';
import styles from './index.less';

const Login: React.FC<{}> = () => {
  const [submitting] = useState(false);
  const [showTitle] = useState(false);

  const {initialState, setInitialState} = useModel('@@initialState');
  const intl = useIntl();

  const goto = async (prod = 'true', userInfo: any = null) => {
    if (!history) return;
    setTimeout(() => {
      const {query} = history.location;
      const {redirect} = query as { redirect: string };
      if (prod == 'true') {
        history.push(redirect || '/');
      } else {
        window.location.replace(
          `${location.protocol}//10.0.144.53:8000/home?auth=${userInfo?.access_token}&userId=${userInfo?.user?.id}&userName=${userInfo?.user?.userName}`,
        );
      }
    }, 20);
  };
  const handleSubmit = async () => {
    const tokens =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IuWQtOaZk-WHpCIsInN1YiI6Ild1WGlhb0ZlbmciLCJpYXQiOjE2MjM4MzA2Nzd9.G3EjtMWppClX_E2NN0dFPXgX6OsGSrIXy4ReT_Rs5zI';
    localStorage.setItem('accessId', tokens);
    const userInfo = {
      name: 'xiaofeng.wu',
      userid: '123456',
      group: 'admin',
      access: 'superGroup',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    };

    if (userInfo) {

      setInitialState({...initialState, currentUser: userInfo});
      goto();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content} hidden={showTitle}>
        {/* logo  */}
        <div className={styles.top}>
          <div className={styles.header}>
            <img alt="logo" className={styles.logo} src="/icons/flag.png"/>
            <span className={styles.title}>管理系统</span>
          </div>
          <div className={styles.desc}></div>
        </div>

        {/* 登录 */}
        <div className={styles.main}>
          <div>
            <ProForm
              submitter={{
                searchConfig: {
                  submitText: intl.formatMessage({
                    id: 'pages.login.submit',
                    defaultMessage: '登录',
                  }),
                },
                render: (_, dom) => dom.pop(),
                submitButtonProps: {
                  loading: submitting,
                  size: 'large',
                  style: {
                    width: '100%',
                  },
                },
              }}
              onFinish={async () => {
                handleSubmit();
              }}
            ></ProForm>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

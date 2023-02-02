import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import ProForm from '@ant-design/pro-form';
import { history, useLocation } from 'umi';
import { useIntl } from '@@/plugin-locale/localeExports';
import { useModel } from '@@/plugin-model/useModel';
import styles from './index.less';
import axios from 'axios';
import { useRequest } from 'ahooks';
import { useGqlClient } from '@/hooks';
import { useUser } from '@/hooks/user';

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */

const wxLogin = () => {
  setTimeout(function () {
    // (window as any).WwLogin({
    //   "id": "container",
    //   "appid": "ww90adb0abc37b79c8",
    //   "agentid": 1000002,
    //   "redirect_uri": encodeURIComponent('http://6ce224098541.ngrok.io/user/myLogin'),
    //   "state": "ww90adb0abc37b79c8",
    //   "href": "",
    // });

    (window as any).WwLogin?.({
      id: 'container',
      appid: 'wwcba5faed367cdeee',
      agentid: 1000021,
      // "redirect_uri": encodeURIComponent('http://dms.q7link.com:8000/user/myLogin'),
      redirect_uri: encodeURIComponent(
        `http://rd.q7link.com:8000/user/myLogin?prod=${location.origin?.includes('rd.q7link.com')}`,
      ),
      state: 'wwcba5faed367cdeee',
      href: '',
    });
  }, 1000);
};

// 添加企业微信需要的script标签
const qywxScript = () => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = false;
  script.src = 'http://rescdn.qqmail.com/node/ww/wwopenmng/js/sso/wwLogin-1.0.0.js';
  document.head.appendChild(script);
};

const Login: React.FC<{}> = () => {
  const urlParams = useLocation()?.query as {
    prod: string;
    code: string;
    state: string;
    appid: string;
  };
  const { setUser } = useUser();
  const [submitting] = useState(false);
  const [showTitle, setTitleShown] = useState(false);

  const { initialState, setInitialState } = useModel('@@initialState');
  const intl = useIntl();

  const fetchUserInfo = async (userInfos: any) => {
    // 测试时的token
    // console.log("登录后的token", userInfos.access_token);
    localStorage.setItem('accessId', userInfos.access_token); // 正式环境应放开
    localStorage.setItem('authority', JSON.stringify(userInfos.authorities));
    // console.log("myauth", JSON.stringify(userInfos.authorities));

    // 权限分组：
    // 系统管理员：拥有所有权限。
    // sprint管理员：除了系统设置，其他权限全有
    // 研发中心：所有除了客服和顾问的人员
    // 还有其他用户

    // 接下来需要判断用户

    // let accessRole = userInfos.role.name;
    // if (userInfos.role.name === "superGroup") {
    //   accessRole = 'sys_admin';
    // } else if (userInfos.role.name === "projectListMG") {
    //   accessRole = 'sprint_admin';
    // }

    const userInfo = {
      name: userInfos.user.userName,
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',

      userid: userInfos.user.id,
      group: userInfos.role.name,
      authority: userInfos.authorities,
      access: userInfos.role.name,
    };
    // 缓存状态
    localStorage.setItem('userLogins', JSON.stringify(userInfo)); // 正式环境应放开
    // console.log("userInfo", JSON.stringify(userInfo.authority));

    if (userInfo) {
      setInitialState({ ...initialState, currentUser: userInfo });
    }
  };

  const goto = () => {
    if (!history) return;
    setTimeout(() => {
      const { query } = history.location;
      const { redirect } = query as { redirect: string };
      urlParams.prod == 'true'
        ? history.push(redirect || '/')
        : window.location.replace(`${location.protocol}//10.0.144.53:8000`);
    }, 20);
  };
  const getUsersInfo = async (windowURL: any) => {
    // let userCode = '';
    if (windowURL.indexOf('?') !== -1) {
      // const firstGroup = windowURL.split('?'); // 区分问号后面的内容
      // const secondGroup = firstGroup[1].split('&'); // 区分code和其他属性
      // const thirdGroup = secondGroup[0].split('='); // 获取到=后面的值
      // userCode = thirdGroup[1].toString();
      console.log(urlParams);
      if (!windowURL.includes('redirect')) {
        // 不是重定向的时候才禁用
        setTitleShown(true); // 设置为不可见
      }
    }

    // console.log("usercode", userCode);
    // 如果获取到了usercode，则拿取用户信息和权限
    if (urlParams.code && !urlParams.code.includes('%')) {
      const data = { username: 'users', password: urlParams.code };
      await axios
        .post('/api/auth/login', data)
        .then(function (res) {
          const resultData = res.data;
          if (resultData.ok === true) {
            fetchUserInfo(resultData);
            goto();
          } else {
            message.error({
              content: '您无权登录！',
              duration: 1,
              style: {
                marginTop: '50vh',
              },
            });
          }
        })
        .catch(function (error) {
          if (error.toString().includes('401')) {
            message.error({
              content: `您无权登录！`,
              duration: 1,
              style: {
                marginTop: '50vh',
              },
            });
          } else {
            console.log('登陆失败，异常信息：', error);
          }
        });
    }
  };

  useRequest(() => getUsersInfo(window.location.href));

  const handleSubmit = async () => {
    const tokens =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IuWQtOaZk-WHpCIsInN1YiI6Ild1WGlhb0ZlbmciLCJpYXQiOjE2MjM4MzA2Nzd9.G3EjtMWppClX_E2NN0dFPXgX6OsGSrIXy4ReT_Rs5zI';
    localStorage.setItem('accessId', tokens);
    const userInfos = {
      name: 'testUser',
      userid: 'test',
      group: 'superGroup',
      access: 'superGroup',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    };
    // endregion
    await setUser({ ...initialState, currentUser: userInfos });
    goto();
  };

  useEffect(() => {
    wxLogin();
  }, []);

  // 正式环境不能显示”登录按钮“，必须扫二维码登录
  let showButton = 'none';
  const url = window.location.host;
  if (url !== 'rd.q7link.com:8000') {
    showButton = 'inline';
  }

  return (
    <div className={styles.container}>
      <div className={styles.content} hidden={showTitle}>
        {/* logo  */}
        <div className={styles.top}>
          <div className={styles.header}>
            <img alt="logo" className={styles.logo} src="/77Logo.png" />
            <span className={styles.title}>企企研发管理平台</span>
          </div>
          <div className={styles.desc}></div>
        </div>

        {/* 登录 */}
        <div className={styles.main}>
          {/* 自动登录 */}
          {qywxScript()}
          <div className={styles.desc} id="container"></div>

          {/* <TextArea rows={4} onChange={codeChanges}/> */}

          {/* 手动登录 */}

          <div style={{ display: showButton }}>
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

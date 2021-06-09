import {message} from 'antd';
import React, {useState, useEffect} from 'react';
import ProForm from '@ant-design/pro-form';
import {history} from 'umi';
import {useIntl} from "@@/plugin-locale/localeExports";
import {useModel} from "@@/plugin-model/useModel";
import styles from './index.less';
import axios from "axios";
import {useRequest} from "ahooks";


/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const goto = () => {

  if (!history) return;
  setTimeout(() => {
    const {query} = history.location;
    const {redirect} = query as { redirect: string };
    history.push(redirect || '/');
  }, 10);
};

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

    (window as any).WwLogin({
      "id": "container",
      "appid": "wwcba5faed367cdeee",
      "agentid": 1000021,
      "redirect_uri": encodeURIComponent('http://dms.q7link.com:8000/user/myLogin'),
      "state": "wwcba5faed367cdeee",
      "href": "",
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
  const [submitting] = useState(false);
  const {initialState, setInitialState} = useModel('@@initialState');
  const intl = useIntl();

  const fetchUserInfo = async (userInfos: any) => {

    localStorage.setItem("accessId", userInfos.access_token);
    localStorage.setItem("authority", JSON.stringify(userInfos.authorities));

    const userInfo = {
      name: userInfos.user.userName,
      userid: userInfos.user.id,
      group: userInfos.role.desc,
      authority: userInfos.authorities,
      access: userInfos.role.name === "superGroup" ? 'admin' : 'user'
    };

    if (userInfo) {
      setInitialState({
        ...initialState,
        currentUser: userInfo,
      });
    }
  };

  const getUsersInfo = async (windowURL: any) => {
    let okFlag = false;
    let userCode = "";
    if (windowURL.indexOf("?") !== -1) {
      const firstGroup = windowURL.split("?"); // 区分问号后面的内容
      const secondGroup = firstGroup[1].split("&"); // 区分code和其他属性
      const thirdGroup = secondGroup[0].split("="); // 获取到=后面的值
      userCode = thirdGroup[1].toString();
    }

    // 如果获取到了usercode，则拿取用户信息和权限
    if (userCode !== "") {
      const data = {
        username: "testUser",
        password: userCode
      };
      await axios
        .post('/api/auth/login', data)
        .then(function (res) {

          if (res.data.ok === true) {
            okFlag = true;
            fetchUserInfo(res.data);
            goto();
          } else {
            message.error({
              content: '无权登录！',
              duration: 1,
              style: {
                marginTop: '50vh',
              },
            });
          }
        })
        .catch(function (error) {
          message.error({
            content: `访问异常:${error.toString()}`,
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        });
    }

    return okFlag;
  };


  const {data, loading} = useRequest(() => getUsersInfo(window.location.href));

  console.log(data, loading);

  const handleSubmit = async () => {
    const userInfos = {
      name: 'testUser',
      userid: 'test',
      group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
      authority: '',
      access: 'admin'
    };

    if (userInfos) {
      setInitialState({
        ...initialState,
        currentUser: userInfos,
      });
    }

    goto();
  };

  useEffect(() => {
    wxLogin();
  }, []);

  return (
    <div className={styles.container}>

      <div className={styles.content}>

        {/* logo  */}
        <div className={styles.top}>
          <div className={styles.header}>
            <img alt="logo" className={styles.logo} src="/logo.svg"/>
            <span className={styles.title}>企企研发管理平台</span>
          </div>
          <div className={styles.desc}></div>
        </div>

        {/* 登录 */}
        <div className={styles.main}>
          {/* 自动登录 */}
          {qywxScript()}
          <div className={styles.desc} id="container"></div>

          {/* 手动登录 */}
          <ProForm submitter={{
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
          }} onFinish={async () => {
            handleSubmit();
          }}>
          </ProForm>

        </div>
      </div>

    </div>
  );
};

export default Login;

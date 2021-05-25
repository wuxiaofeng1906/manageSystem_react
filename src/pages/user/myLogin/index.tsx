import {message} from 'antd';
import React, {useState, useEffect} from 'react';
import ProForm from '@ant-design/pro-form';
import {history} from 'umi';
import {useIntl} from "@@/plugin-locale/localeExports";
import {useModel} from "@@/plugin-model/useModel";
import styles from './index.less';


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

    (window as any).WwLogin({
      "id": "container",
      "appid": "wwcba5faed367cdeee",
      "agentid": 1000021,
      "redirect_uri": encodeURIComponent('http://dms.q7link.com:8000/welcomes'),
      "state": "wwcba5faed367cdeee",
      "href": "",
    });
  }, 500);
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


  const fetchUserInfo = async () => {

    const userInfo = {
      name: "testAccount",
      // access: 'admin',
      address: "西湖区工专路 77 号",
      avatar: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
      country: "China",
      email: "antdesign@alipay.com",
      group: "蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED",
      notifyCount: 12,
      phone: "0752-268888888",
      signature: "海纳百川，有容乃大",
      title: "交互专家",
      unreadCount: 11,
      userid: "00000001",
    };


    setInitialState({
      ...initialState,
      currentUser: userInfo,
    });
  };

  const handleSubmit = async () => {
    message.success('登录成功！');
    await fetchUserInfo();
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

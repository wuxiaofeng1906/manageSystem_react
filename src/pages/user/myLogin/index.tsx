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

const getUsersInfo = (windowURL: any) => {
  let userCode = "";
  if (windowURL.indexOf("?") !== -1) {
    const firstGroup = windowURL.split("?"); // 区分问号后面的内容
    const secondGroup = firstGroup[1].split("&"); // 区分code和其他属性
    const thirdGroup = secondGroup[0].split("="); // 获取到=后面的值
    userCode = thirdGroup[1].toString();
  }

  console.log("userCode", userCode);

  return userCode;
};

const Login: React.FC<{}> = () => {
  const [submitting] = useState(false);
  const {initialState, setInitialState} = useModel('@@initialState');
  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      email: 'antdesign@alipay.com',
      signature: '海纳百川，有容乃大',
      title: '交互专家',
      group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
      tags: [
        {
          key: '0',
          label: '很有想法的',
        },
        {
          key: '1',
          label: '专注设计',
        },
        {
          key: '2',
          label: '辣~',
        },
        {
          key: '3',
          label: '大长腿',
        },
        {
          key: '4',
          label: '川妹子',
        },
        {
          key: '5',
          label: '海纳百川',
        },
      ],
      notifyCount: 12,
      unreadCount: 11,
      country: 'China',
      access: 'tester',
      geographic: {
        province: {
          label: '浙江省',
          key: '330000',
        },
        city: {
          label: '杭州市',
          key: '330100',
        },
      },
      address: '西湖区工专路 77 号',
      phone: '0752-268888888',
    };
    if (userInfo) {
      setInitialState({
        ...initialState,
        currentUser: userInfo,
      });
    }
  };

  const userCode = getUsersInfo(window.location.href);
  if (userCode !== "") {
    fetchUserInfo();
    goto();
  }


  const handleSubmit = async () => {
    message.success('登录成功！');
    await fetchUserInfo();
    goto();
  };

  useEffect(() => {
    if (userCode === "") {
      wxLogin();
    }
  }, [1]);

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

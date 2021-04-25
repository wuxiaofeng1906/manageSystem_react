import {
  LockTwoTone,
  MailTwoTone,
  MobileTwoTone,
  UserOutlined,
} from '@ant-design/icons';
import {Alert, message, Tabs} from 'antd';
import React, {useState, useEffect} from 'react';
import ProForm, {ProFormCaptcha, ProFormCheckbox, ProFormText} from '@ant-design/pro-form';
import {Link, history} from 'umi';
import {useIntl, FormattedMessage} from "@@/plugin-locale/localeExports";
import {useModel} from "@@/plugin-model/useModel";
import {SelectLang} from "@@/plugin-locale/SelectLang";

import Footer from '@/components/Footer';
import {fakeAccountLogin, getFakeCaptcha, LoginParamsType} from '@/services/login';

import styles from './index.less';


const LoginMessage: React.FC<{
  content: string;
}> = ({content}) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

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
    // window.WwLogin({
    //   "id": "container",
    //   "appid": "ww90adb0abc37b79c8",
    //   "agentid": 1000002,
    //   "redirect_uri": encodeURIComponent('dms.q7link.com'),
    //   "state": "ww90adb0abc37b79c8",
    //   "href": "",
    // });

    (window as any).WwLogin({
      "id": "container",
      "appid": "ww90adb0abc37b79c8",
      "agentid": 1000002,
      "redirect_uri": encodeURIComponent('http://dms.q7link.com:8000/welcomes'),
      "state": "ww90adb0abc37b79c8",
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

  useEffect(() => {
    wxLogin();
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const [type, setType] = useState<string>('account');
  const {initialState, setInitialState} = useModel('@@initialState');

  const intl = useIntl();


  const fetchUserInfo = async () => {

    const userInfo = {
      name: "admin",
      access: 'admin',
      // address: "西湖区工专路 77 号",
      // avatar: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
      // country: "China",
      // email: "antdesign@alipay.com",
      // group: "蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED",
      // notifyCount: 12,
      // phone: "0752-268888888",
      // signature: "海纳百川，有容乃大",
      // title: "交互专家",
      // unreadCount: 11,
      // userid: "00000001",
    };


    setInitialState({
      ...initialState,
      currentUser: userInfo,
    });
  };

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      // 登录
      const msg = await fakeAccountLogin({...values, type});

      if (msg.status === 'ok') {
        message.success('登录成功！');
        await fetchUserInfo();
        goto();
        return;
      }
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      message.error('登录失败，请重试！');
    }
    setSubmitting(false);
  };
  const {status, type: loginType} = userLoginState;

  return (

    <div className={styles.container}>
      {qywxScript()}
      <div className={styles.lang}>{SelectLang && <SelectLang/>}</div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src="/logo.svg"/>
              <span className={styles.title}>企企研发管理平台</span>
            </Link>
          </div>
          <div className={styles.desc}></div>
        </div>

        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
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
            onFinish={async (values) => {
              handleSubmit(values);
            }}
          >
            <Tabs activeKey={type} onChange={setType}>
              <Tabs.TabPane
                key="account"
                tab={intl.formatMessage({
                  id: 'pages.login.accountLogin.tab',
                  defaultMessage: '账户密码登录',
                })}
              />
              <Tabs.TabPane
                key="mobile"
                tab={intl.formatMessage({
                  id: 'pages.login.phoneLogin.tab',
                  defaultMessage: '手机号登录',
                })}
              />
            </Tabs>

            {status === 'error' && loginType === 'account' && (
              <LoginMessage
                content={intl.formatMessage({
                  id: 'pages.login.accountLogin.errorMessage',
                  defaultMessage: '账户或密码错误（admin/ant.design)',
                })}
              />
            )}
            {type === 'account' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon}/>,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.username.placeholder',
                    defaultMessage: '用户名: admin or user',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.username.required"
                          defaultMessage="请输入用户名!"
                        />
                      ),
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockTwoTone className={styles.prefixIcon}/>,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.password.placeholder',
                    defaultMessage: '密码: ant.design',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.password.required"
                          defaultMessage="请输入密码！"
                        />
                      ),
                    },
                  ]}
                />
              </>
            )}

            {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误"/>}
            {type === 'mobile' && (
              <>
                <ProFormText
                  fieldProps={{
                    size: 'large',
                    prefix: <MobileTwoTone className={styles.prefixIcon}/>,
                  }}
                  name="mobile"
                  placeholder={intl.formatMessage({
                    id: 'pages.login.phoneNumber.placeholder',
                    defaultMessage: '手机号',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.phoneNumber.required"
                          defaultMessage="请输入手机号！"
                        />
                      ),
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: (
                        <FormattedMessage
                          id="pages.login.phoneNumber.invalid"
                          defaultMessage="手机号格式错误！"
                        />
                      ),
                    },
                  ]}
                />
                <ProFormCaptcha
                  fieldProps={{
                    size: 'large',
                    prefix: <MailTwoTone className={styles.prefixIcon}/>,
                  }}
                  captchaProps={{
                    size: 'large',
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.captcha.placeholder',
                    defaultMessage: '请输入验证码',
                  })}
                  captchaTextRender={(timing, count) =>
                    timing
                      ? `${count} ${intl.formatMessage({
                        id: 'pages.getCaptchaSecondText',
                        defaultMessage: '获取验证码',
                      })}`
                      : intl.formatMessage({
                        id: 'pages.login.phoneLogin.getVerificationCode',
                        defaultMessage: '获取验证码',
                      })
                  }
                  name="captcha"
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.captcha.required"
                          defaultMessage="请输入验证码！"
                        />
                      ),
                    },
                  ]}
                  onGetCaptcha={async (mobile) => {
                    const result = await getFakeCaptcha(mobile);
                    if (result === false) {
                      return;
                    }
                    message.success('获取验证码成功！验证码为：1234');
                  }}
                />
              </>
            )}
            <div
              style={{
                marginBottom: 24,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录"/>
              </ProFormCheckbox>
              <a
                style={{
                  float: 'right',
                }}
              >
                <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码"/>
              </a>
            </div>
          </ProForm>

          <div className={styles.desc} id="container"></div>

        </div>
      </div>
      <Footer/>


    </div>
  );
};

export default Login;

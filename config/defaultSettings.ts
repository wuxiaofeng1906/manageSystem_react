import {Settings as LayoutSettings} from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: '企企研发管理平台',
  pwa: false,
  logo: '/77Logo.png',
  iconfontUrl: '',
  menu: {
    locale: false,
  }
};

export default Settings;

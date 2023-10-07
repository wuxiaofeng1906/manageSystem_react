import {Settings as LayoutSettings} from '@ant-design/pro-layout';

const Settings: LayoutSettings & { pwa?: boolean; logo?: string; } = {
  navTheme: 'light',
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: '管理系统',
  pwa: false,
  logo: '/icons/flag.png',
  iconfontUrl: '',
  menu: {
    locale: false,
  }
};

export default Settings;

import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  title: 'YB-API 开放平台',
  navTheme: 'light',
  colorPrimary: '#1890ff',
  layout: 'mix',
  splitMenus: true,
  contentWidth: 'Fluid',
  fixSiderbar: true,
  pwa: true,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  token: {},
  fixedHeader: true,
  siderMenuType: 'sub',
};

export default Settings;

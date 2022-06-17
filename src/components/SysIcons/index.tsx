import { Tooltip } from 'antd';
const SysIcons = ({ style, type }: { style: React.CSSProperties; type: 'log' }) => {
  <span style={style}>
    <Tooltip>
      <img src={require('../../../public/logs.png')} />
    </Tooltip>
  </span>;
};
export default SysIcons;

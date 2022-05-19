import { useState } from 'react';

export default () => {
  const [setting, setSetting] = useState({}); // 全局
  return { setting, setSetting };
};

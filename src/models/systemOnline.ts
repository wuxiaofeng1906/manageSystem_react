import { useState } from 'react';

export default () => {
  const [setting, setSetting] = useState<Record<string,any>|null>(null); // 全局
  const [disabled, setDisabled] = useState(false); 
  return { setting, setSetting,disabled,setDisabled };
};

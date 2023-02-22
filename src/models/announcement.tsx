import {useState} from 'react';

export default () => {
  // 升级公告详情界面数据（公共数据）
  const [anCommonData, setAnCommonData] = useState(null);
  // 升级公告详情界面数据（弹窗数据）
  const [anPopData, setAnnPopData] = useState(null);

  return {
    anCommonData, setAnCommonData,
    anPopData, setAnnPopData
  };
};

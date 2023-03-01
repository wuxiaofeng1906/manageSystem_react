import {useState} from 'react';

export default () => {
  // 升级公告详情界面数据（公共数据）
  const [commonData, setCommonData] = useState<any>(null);
  // 升级公告详情界面数据（弹窗数据）
  const [anPopData, setAnnPopData] = useState<any>([]);
  // 当前公告所属内容是否已经上线
  const [showPulishButton, setShowPulishButton] = useState<boolean>(false); // 暂时设置为true，正式使用要设置为false

  return {
    commonData, setCommonData,
    anPopData, setAnnPopData,
    showPulishButton, setShowPulishButton
  };
};

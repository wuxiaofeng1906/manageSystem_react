import { getOnlinedAutoCheckResult } from '@/pages/onlineSystem/preRelease/components/CheckProgress/axiosRequest';
import React from 'react';

const getAutoResult = async (releaseNum: string) => {
  const newData: any = await getOnlinedAutoCheckResult(releaseNum);
  //  需要看后端的上线后自动化检查结果
  if (newData && newData.length > 0) {
    let ignore = '';
    let ui_rt = '';
    let ui_color = '';
    let app_rt = '';
    let app_color = '';
    newData.forEach((ele: any) => {
      if (ele.ignore_check === 'yes') {
        ignore = '忽略检查';
      } else if (ele.check_type === 'ui') {
        ui_rt = ele.check_result === 'yes' ? '通过' : '不通过';
        ui_color = ele.check_result === 'yes' ? '#2BF541' : '#8B4513';
      } else if (ele.check_type === 'applet') {
        app_rt = ele.check_result === 'yes' ? '通过' : '不通过';
        app_color = ele.check_result === 'yes' ? '#2BF541' : '#8B4513';
      }
    });

    if (ignore === '忽略检查') {
      return (
        <div>
          {' '}
          发布成功后自动化检查结果: <label style={{ color: 'blue' }}>忽略检查</label>
        </div>
      );
    }

    return (
      <label>
        发布成功后自动化检查结果: UI：<label style={{ color: ui_color }}>{ui_rt}</label>； 小程序：
        <label style={{ color: app_color }}>{app_rt}</label>；
      </label>
    );
  }

  return <label></label>;
};

// 解析进度条相关数据来显示
const showProgressData = async (datas: any, activeKey: string = '') => {
  const results = {
    releaseProject: 'Gainsboro', // #2BF541
    upgradeService: 'Gainsboro',
    dataReview: 'Gainsboro',
    onliineCheck: 'Gainsboro',
    releaseResult: '9',
    processPercent: 0,
    autoCheckResult: <label></label>,
    announcement_num: datas.announcement_num ?? '',
  };

  let successCount = 0;
  if (datas.project_edit === '1') {
    results.releaseProject = '#2BF541';
    successCount += 1;
  }

  if (datas.update_service === '1') {
    results.upgradeService = '#2BF541';
    successCount += 1;
  }
  if (datas.review_confirm === '1') {
    results.dataReview = '#2BF541';
    successCount += 1;
  }

  if (datas.release_check === '1') {
    results.onliineCheck = '#2BF541';
    successCount += 1;
  }

  results.releaseResult = datas.release_result;
  results.processPercent = (successCount / 4) * 100;
  if (datas.ready_release_num) {
    results.autoCheckResult = await getAutoResult(datas.ready_release_num);
  } else {
    results.autoCheckResult = await getAutoResult(activeKey);
  }
  return results;
};

export { showProgressData, getAutoResult };
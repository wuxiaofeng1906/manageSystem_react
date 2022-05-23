import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import React from 'react';

const headerPath = [
  <Breadcrumb.Item key="班车工作台">班车工作台</Breadcrumb.Item>,
  <Breadcrumb.Item key="项目列表">
    <Link to="/sprint/sprintList">项目列表</Link>
  </Breadcrumb.Item>,
  <Breadcrumb.Item key="项目详情">项目详情</Breadcrumb.Item>,
];

// 获取统计类型和阶段的个数
const getStaticMessage = (oraData: any) => {
  if (!oraData) {
    return (
      <label style={{ marginLeft: 25 }}>
        <b>类型统计：</b>共 0 个，bug 0 个，story 0 个，B-story 0 个；
        <b>阶段统计：</b>未开始 0 个，开发中 0 个，开发完 0 个，测试中 0 个，测试完 0 个，已上线 0
        个；
        <b>测试确认：</b>是 0 个，否 0 个
      </label>
    );
  }

  const bugs = oraData.bug === undefined ? 0 : oraData.bug;
  const tasks = oraData.task === undefined ? 0 : oraData.task;
  const storys = oraData.story === undefined ? 0 : oraData.story;
  const B_story = oraData.B_story === undefined ? 0 : oraData.B_story;

  return (
    <label style={{ marginLeft: 25 }}>
      <b>类型统计：</b>共 {bugs + tasks + storys + B_story} 个，bug {bugs} 个，story {storys}{' '}
      个，B-story {B_story} 个；
      <b>阶段统计：</b>未开始 {oraData?.wait} 个，开发中 {oraData?.devloping} 个，开发完{' '}
      {oraData?.dev_finished} 个， 测试中 {oraData?.testing} 个，测试完 {oraData?.test_finished}{' '}
      个，已上线 {oraData?.onlined} 个；
      <b>测试确认：</b>是 {oraData?.testConfirm_yes} 个，否 {oraData?.testConfirm_no} 个
    </label>
  );
};

export { getStaticMessage, headerPath };

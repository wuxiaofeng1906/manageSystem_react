import { isEmpty } from 'lodash';
import { infoMessage } from '@/publicMethods/showMessages';
import { Modal, ModalFuncProps } from 'antd';
import React from 'react';

export const Step = { 0: 'server', 1: 'check', 2: 'sheet' };
export const WhetherOrNot = { yes: '是', no: '否' };
export const TechnicalSide = { backend: '后端', front: '前端', backendFront: '前后端' };
export const CheckTechnicalSide = { backend: '后端', front: '前端', public: '公共', test: '测试' };
// 应用服务配置 - 所属应用类型
export const appServerSide = {
  businessFront: '前端业务应用',
  businessBackend: '后端业务应用',
  platformBackend: '后端平台应用',
  process: '流程应用',
};
export const ZentaoPhase = {
  未开始: 1,
  进行中: 2,
  开发完: 3,
  测试中: 4,
  测试完毕: 5,
  已验收: 6,
  已发布: 7,
  已暂停: 8,
  已取消: 9,
  已关闭: 10,
};
export const ZentaoType = { Bug: 'bug', Story: 'story', B_Story: 'B_story', Task: 'task' };
export const CheckStatus = {
  skip: { text: '忽略', color: '#bfbfbf' },
  yes: { text: '通过', color: '#52c41a' },
  no: { text: '不通过', color: '#ff4d4f' },
  error: { text: '不通过', color: '#ff4d4f' },
  noHot: { text: '不可热更', color: '#d46b08' },
  version: { text: '未封版', color: '#faad14' },
  wait: { text: '未开始' },
  unknown: { text: '未知' },
  running: { text: '执行中', color: '#1890ff' },
};
export const PublishStatus = { doing: '发布中', done: '发布成功', wait: '未开始' };
export const ReleaseOrderStatus = { success: '发布成功', failure: '发布失败', unknown: '未发布' };
export const ServerConfirmType = {
  front: '前端',
  backend: '后端',
  process: '流程',
  global: 'global',
  'qbos&store': 'qbos&store',
  jsf: 'jsf',
  'openapi&qtms': 'openapi&qtms',
  emitter: 'emitter',
};
export const ClusterType = { global: 'global集群', tenant: '租户集群发布' };
export const PublishWay = { stop_server: '停服', keep_server: '不停服' };
export const StoryStatus = {
  wait: '未开始',
  planned: '已计划',
  projected: '已立项',
  developing: '研发中',
  developed: '研发完毕',
  testing: '测试中',
  tested: '测试完毕',
  verified: '已验收',
  released: '已发布',
  closed: '已关闭',
};
export const AutoCheckType = { ui: 'ui执行通过', api: '接口执行通过', applet: '小程序执行通过' };
export const checkInfo = [
  {
    check_type: '前端单元测试运行是否通过',
    side: 'front',
    status: 'test_case_status',
    start: 'test_case_start_time',
    end: 'test_case_end_time',
    open: false,
    open_pm: 'action_user',
    open_time: 'action_time',
    log: 'check_log',
    disabled: false,
    rowKey: 'front_test_unit', // 接口参数取值
    api_url: 'test-unit', // 批量检查接口地址
  },
  {
    check_type: '前端图标一致性检查是否通过',
    side: 'front',
    status: 'check_result',
    start: 'check_start_time',
    end: 'check_end_time',
    open: false,
    open_pm: 'action_user',
    open_time: 'action_time',
    log: 'check_log',
    disabled: false,
    rowKey: 'icon_check',
    api_url: 'icon-check',
  },
  {
    check_type: '前端代码遗漏检查是否通过',
    side: 'front',
    status: 'check_result',
    start: 'check_start_time',
    end: 'check_end_time',
    open: false,
    open_pm: 'action_user',
    open_time: 'action_time',
    log: 'check_log', // 链接
    disabled: false,
    rowKey: 'front_version_data',
    api_url: 'version-check',
  },
  {
    check_type: '前端服务git分支是否封版',
    side: 'front',
    status: 'sealing_version',
    start: 'version_check_start_time',
    end: 'version_check_end_time',
    open: false,
    open_pm: 'action_user',
    open_time: 'action_time',
    log: 'check_log',
    rowKey: 'front_seal_data',
    disabled: false,
    api_url: 'sealing-version-check',
  },
  {
    check_type: '后端单元测试运行是否通过',
    side: 'backend',
    status: 'test_case_status',
    start: 'test_case_start_time',
    end: 'test_case_end_time',
    open: false,
    open_pm: 'action_user',
    open_time: 'action_time',
    log: 'check_log',
    rowKey: 'backend_test_unit',
    disabled: false,
    api_url: 'test-unit',
  },
  {
    check_type: '后端代码遗漏检查是否通过',
    side: 'backend',
    status: 'check_result',
    start: 'check_start_time',
    end: 'check_end_time',
    open: false,
    open_pm: 'action_user',
    open_time: 'action_time',
    log: 'check_log', // 链接
    disabled: false,
    rowKey: 'backend_version_data',
    api_url: 'version-check',
  },
  {
    check_type: '构建时间对比校验是否通过',
    side: 'backend',
    status: 'check_result',
    start: 'check_start_time',
    end: 'check_end_time',
    open: false,
    open_pm: 'action_user',
    open_time: 'action_time',
    log: 'check_log', // 特殊处理日志
    disabled: false,
    rowKey: 'libray_data',
    api_url: 'create-libray',
  },
  // {
  //   check_type: '数据库升级验证是否通过',
  //   side: 'backend',
  //   status: 'version',
  //   start: '',
  //   end: '',
  //   open: false,
  //   open_pm: '',
  //   open_time: '',
  //   log: '',
  //   rowKey: 'access',
  //   disabled: false,
  // },
  {
    check_type: '后端环境一致性检查是否通过',
    side: 'backend',
    status: 'check_result',
    start: 'check_start_time',
    end: 'check_end_time',
    open: false,
    open_pm: 'action_user',
    open_time: 'action_time',
    log: 'check_address', // 链接
    rowKey: 'env_data',
    disabled: false,
    api_url: 'env-check',
  },
  {
    check_type: '后端是否可以热更新',
    side: 'backend',
    status: 'check_result',
    start: 'check_start_time',
    end: 'check_end_time',
    open: false,
    open_pm: 'action_user',
    open_time: 'action_time',
    log: 'check_log',
    rowKey: 'hot_data',
    disabled: false,
    api_url: 'hot-update-check',
  },
  {
    check_type: '后端服务git分支是否封版',
    side: 'backend',
    status: 'sealing_version',
    start: 'version_check_start_time',
    end: 'version_check_end_time',
    open: false,
    open_pm: 'action_user',
    open_time: 'action_time',
    log: 'check_log',
    rowKey: 'backend_seal_data',
    disabled: false,
    api_url: 'sealing-version-check',
  },
  {
    check_type: '上线前检查checklist是否检查完成',
    side: 'public',
    status: 'check_result',
    start: 'check_start_time',
    end: 'check_end_time',
    open: false,
    open_pm: 'action_user',
    open_time: 'action_time',
    log: 'check_log',
    rowKey: 'check_list_data',
    disabled: false,
    api_url: 'zt-check-list',
  },
  {
    check_type: '需求阶段是否满足条件（需要测试需达到测试完毕/无需测试需要开发完毕）',
    side: 'public',
    status: 'check_result',
    start: 'check_start_time',
    end: 'check_end_time',
    open: false,
    open_pm: 'action_user',
    open_time: 'action_time',
    log: 'check_log',
    rowKey: 'story_data',
    api_url: 'story-status',
  },
  {
    check_type: 'previewsql是否已执行',
    side: 'public',
    status: 'check_result',
    start: 'check_start_time',
    end: 'check_end_time',
    open: false,
    open_pm: 'action_user',
    open_time: 'action_time',
    log: 'check_log',
    rowKey: 'preview_sql_data',
    disabled: false,
    api_url: 'preview-sql',
  },
  {
    check_type: 'web/h5部署时是否勾选自动化测试参数',
    side: 'public',
    status: 'automation_check',
    start: 'check_start_time',
    end: 'check_end_time',
    open: false,
    open_pm: '',
    open_time: '',
    disabled: false,
    log: '',
    rowKey: 'auto_h5_web_data',
    api_url: 'web-h5-automation',
  },
  {
    check_type: '升级前自动化检查是否通过',
    side: 'test',
    status: '',
    start: '',
    end: '',
    open: false,
    open_pm: '',
    open_time: '',
    log: '',
    disabled: true,
    rowKey: 'auto_obj_data', // 数组结构
    api_url: 'auto-check',
  },
];
// 日志弹窗
export const onLog = (props: ModalFuncProps & { log: string; noData: string }) => {
  if (isEmpty(props.log)) return infoMessage(props.noData || '暂无日志！');
  Modal.info({
    width: props.width || 700,
    okText: props.okText || '取消',
    title: props.title,
    content: (
      <div style={{ maxHeight: 500, overflow: 'auto', paddingRight: 10, whiteSpace: 'pre-wrap' }}>
        {props.content ?? props.log}
      </div>
    ),
  });
};

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { useRequest } from 'ahooks';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { useGqlClient } from '@/hooks';
import { colums } from './girdInfo';
import { queryDevelopViews, queryRepeats, queryDeleteCount } from './data';
import moment from 'moment';
import { Button, message, Form, DatePicker, Select, Modal, Input, Row, Col, Spin } from 'antd';
import {
  FolderAddTwoTone,
  EditTwoTone,
  DeleteTwoTone,
  LogoutOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { formatMomentTime } from '@/publicMethods/timeMethods';
import { getHeight } from '@/publicMethods/pageSet';
import axios from 'axios';
import { judgeAuthority } from '@/publicMethods/authorityJudge';
import { useModel } from '@@/plugin-model/useModel';
import { errorMessage, infoMessage, sucMessage, warnMessage } from '@/publicMethods/showMessages';

const { RangePicker } = DatePicker;
const { Option } = Select;
// 默认条件：近一个月；未关闭的
const defalutCondition: any = {
  projectName: '',
  projectType: [],
  dateRange: { start: '', end: '' },
  projectStatus: ['wait', 'doing', 'suspended'],
};
let orgPrjname = '';
let delCounts = 0;

// 组件初始化
const SprintList: React.FC<any> = () => {
  const sys_accessToken = localStorage.getItem('accessId');
  axios.defaults.headers['Authorization'] = `Bearer ${sys_accessToken}`;
  const { initialState } = useModel('@@initialState');
  let currentUser: any;
  if (initialState?.currentUser) {
    currentUser = initialState.currentUser === undefined ? '' : initialState.currentUser.userid;
  }

  /* 整个模块都需要用到的 */
  const [formForAddAnaMod] = Form.useForm();
  const [formForDel] = Form.useForm();

  const [choicedCondition, setQueryCondition] = useState({
    projectName: '',
    projectType: [],
    dateRange: { start: '', end: '' },
    projectStatus: ['wait', 'doing', 'suspended'],
  });

  /* region  表格相关事件 */
  const gridApi = useRef<GridApi>(); // 绑定ag-grid 组件
  const gqlClient = useGqlClient();
  const { data, loading } = useRequest(() => queryDevelopViews(gqlClient, defalutCondition, true));
  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  if (gridApi.current) {
    if (loading) gridApi.current.showLoadingOverlay();
    else gridApi.current.hideOverlay();
  }

  // 表格的屏幕大小自适应
  const [gridHeight, setGridHeight] = useState(getHeight());
  window.onresize = function () {
    setGridHeight(getHeight());
    gridApi.current?.sizeColumnsToFit();
  };
  /* endregion */

  /* region 条件查询功能 */

  const updateGrid = async () => {
    const datas: any = await queryDevelopViews(gqlClient, choicedCondition, false);
    gridApi.current?.setRowData(datas);
  };

  // 项目名称输入事件
  const projectChanged = (params: any) => {
    //  输入后在useEffect中实现查询
    setQueryCondition({
      ...choicedCondition,
      projectName: params.target.value,
    });
  };

  // 项目类型选择事件
  const prjTypeChanged = (value: any) => {
    setQueryCondition({
      ...choicedCondition,
      projectType: value,
    });
  };

  // 时间选择事件
  const onTimeSelected = async (params: any, dateString: any) => {
    //  输入后在useEffect中实现查询
    setQueryCondition({
      ...choicedCondition,
      dateRange: {
        start: dateString[0],
        end: dateString[1],
      },
    });
  };

  // 选择项目状态
  const prjStatusChanged = async (value: any) => {
    //  输入后在useEffect中实现查询
    setQueryCondition({
      ...choicedCondition,
      projectStatus: value,
    });
  };

  /* endregion */

  /* region 显示默认数据  */

  const showDefalultValue = async () => {
    setQueryCondition({
      projectName: '',
      projectType: [],
      dateRange: { start: '', end: '' },
      projectStatus: ['wait', 'doing', 'suspended'],
    });
    const datas: any = await queryDevelopViews(gqlClient, defalutCondition, false);
    gridApi.current?.setRowData(datas);
  };

  /* endregion */

  /* region 新增功能 */
  // 时间选择后，检查数据库有无，有的话需要禁用某些控件
  const [isAble, setisAble] = useState({ shown: false });

  // 添加项目
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [modal, setmodal] = useState({ title: '新增项目' });
  const addProject = () => {
    const currentDate = moment(new Date()).add('year', 0);
    const privDate = moment(new Date()).add('year', 0).subtract('day', 1);

    formForAddAnaMod.setFieldsValue({
      prjLable: '',
      prjNames: null,
      prjDate: formatMomentTime(currentDate),
      starttime: formatMomentTime(privDate),
      testCutoff: formatMomentTime(currentDate),
      testFinnished: formatMomentTime(currentDate),
      planHuidu: formatMomentTime(currentDate),
      planOnline: formatMomentTime(currentDate),
      prjStatus: 'wait',
    });
    setmodal({ title: '新增项目' });
    // 赋值给控件
    setIsAddModalVisible(true);
    setisAble({ shown: false });
  };

  const queryRepeatProjectasync = async () => {
    const values = formForAddAnaMod.getFieldsValue();
    if (values.prjDate === null) {
      return;
    }
    const prjName = `${values.prjNames}${values.prjDate.format('YYYYMMDD')}`;
    const datas: any = await queryRepeats(gqlClient, prjName);
    if (datas === null) {
      errorMessage('您无权新增或修改!');
      setisAble({ shown: true });
      return;
    }

    // 时间选择后禁用某些控件
    if (datas.ok === true) {
      const privDate = moment(values.prjDate).subtract('day', 1);
      // 可以新增项目
      setisAble({ shown: false });
      formForAddAnaMod.setFieldsValue({
        prjLable: '',
        starttime: formatMomentTime(privDate),
        testCutoff: formatMomentTime(values.prjDate),
        testFinnished: formatMomentTime(values.prjDate),
        planHuidu: formatMomentTime(values.prjDate),
        planOnline: formatMomentTime(values.prjDate),
      });
    } else {
      setisAble({ shown: true });
      formForAddAnaMod.setFieldsValue({
        prjLable: '重复项目',
        // prjStatus: data.data.status  // data 可能没有数据
      });
    }
  };

  /* endregion */

  /* region 修改功能  */
  const showEditForm = (detailsInfo: any) => {
    const prjNames = detailsInfo.name.toString();
    orgPrjname = prjNames;
    let projectType = '';
    let prjTime = '';
    if (prjNames.indexOf('sprint') !== -1) {
      projectType = 'sprint';
    } else if (prjNames.indexOf('emergency') !== -1) {
      projectType = 'emergency';
    } else if (prjNames.indexOf('hotfix') !== -1) {
      projectType = 'hotfix';
    }
    prjTime = prjNames.replace(projectType, '').trim();

    formForAddAnaMod.setFieldsValue({
      prjLable: '',
      prjNames: projectType,
      prjDate: formatMomentTime(prjTime),
      starttime: formatMomentTime(detailsInfo.startAt),
      testCutoff: formatMomentTime(detailsInfo.testEnd),
      testFinnished: formatMomentTime(detailsInfo.testFinish),
      planHuidu: formatMomentTime(detailsInfo.expStage),
      planOnline: formatMomentTime(detailsInfo.expOnline),
      prjStatus: detailsInfo.status,
      prjId: detailsInfo.id,
    });

    setmodal({ title: '修改项目' });
    setIsAddModalVisible(true);
    setisAble({ shown: false });
  };

  // 修改项目
  const modifyProject = () => {
    const selRows: any = gridApi.current?.getSelectedRows(); // 获取选中的行
    // 没有选中则提醒
    if (selRows.length === 0) {
      errorMessage('请选中需要修改的数据!');
      return;
    }
    // 一次只能修改一条数据
    if (selRows.length > 1) {
      errorMessage('一次只能修改一条数据!');
      return;
    }
    showEditForm(JSON.parse(JSON.stringify(selRows[0])));
  };

  // 行事件双击
  const rowClicked = (params: any) => {
    showEditForm(params.data);
  };

  /* endregion */

  /* region 修改和新增公用的commit方法 */

  // 新增和修改弹出层取消按钮事件
  const handleCancel = () => {
    setIsAddModalVisible(false);
  };

  // sprint 项目保存
  const commitSprint = async () => {
    const values = formForAddAnaMod.getFieldsValue();
    const prjtype = values.prjNames;
    if (!prjtype || prjtype === null || values.prjDate === null) {
      errorMessage('项目名称不能包含空值!');
      return;
    }
    if (values.starttime >= values.testCutoff) {
      errorMessage('提测截止时间必须大于开始时间!');
      return;
    }
    if (values.prjStatus === null) {
      errorMessage('项目状态不能为空!');
      return;
    }

    const prjdate = values.prjDate === null ? '' : values.prjDate.format('YYYYMMDD');
    const datas = {
      name: `${prjtype}${prjdate}`,
      startAt: values.starttime.format('YYYY-MM-DD'), // formatMomentTime(values.starttime),
      endAt: values.testCutoff.format('YYYY-MM-DD'), // formatMomentTime(values.testCutoff),
      finishAt: values.testFinnished.format('YYYY-MM-DD'), // formatMomentTime(values.testFinnished),
      stageAt: values.planHuidu.format('YYYY-MM-DD'), // formatMomentTime(values.planHuidu),
      onlineAt: values.planOnline.format('YYYY-MM-DD'), // formatMomentTime(values.planOnline),
      status: values.prjStatus,
    };

    //  判断是修改还是新增
    if (modal.title === '新增项目') {
      datas['type'] = 'MANUAL';
      datas['creator'] = currentUser.toString();
      axios
        .post('/api/sprint/project', datas)
        .then(function (res) {
          if (res.data.ok === true) {
            setIsAddModalVisible(false);
            updateGrid();
            sucMessage('项目新增成功！');
          } else if (Number(res.data.code) === 403) {
            errorMessage('您无权新增项目！');
          } else {
            errorMessage(`${res.data.message}`);
          }
        })
        .catch(function (error) {
          if (error.toString().includes('403')) {
            errorMessage('您无权新增项目！');
          } else {
            errorMessage(`异常信息：${error.toString()}`);
          }
        });
    } else {
      datas['id'] = values.prjId;
      if (orgPrjname === datas['name']) {
        datas['name'] = '';
      }
      axios
        .put('/api/sprint/project', datas)
        .then(function (res) {
          if (res.data.ok === true) {
            setIsAddModalVisible(false);
            updateGrid();
            sucMessage('项目修改成功!');
          } else if (Number(res.data.code) === 403) {
            errorMessage('您无权修改项目！');
          } else {
            errorMessage(`${res.data.message}`);
          }
        })
        .catch(function (error) {
          if (error.toString().includes('403')) {
            errorMessage('您无权修改项目！');
          } else {
            errorMessage(`异常信息：${error.toString()}`);
          }
        });
    }
  };

  /* endregion */

  /* region 删除功能 */
  // 删除sprint列表
  const [isdelModalVisible, setIsDelModalVisible] = useState(false);
  // 删除按钮点击，弹出删除确认框
  const deleteSprintList = async () => {
    // 判断是否选中数据
    const selRows: any = gridApi.current?.getSelectedRows(); // 获取选中的行

    if (selRows.length === 0) {
      errorMessage('请选中需要删除的数据!');
      return;
    }
    if (selRows.length > 1) {
      errorMessage('一次只能删除一条数据!');
      return;
    }

    const datas: any = await queryDeleteCount(gqlClient, selRows[0].id);
    delCounts = datas.length;
    setIsDelModalVisible(true);
  };

  // 请求删除选中的行
  const delSprintList = () => {
    const selRows: any = gridApi.current?.getSelectedRows(); // 获取选中的行
    const prjId = selRows[0].id;
    const url = `/api/sprint/project/${prjId}`;
    axios
      .delete(url)
      .then(function (res) {
        if (res.data.ok === true) {
          setIsDelModalVisible(false);
          updateGrid();
          sucMessage('项目删除成功！');
        } else if (Number(res.data.code) === 403) {
          errorMessage('您无权删除项目！');
        } else {
          errorMessage(`${res.data.message}`);
        }
      })
      .catch(function (error) {
        if (error.toString().includes('403')) {
          errorMessage('您无权删除项目！');
        } else {
          errorMessage(`异常信息：${error.toString()}`);
        }
      });
  };

  const DelCancel = () => {
    setIsDelModalVisible(false);
  };
  /* endregion */

  /* region sprint 列表手动刷新 */
  const [refreshProject, setRefreshProject] = useState(false);
  const refreshGrid = async () => {
    setRefreshProject(true);

    await axios
      .post('/api/project/system/sync/sprint/project')
      .then(function (res) {
        if (res.data.ok === true) {
          updateGrid();
          sucMessage('项目同步成功！');
        } else {
          errorMessage(`${res.data.message}`);
        }
      })
      .catch(function (error) {
        errorMessage(`异常信息：${error.toString()}`);
      });

    setRefreshProject(false);
  };

  /* endregion */
  const rightStyle = { marginLeft: '30px' };
  const leftStyle = { marginLeft: '120px' };
  const widths = { width: '150px' };

  useEffect(() => {
    updateGrid();
  }, [choicedCondition]);

  // 2099的项目名称数据只对超管可见
  const formatRowData = useMemo(() => {
    return initialState?.currentUser?.group == 'superGroup'
      ? data ?? []
      : data?.filter((it: any) => !it.name.includes('2099'));
  }, [JSON.stringify(data), initialState?.currentUser?.group]);

  // 返回渲染的组件
  return (
    <PageContainer>
      <Spin spinning={refreshProject} tip="项目同步中..." size={'large'}>
        {/* 查询条件 */}
        <div style={{ width: '100%', overflow: 'auto', whiteSpace: 'nowrap', marginTop: -20 }}>
          <Form.Item name="prjName">
            <label style={{ marginLeft: '10px' }}>项目名称：</label>
            <Input
              placeholder="请输入"
              style={{ width: '18%' }}
              allowClear={true}
              onChange={projectChanged}
              value={choicedCondition.projectName}
            />

            <label style={{ marginLeft: '10px' }}>项目类型：</label>
            <Select
              placeholder="请选择"
              mode="multiple"
              style={{ width: '18%' }}
              value={choicedCondition.projectType}
              onChange={prjTypeChanged}
            >
              {[
                <Option key={'sprint'} value={'sprint'}>
                  sprint
                </Option>,
                <Option key={'hotfix'} value={'hotfix'}>
                  hotfix
                </Option>,
                <Option key={'emergency'} value={'emergency'}>
                  emergency
                </Option>,
              ]}
            </Select>

            <label style={{ marginLeft: '10px' }}>时间：</label>
            <RangePicker
              className={'times'}
              style={{ width: '18%' }}
              value={[
                choicedCondition.dateRange.start === ''
                  ? null
                  : moment(choicedCondition.dateRange.start),
                choicedCondition.dateRange.end === ''
                  ? null
                  : moment(choicedCondition.dateRange.end),
              ]}
              onChange={onTimeSelected}
            />

            <label style={{ marginLeft: '10px' }}>项目状态：</label>
            <Select
              placeholder="请选择"
              mode="multiple"
              style={{ width: '20%' }}
              onChange={prjStatusChanged}
              value={choicedCondition.projectStatus}
            >
              {[
                <Option key={'closed'} value={'closed'}>
                  已关闭
                </Option>,
                <Option key={'doing'} value={'doing'}>
                  进行中
                </Option>,
                <Option key={'suspended'} value={'suspended'}>
                  已挂起
                </Option>,
                <Option key={'wait'} value={'wait'}>
                  未开始
                </Option>,
              ]}
            </Select>
          </Form.Item>
        </div>

        {/* 新增、修改、删除按钮栏 */}
        <div style={{ background: 'white', marginTop: -15 }}>
          <Button
            type="text"
            style={{
              color: 'black',
              display: judgeAuthority('默认按钮') === true ? 'inline' : 'none',
            }}
            icon={<LogoutOutlined />}
            onClick={showDefalultValue}
          >
            默认：
          </Button>
          <label
            style={{
              color: 'black',
              display: judgeAuthority('默认按钮') === true ? 'inline' : 'none',
            }}
          >
            {' '}
            未关闭项目
          </label>
          <Button
            type="text"
            icon={<ReloadOutlined />}
            onClick={refreshGrid}
            style={{ display: 'inline', float: 'right' }}
          >
            刷新
          </Button>

          <Button
            type="text"
            style={{
              color: 'black',
              float: 'right',
              display: judgeAuthority('删除项目') === true ? 'inline' : 'none',
            }}
            icon={<DeleteTwoTone />}
            onClick={deleteSprintList}
          >
            删除
          </Button>

          <Button
            type="text"
            style={{
              color: 'black',
              float: 'right',
              display: judgeAuthority('修改项目名称') === true ? 'inline' : 'none',
            }}
            icon={<EditTwoTone />}
            onClick={modifyProject}
          >
            修改
          </Button>
          <Button
            type="text"
            style={{
              color: 'black',
              float: 'right',
              display: judgeAuthority('新增项目') === true ? 'inline' : 'none',
            }}
            icon={<FolderAddTwoTone />}
            onClick={addProject}
          >
            新增
          </Button>
        </div>

        {/* ag-grid 表格定义 */}
        <div className="ag-theme-alpine" style={{ height: gridHeight, width: '100%' }}>
          <AgGridReact
            columnDefs={colums()} // 定义列
            rowData={formatRowData} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              flex: 1,
              minWidth: 100,
              suppressMenu: true,
            }}
            autoGroupColumnDef={{
              minWidth: 100,
            }}
            groupDefaultExpanded={9} // 展开分组
            onGridReady={onGridReady}
            onRowDoubleClicked={rowClicked}
          ></AgGridReact>
        </div>
      </Spin>

      {/* 弹出层定义 */}
      <Modal
        title={modal.title}
        visible={isAddModalVisible}
        onCancel={handleCancel}
        centered={true}
        footer={null}
        width={700}
      >
        <Form form={formForAddAnaMod}>
          <Row gutter={16} style={{ marginBottom: '-20px' }}>
            <Col className="gutter-row">
              <div style={rightStyle}>
                <Form.Item label="项目名称：">
                  <Input.Group compact>
                    <Form.Item name="prjNames">
                      <Select
                        id={'prjNames'}
                        placeholder="请选择类型"
                        style={{ width: '150px' }}
                        onSelect={queryRepeatProjectasync}
                      >
                        {[
                          <Option key={'sprint'} value={'sprint'}>
                            sprint
                          </Option>,
                          <Option key={'hotfix'} value={'hotfix'}>
                            hotfix
                          </Option>,
                          <Option key={'emergency'} value={'emergency'}>
                            emergency
                          </Option>,
                        ]}
                      </Select>
                    </Form.Item>

                    <Form.Item name="prjDate">
                      <DatePicker onChange={queryRepeatProjectasync} />
                    </Form.Item>
                    <Form.Item name="prjLable">
                      <input
                        style={{
                          marginLeft: '10px',
                          color: 'red',
                          border: 'none',
                          backgroundColor: 'transparent',
                        }}
                        disabled={true}
                      />
                    </Form.Item>
                    <Form.Item name="prjId">
                      <label style={{ display: 'none' }}></label>
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col className="gutter-row">
              <div style={rightStyle}>
                <Form.Item name="starttime" label="开始时间">
                  <DatePicker style={widths} allowClear={false} />
                </Form.Item>
              </div>
            </Col>

            <Col className="gutter-row">
              <div style={leftStyle}>
                <Form.Item name="testCutoff" label="提测截止">
                  <DatePicker style={widths} allowClear={false} />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col className="gutter-row">
              <div style={rightStyle}>
                <Form.Item name="testFinnished" label="测试完成：">
                  <DatePicker style={widths} allowClear={false} />
                </Form.Item>
              </div>
            </Col>

            <Col className="gutter-row">
              <div style={leftStyle}>
                <Form.Item name="planHuidu" label="计划灰度：">
                  <DatePicker style={widths} allowClear={false} />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col className="gutter-row">
              <div style={rightStyle}>
                <Form.Item name="planOnline" label="计划上线：">
                  <DatePicker style={widths} allowClear={false} />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row">
              <div style={leftStyle}>
                <Form.Item name="prjStatus" label="项目状态:">
                  <Select placeholder="请选择" style={widths}>
                    {[
                      <Option key={'closed'} value={'closed'}>
                        已关闭
                      </Option>,
                      <Option key={'doing'} value={'doing'}>
                        进行中
                      </Option>,
                      <Option key={'suspended'} value={'suspended'}>
                        已挂起
                      </Option>,
                      <Option key={'wait'} value={'wait'}>
                        未开始
                      </Option>,
                    ]}
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: '50px' }}>
            <Button
              type="primary"
              style={{ marginLeft: '250px' }}
              disabled={isAble.shown}
              onClick={commitSprint}
            >
              确定
            </Button>
            <Button type="primary" style={{ marginLeft: '20px' }} onClick={handleCancel}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={'删除项目'}
        visible={isdelModalVisible}
        onCancel={DelCancel}
        centered={true}
        footer={null}
        width={500}
      >
        <Form form={formForDel}>
          <Form.Item>
            <label style={{ marginLeft: '20px' }}>
              此项目包含【{delCounts}】条数据，请确认是否删除？
            </label>
          </Form.Item>

          <Form.Item>
            <Button type="primary" style={{ marginLeft: '150px' }} onClick={delSprintList}>
              确定
            </Button>
            <Button type="primary" style={{ marginLeft: '20px' }} onClick={DelCancel}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default SprintList;

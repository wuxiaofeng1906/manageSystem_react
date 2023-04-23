import React, {useEffect, useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {Form, Select, DatePicker, Input, Row, Col, Button, Space, Spin, Modal} from 'antd';
import {CellClickedEvent, GridApi, GridReadyEvent} from 'ag-grid-community';
import {PageContainer} from '@ant-design/pro-layout';
import {ExclamationCircleOutlined, FolderAddTwoTone} from '@ant-design/icons';
import {announcementListColumn} from './column';
import styles from './index.less';
import DutyListServices from '@/services/dutyList';
import AnnouncementServices from '@/services/announcement';
import {isEmpty} from 'lodash';
import IPagination from '@/components/IPagination';
import {useModel, history} from 'umi';
import usePermission from '@/hooks/permission';
import {customMessage} from '@/publicMethods/showMessages';
import {deleteList, getAnnounceList} from "./axiosRequest/apiPage";
import dayjs from "dayjs";

const disabledStyle = {filter: 'grayscale(1)', cursor: 'not-allowed'};
const announceList = () => {
  const [user] = useModel('@@initialState', (init) => [init.initialState?.currentUser]);
  const {announcePermission} = usePermission();
  const [list, setList] = useState<any[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [persons, setPersons] = useState<any[]>([]);
  const [gridHeight, setGridHeight] = useState(window.innerHeight - 300);
  const [pages, setPages] = useState({
    page_size: 20,
    total: 0,
    page: 1,
  });

  const [form] = Form.useForm();
  const gridRef = useRef<GridApi>();

  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };

  // 获取列表数据
  const getList = async (page = 1, page_size = pages.page_size) => {
    const condition = form.getFieldsValue();
    let createTime = condition.create_time ? dayjs(condition.create_time).format("YYYY-MM-DD") : "";
    setSpinning(true);
    try {
      const res = await getAnnounceList(page, page_size, condition.create_user, createTime, condition.iteration);
      setSpinning(false);

      setList(res?.results);
      setPages({
        page: res?.page || 1,
        page_size: res?.page_size || 20,
        total: res?.total || 0,
      });
    } catch (e) {
      setSpinning(false);
    }
  };

  // 新增、修改
  const onAdd = async (params?: CellClickedEvent) => {
    if (!isEmpty(params) && !announcePermission?.().check)
      return customMessage({type: "info", msg: "您无查看公告权限！", position: "0vh"});

    // 新增
    if (isEmpty(params) && !announcePermission?.().add) return;
    if (!announcePermission?.().edit) return;
    let releaseID = '';
    let releaseName = '';
    let type = 'detail';

    if (isEmpty(params)) {
      // 先要获取公告name（后端服务生成）
      // const res = await DutyListServices.getDutyNum();
      // releaseName = res.ready_release_num;
      type = 'add';
    } else {
      // 修改的话就是原有的id
      releaseName = params?.data.iteration;
      releaseID = params?.data.id;
    }
    // if (isEmpty(releaseName)) return errorMessage('数据异常');

    history.push(`/onlineSystem/announcementDetail?releaseName=${releaseName}&releaseID=${releaseID}&type=${type}`);
  };

  // 删除数据
  const onDelete = async (params: CellClickedEvent) => {
    if (!announcePermission?.().delete) return;
    // 判断是否关联了发布过程公告
    if (isEmpty(params.data.id)) return customMessage({type: "info", msg: '数据异常', position: "0vh"});
    // const res = await AnnouncementServices.checkDeleteAnnouncement(params.data.announcement_num);
    let content = '请确认是否删除该公告?';
    // if (res.data == false) {
    //   content = '该公告已关联发布，请确认是否仍要删除？';
    // }
    Modal.confirm({
      title: '删除提醒',
      icon: <ExclamationCircleOutlined/>,
      content: content,
      centered: true,
      onOk: async () => {
        const delResult = await deleteList(params.data.id);
        if (delResult.ok) {
          customMessage({type: "success", msg: "删除成功！", position: "0vh"});
          getList();
        } else {
          customMessage({type: "error", msg: "删除失败，失败原因：" + delResult.message, position: "0vh"})
        }
      },
    });
  };

  // 获取人
  const getPerson = async () => {
    const res = await AnnouncementServices.applicant();
    setPersons(res?.map((it: any) => ({label: it.user_name, value: it.user_id})));
  };
  useEffect(() => {
    getPerson();
    getList();
    window.onresize = function () {
      setGridHeight(window.innerHeight - 300);
      gridRef.current?.sizeColumnsToFit();
    };
    return () => {
      window.onresize = null;
    };
  }, []);

  return (
    <Spin spinning={spinning} tip="数据加载中...">
      <PageContainer>
        <div className={styles.announcementList}>
          <Form form={form} className={styles.resetForm}>
            <Row justify={'space-between'} gutter={3} style={{marginBottom: 5}}>
              <Col span={3}>
                <Button
                  type={'text'}
                  onClick={() => onAdd()}
                  disabled={!announcePermission?.().add}
                  icon={
                    <FolderAddTwoTone style={announcePermission?.().add ? {} : disabledStyle}/>
                  }
                >
                  新增
                </Button>
              </Col>
              <Col span={7}>
                <Form.Item label={'公告名称'} name={'iteration'}>
                  <Input style={{width: '100%'}} onBlur={() => getList()}/>
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label={'创建人'} name={'create_user'}>
                  <Select
                    options={persons}
                    style={{width: '100%'}}
                    showSearch
                    optionFilterProp={'label'}
                    onDeselect={() => getList()}
                    onBlur={() => getList()}
                    mode={'multiple'}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label={'创建日期'} name={'create_time'}>
                  <DatePicker style={{width: '100%'}} onChange={() => getList()}/>
                </Form.Item>
              </Col>

            </Row>
          </Form>
          <div style={{height: gridHeight}}>
            <AgGridReact
              className="ag-theme-alpine"
              defaultColDef={{
                resizable: true,
                sortable: true,
                filter: true,
                suppressMenu: true,
                cellStyle: {'line-height': '30px'},
              }}
              rowHeight={30}
              headerHeight={35}
              suppressRowTransform={true}
              onGridReady={onGridReady}
              onGridSizeChanged={onGridReady}
              columnDefs={announcementListColumn}
              rowData={list}
              frameworkComponents={{
                operation: (params: CellClickedEvent) => {
                  return (
                    <Space size={8}>
                      <img
                        width={16}
                        style={announcePermission?.().check ? {cursor: 'pointer'} : disabledStyle}
                        src={require('../../../../../public/params.png')}
                        onClick={() => onAdd(params)}
                      />
                      <img
                        width={16}
                        height={17}
                        style={
                          announcePermission?.().delete ? {cursor: 'pointer'} : disabledStyle
                        }
                        src={require('../../../../../public/delete_red.png')}
                        onClick={() => onDelete(params)}
                      />
                    </Space>
                  );
                },
              }}
            />
          </div>
          <IPagination
            page={pages}
            onChange={(p) => getList(p, pages.page_size)}
            showQuickJumper={(p) => getList(p, pages.page_size)}
            onShowSizeChange={(size) => getList(1, size)}
          />
        </div>
      </PageContainer>
    </Spin>
  );
};


export default announceList;
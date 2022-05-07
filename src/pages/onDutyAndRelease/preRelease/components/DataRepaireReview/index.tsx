import React, {useEffect, useRef, useState} from 'react';
import {Button, Col, Form, Input, message, Modal, Row, Select} from 'antd';
import {useModel} from '@@/plugin-model/useModel';
import {confirmDataRepairService, dataRepaireReview} from './axiosRequest';
import {AgGridReact} from 'ag-grid-react';
import {getReviewColumns, getReviewConfirmColums} from './grid/columns';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {alalysisInitData} from '../../datas/dataAnalyze';
import {getCheckProcess} from '../../components/CheckProgress/axiosRequest';
import {showProgressData} from '../../components/CheckProgress/processAnalysis';
import {deleteLockStatus, getLockStatus} from '../../lock/rowLock';
import {loadCategorySelect, loadCommiterSelect} from '../../comControl/controler';
import {getGridRowsHeight} from '@/pages/onDutyAndRelease/preRelease/components/gridHeight';
import {releaseAppChangRowColor} from '../../operate';

const {TextArea} = Input;
const {Option} = Select;
const userLogins: any = localStorage.getItem('userLogins');
const usersInfo = JSON.parse(userLogins);
let currentOperateStatus = false;  // 需要将useState中的operteStatus值赋值过来，如果直接取operteStatus，下拉框那边获取不到罪行的operteStatus；
const DataRepaireReview: React.FC<any> = () => {
  // 获取当前页面的进度数据
  const {
    tabsData,
    modifyProcessStatus,
    dataReview,
    allLockedArray,
    setDataReview,
    dataReviewConfirm,
    lockedItem,
    modifyLockedItem,
    operteStatus,
  } = useModel('releaseProcess');

  /* region 数据修复review */
  const [dataReviewForm] = Form.useForm(); // 数据修复review
  const [dataReviewtModal, setDataReviewModal] = useState({shown: false, title: '新增'}); // 发布项新增和修改的共同modal显示
  const [dataReviewFormSelected, setDataReviewFormSelected] = useState({
    // 数据修复review 弹窗selected框
    category: [],
    repairCommiter: [],
  });
  const dataReviewGridApi = useRef<GridApi>();
  const onDataReviewGridReady = (params: GridReadyEvent) => {
    dataReviewGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  // 数据修复review弹出窗口进行修改和新增
  (window as any).showDataRepaireForm = async (type: any, params: any) => {
    // 是否是已完成发布
    if (currentOperateStatus) {
      message.error({
        content: `发布已完成，不能进行新增和修改！`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      return;
    }

    if (type === 'add') {
      dataReviewForm.resetFields();
      setDataReviewModal({
        shown: true,
        title: '新增',
      });
    } else {
      const reviewid = params.review_id;
      dataReviewForm.setFieldsValue({
        repaireContent: params.repair_data_content,
        relatedRenter: params.related_tenant,
        types: params.type,
        repaireCommiter: `${params.commit_user_id}&${params.commit_user_name}`,
        branch: params.branch,
        EvalResult: params.review_result,
        repeatExecute: params.is_repeat,
        reviewId: reviewid,
        commitID: params.commit_id,
      });

      modifyLockedItem(`${tabsData.activeKey}-step3-review-${reviewid}`);
      const lockInfo = await getLockStatus(`${tabsData.activeKey}-step3-review-${reviewid}`);

      if (lockInfo.errMessage) {
        message.error({
          content: `${lockInfo.errMessage}`,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      } else {
        setDataReviewModal({
          shown: true,
          title: '修改',
        });
      }
    }

    setDataReviewFormSelected({
      category: await loadCategorySelect(),
      repairCommiter: await loadCommiterSelect(),
    });
  };

  const dataReviewModalCancle = () => {
    setDataReviewModal({
      shown: false,
      title: '新增',
    });

    if (dataReviewtModal.title === '修改') {
      //   删除锁
      deleteLockStatus(lockedItem);
    }
  };

  // 保存数据修复review
  const saveDataReviewResult = async () => {
    const formData = dataReviewForm.getFieldsValue();
    const result = await dataRepaireReview(dataReviewtModal.title, tabsData.activeKey, formData);
    if (result === '') {
      message.info({
        content: '保存成功！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      setDataReviewModal({
        shown: false,
        title: '新增',
      });

      // 刷新
      const newData: any = await alalysisInitData('dataReview', tabsData.activeKey);
      setDataReview({
        gridHight: getGridRowsHeight(newData?.reviewData_repaire),
        gridData: newData?.reviewData_repaire,
      });

      if (dataReviewtModal.title === '修改') {
        // 删除锁
        deleteLockStatus(lockedItem);
      }
    } else {
      message.error({
        content: `${result}`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    }
  };

  /* endregion */

  /* region 数据修复确认 */

  const reviewConfirmGridApi = useRef<GridApi>();
  const onReviewConfirmGridReady = (params: GridReadyEvent) => {
    reviewConfirmGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };


  // 下拉框选择是否确认事件
  const saveDataRepaireConfirmInfo = async (newValue: string, oldData: any) => {
    // 如果是已发布的数据，则不能再修改
    if (currentOperateStatus) {
      message.error({
        content: `发布已完成，不能修改确认结果！`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return;
    }
    const currentReleaseNum = oldData.ready_release_num;
    //  如果前后两个值不同，则需要更新
    if (newValue !== oldData.confirm_status) {
      // 需要确认修复内容中是否可重复执行全部有值的时候才可以选择。
      let modifyFlag = true;
      dataReviewGridApi.current?.forEachNode((node: any) => {
        const dts = node.data;
        // 需要看本条数据是否有效，比如表格只有一条初始化的空数据时就无需验证
        if (dts.is_repeat && dts.is_repeat === '9') {
          message.error({
            content: '保存失败：数据修复review中是否可重复执行没有全部确认！',
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
          modifyFlag = false;
        }
      });

      if (modifyFlag) {
        const datas = {
          user_name: usersInfo.name,
          user_id: usersInfo.userid,
          confirm_id: oldData.confirm_id,
          ready_release_num: currentReleaseNum,
          confirm_result: newValue,
        };

        const result = await confirmDataRepairService(datas);
        if (result === '') {
          message.info({
            content: '保存成功！',
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });

          // 刷新状态进度条
          const processData: any = await getCheckProcess(currentReleaseNum);
          if (processData) {
            modifyProcessStatus(showProgressData(processData.data));
          }
        } else {
          message.error({
            content: `${result}`,
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        }
      }
      //   刷新表格
      const newData_confirm: any = await alalysisInitData('dataReviewConfirm', currentReleaseNum);
      reviewConfirmGridApi.current?.setRowData(newData_confirm.reviewData_confirm);
    }
  };
  /* endregion */

  useEffect(() => {
    currentOperateStatus = operteStatus;
  }, [operteStatus])
  return (
    <div>
      {/* 数据修复Review */}
      <div>
        <fieldset className={'fieldStyle'}>
          <legend className={'legendStyle'}>Step3 数据修复Review
            <label style={{color: "Gray"}}> (后端值班填写)</label>
          </legend>

          <div>
            {/* 数据修复 */}
            <div>
              <div
                className="ag-theme-alpine"
                style={{height: dataReview.gridHight, width: '100%', marginTop: -12}}
              >
                <AgGridReact
                  columnDefs={getReviewColumns()} // 定义列
                  rowData={dataReview.gridData}
                  defaultColDef={{
                    resizable: true,
                    sortable: true,
                    suppressMenu: true,
                    cellStyle: {'line-height': '25px'},
                    minWidth: 90,
                  }}
                  headerHeight={25}
                  rowHeight={25}
                  getRowStyle={(params: any) => {
                    return releaseAppChangRowColor(
                      allLockedArray,
                      'step3-review',
                      params.data?.review_id,
                    );
                  }}
                  onGridReady={onDataReviewGridReady}
                  onGridSizeChanged={onDataReviewGridReady}
                  onColumnEverythingChanged={onDataReviewGridReady}
                ></AgGridReact>
              </div>
            </div>

            {/* 数据修复确认 */}
            <div>
              <div style={{fontWeight: 'bold'}}> Review确认完成</div>
              <div
                className="ag-theme-alpine"
                style={{height: dataReviewConfirm.gridHight, width: '100%'}}
              >
                <AgGridReact
                  columnDefs={getReviewConfirmColums()} // 定义列
                  rowData={dataReviewConfirm.gridData}
                  defaultColDef={{
                    resizable: true,
                    sortable: true,
                    suppressMenu: true,
                    cellStyle: {'line-height': '25px'},
                  }}
                  frameworkComponents={{
                    selectChoice: (props: any) => {
                      let Color = 'black';
                      const currentValue = props.value;
                      if (currentValue === '1') {
                        Color = '#2BF541';
                      } else if (currentValue === '2') {
                        Color = 'orange';
                      } else if (currentValue === '9') {
                        return (
                          <Select
                            size={'small'} bordered={false}
                            style={{width: '100%'}}
                            defaultValue={"免"}
                            disabled
                          >
                          </Select>);
                      }

                      return (
                        <Select
                          size={'small'}
                          defaultValue={currentValue}
                          bordered={false}
                          style={{width: '100%', color: Color}}
                          onChange={(newValue: any) => {
                            saveDataRepaireConfirmInfo(newValue, props.data);
                          }}
                          disabled={currentOperateStatus}
                        >
                          <Option key={'1'} value={'1'}>
                            是
                          </Option>
                          <Option key={'2'} value={'2'}>
                            否
                          </Option>
                        </Select>
                      );
                    },
                  }}
                  headerHeight={25}
                  rowHeight={25}
                  onGridReady={onReviewConfirmGridReady}
                  onGridSizeChanged={onReviewConfirmGridReady}
                  onColumnEverythingChanged={onReviewConfirmGridReady}
                  // onCellEditingStopped={saveDataRepaireConfirmInfo}
                >
                </AgGridReact>
              </div>
            </div>
          </div>
        </fieldset>
      </div>

      {/* 数据修复review */}
      <Modal
        title={dataReviewtModal.title}
        visible={dataReviewtModal.shown}
        onCancel={dataReviewModalCancle}
        centered={true}
        footer={null}
        width={630}
      >
        <Form form={dataReviewForm}>
          <Form.Item
            name="repaireContent"
            label="数据修复内容:"
            required
            style={{marginTop: -15}}
          >
            <TextArea/>
          </Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item
                name="relatedRenter"
                label="涉及租户："
                required
                style={{marginTop: -15}}
              >
                <Input style={{marginLeft: 14, width: 191}}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="types"
                label="类型："
                required
                style={{marginLeft: 10, marginTop: -15}}
              >
                <Select showSearch>{dataReviewFormSelected.category}</Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                name="repaireCommiter"
                label="修复提交人："
                required
                style={{marginTop: -15}}
              >
                <Select showSearch>{dataReviewFormSelected.repairCommiter}</Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="branch"
                label="分支："
                required
                style={{marginLeft: 10, marginTop: -15}}
              >
                <Input/>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item name="EvalResult" label="评审结果：" required style={{marginTop: -15}}>
                <Select style={{width: 191, marginLeft: 14}}>
                  <Option key={'1'} value={'1'}>
                    {'通过'}
                  </Option>
                  <Option key={'2'} value={'2'}>
                    {'不通过'}
                  </Option>
                  <Option key={'9'} value={'9'}>
                    {' '}
                    {}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="repeatExecute"
                label="是否可重复执行："
                required
                style={{marginLeft: 10, marginTop: -15}}
              >
                <Select>
                  <Option key={'1'} value={'1'}>
                    {'是'}
                  </Option>
                  <Option key={'2'} value={'2'}>
                    {'否'}
                  </Option>
                  <Option key={'9'} value={'9'}>
                    {' '}
                    {}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              style={{borderRadius: 5, marginLeft: 20, float: 'right'}}
              onClick={dataReviewModalCancle}
            >
              取消
            </Button>
            <Button
              type="primary"
              style={{
                color: '#46A0FC',
                backgroundColor: '#ECF5FF',
                borderRadius: 5,
                float: 'right',
              }}
              onClick={saveDataReviewResult}
            >
              确定{' '}
            </Button>
          </Form.Item>
          {/* 隐藏字段，进行修改需要的字段 */}
          <Row style={{marginTop: -60}}>
            <Col span={2}>
              <Form.Item name="reviewId">
                <Input style={{width: 50, display: 'none'}}/>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="commitID">
                <Input style={{width: 50, display: 'none'}}/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default DataRepaireReview;

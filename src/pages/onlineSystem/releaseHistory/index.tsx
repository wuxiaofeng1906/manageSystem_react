import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import type { GridApi, GridReadyEvent } from 'ag-grid-community';
import { useRequest } from 'ahooks';
import {
  getFirstGrayscaleListData,
  getFormalListData,
  vertifyOnlineProjectExit,
  getOnlineProocessDetails,
  delGrayReleaseHistory,
  getZeroGrayscaleListData,
} from './axiosRequest/apiPage';
import { history } from '@@/core/history';
import { Button, DatePicker, Select, Popconfirm, Modal, Form } from 'antd';
import { loadPrjNameSelect } from '@/pages/onlineSystem/preRelease/comControl/controler';
import dayjs from 'dayjs';
import moment from 'moment';
import { grayscaleBacklogList, releasedList } from './gridSet';
import { errorMessage, sucMessage } from '@/publicMethods/showMessages';
import { gridHeadDivStyle, girdDefaultSetting } from './commonSetting';
import './style.css';
import { Link } from 'umi';
import PreReleaseServices from '@/services/preRelease';
import { isEmpty } from 'lodash';

const RangePicker: any = DatePicker.RangePicker;

// 0级灰度发布列表时间
// let zeroStart = dayjs().subtract(30, 'day').format("YYYY-MM-DD");
// let zeroEnd = dayjs().format("YYYY-MM-DD");
// let zeroStart = dayjs().startOf('month').format("YYYY-MM-DD");
// let zeroEnd = dayjs().endOf('month').format("YYYY-MM-DD");
// 1级灰度发布列表时间
// let firstStart = dayjs().subtract(30, 'day').format("YYYY-MM-DD");
// let firstEnd = dayjs().format("YYYY-MM-DD");
// let firstStart = dayjs().startOf('month').format("YYYY-MM-DD");
// let firstEnd = dayjs().endOf('month').format("YYYY-MM-DD");
// 正式发布时间等条件
const formalQueryCondition = {
  start: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
  end: dayjs().add(7, 'day').format('YYYY-MM-DD'),
  project: '',
  page: 1, // 跳转到第几页
  pageSize: 100, // 一页显示多少条数据
};

const ReleaseHistory: React.FC<any> = () => {
  // 设置表格的高度。
  const [gridHeight, setGridHeight] = useState({
    zeroGrid: 100,
    firstGrid: 100,
    peddingGrid: 100,
    formalGrid: 100,
    grayFailGrid: 200,
  });

  /* region 灰度发布界面 */

  /* region 0级灰度积压列表 */
  const zeroGrayscaleGridApi = useRef<GridApi>();
  const onZeroGrayscaleGridReady = (params: GridReadyEvent) => {
    zeroGrayscaleGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const [zeroButtonTitle, setZeroButtonTitle] = useState('一键生成1级灰度发布'); // 待发布详情
  // 0级灰度积压列表数据
  const zeroGrayscaleData = useRequest(() => getZeroGrayscaleListData()).data;
  // 一键生成正式发布
  const generateFormalZeroRelease = async () => {
    const sel_rows = zeroGrayscaleGridApi.current?.getSelectedRows();
    // 如果是待发布详情，则不需要判断有没有勾选
    if (zeroButtonTitle === '待发布详情') {
      history.push(`/onDutyAndRelease/officialRelease?releaseType=gray`);
    } else {
      if (sel_rows?.length === 0) {
        errorMessage('请先勾选需要发布的数据！');
        return;
      }
      const ready_release_num: any = [];
      sel_rows?.forEach((ele: any) => {
        ready_release_num.push(ele.ready_release_num);
      });

      // 需要在这个页面生成发布编号。只有成功了才跳转到详情界面
      const readyReleaseNum = ready_release_num.join('|');
      const onlineNum = await getOnlineProocessDetails(readyReleaseNum, 'gray');
      if (onlineNum) {
        history.push(
          `/onDutyAndRelease/officialRelease?releaseType=gray&releaseNum=${readyReleaseNum}&onlineReleaseNum=${onlineNum}`,
        );
      }
    }
  };

  // 刷新0级灰度发布
  const refreshZeroReleaseGrid = async () => {
    const girdDatas = await getZeroGrayscaleListData();
    if (girdDatas.message !== '') {
      errorMessage(girdDatas.message.toString());
    } else {
      zeroGrayscaleGridApi.current?.setRowData(girdDatas?.data);
      setGridHeight({
        ...gridHeight,
        zeroGrid: (girdDatas?.data).length * 30 + 80,
      });
    }
  };

  // // 根据时间查询
  // const onZeroGrayReleaseTimeChanged = async (params: any, times: any) => {
  //   if (times[0]) {
  //     zeroStart = dayjs(times[0]).format("YYYY-MM-DD");
  //   } else {
  //     zeroStart = "";
  //   }
  //   if (times[1]) {
  //     zeroEnd = dayjs(times[1]).format("YYYY-MM-DD");
  //   } else {
  //     zeroEnd = "";
  //   }
  //   // 更新数据
  //   await refreshZeroReleaseGrid();
  // };

  /* endregion */

  /* region 1级灰度积压列表 */
  const firstGrayscaleGridApi = useRef<GridApi>();
  const onFirstGrayscaleGridReady = (params: GridReadyEvent) => {
    firstGrayscaleGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  const [firstButtonTitle, setFirstButtonTitle] = useState('一键生成正式发布'); // 待发布详情
  // 1级灰度积压列表数据
  const firstGrayscaleData = useRequest(() => getFirstGrayscaleListData()).data;
  // 一键生成正式发布
  const generateFormalFirstRelease = async (type = 'online') => {
    const sel_rows =
      type == 'ongoing'
        ? peddingGridApi?.current?.getSelectedRows()
        : firstGrayscaleGridApi.current?.getSelectedRows();
    const flag =
      type == 'ongoing' ? peddingButtonTitle === '待发布详情' : firstButtonTitle === '待发布详情';
    // 如果是待发布详情，则不需要判断有没有勾选
    if (flag) {
      history.push(`/onDutyAndRelease/officialRelease?releaseType=${type}`);
    } else {
      if (sel_rows?.length === 0) {
        errorMessage('请先勾选需要发布的数据！');
        return;
      }
      const ready_release_num: any = [];
      sel_rows?.forEach((ele: any) => {
        // 这里的编号不传release_gray_num，使用：ready_release_num（ready_release_num是一个数组，需要循环取出来）
        const readyReleaseNum = ele.ready_release_num;
        if (readyReleaseNum && readyReleaseNum.length > 0) {
          readyReleaseNum.forEach((nums: any) => {
            ready_release_num.push(nums.ready_release_num);
          });
        }
      });

      // 需要在这个页面生成发布编号。只有成功了才跳转到详情界面
      const readyReleaseNum = ready_release_num.join('|');
      const onlineNum = await getOnlineProocessDetails(readyReleaseNum, type);
      if (onlineNum) {
        history.push(
          `/onDutyAndRelease/officialRelease?releaseType=${type}&releaseNum=${readyReleaseNum}&onlineReleaseNum=${onlineNum}`,
        );
      }
    }
  };

  // 刷新1级灰度发布列表
  const refreshFirstReleaseGrid = async () => {
    const girdDatas = await getFirstGrayscaleListData();
    if (girdDatas.message !== '') {
      errorMessage(girdDatas.message.toString());
    } else {
      firstGrayscaleGridApi.current?.setRowData(girdDatas?.data);
      setGridHeight({
        ...gridHeight,
        firstGrid: (girdDatas?.data).length * 30 + 80,
      });
    }
  };
  // 根据时间查询
  // const onFirstGrayReleaseTimeChanged = async (params: any, times: any) => {
  //   if (times[0]) {
  //     firstStart = dayjs(times[0]).format("YYYY-MM-DD");
  //   } else {
  //     firstStart = "";
  //   }
  //   if (times[1]) {
  //     firstEnd = dayjs(times[1]).format("YYYY-MM-DD");
  //   } else {
  //     firstEnd = ""
  //   }
  //   await refreshFirstReleaseGrid();
  // };

  /* endregion */

  /* region 操作按钮 */
  // 删除发布详情
  const confirmDelete = async (releaseType: string, params: any) => {
    const delResult = await delGrayReleaseHistory(releaseType, params);
    if (delResult.code === 200) {
      sucMessage('删除成功！');
      // 刷新数据
      if (releaseType === 'zero') {
        await refreshZeroReleaseGrid();
      } else if (releaseType === 'one') {
        await refreshFirstReleaseGrid();
      }
    }
  };

  // 跳转到发布过程详情页面
  const gotoGrayReleasePage = (releData: any) => {
    const releasedNum = releData.data?.ready_release_num;
    history.push(`/onDutyAndRelease/preRelease?releasedNum=${releasedNum}&history=true`);
  };

  // 一级灰度跳转到正式发布界面
  const gotoFirstReleasePage = (releData: any, type: string) => {
    const onlineReleasedNum = releData.data?.release_gray_num;
    history.push(
      `/onDutyAndRelease/officialRelease?releaseType=${type}&onlineReleaseNum=${onlineReleasedNum}&history=true`,
    );
  };

  // 操作按钮
  const grayListOperate = (releaseType: string, params: any, showDelete = true) => {
    // 跳转到灰度发布详情
    const grayButton = (
      <Button className={'operateButton'} onClick={() => gotoGrayReleasePage(params)}>
        <img
          src={'../gray_detail_normal.png'}
          width="20"
          height="20"
          alt="0级灰度发布过程详情"
          title="0级灰度发布过程详情"
        />
      </Button>
    );

    // 跳转到灰度发布详情
    const firstGrayButton = (
      <Button
        className={'operateButton'}
        onClick={() => formalToReleasePage(params, '0级灰度发布详情')}
      >
        <img
          src={'../gray_detail_normal.png'}
          width="20"
          height="20"
          alt="0级灰度发布过程详情"
          title="0级灰度发布过程详情"
        />
      </Button>
    );

    // 删除功能
    const deleteButton = showDelete ? (
      <Popconfirm
        placement="topRight"
        title={'已停留在灰度积压列表中，请谨慎核对,是否确认需要删除?'}
        onConfirm={() => {
          confirmDelete(releaseType, params?.data);
        }}
        okText="是"
        cancelText="否"
      >
        <Button className={'operateButton'} style={{ marginLeft: -20 }}>
          <img src="../delete.png" width="20" height="20" alt="删除发布详情" title="删除发布详情" />
        </Button>
      </Popconfirm>
    ) : (
      <div />
    );

    // 跳转到正式发布列表
    let firstSrcPath = '../details_0.png';
    let firstButtonDisable = false;

    // 需要对比release_gray_num和ready_release_num
    const readyReleaseNumArray = params.data?.ready_release_num;
    if (readyReleaseNumArray && readyReleaseNumArray.length === 1) {
      const readyReleaseNum = readyReleaseNumArray[0].ready_release_num;
      if (readyReleaseNum === params.data?.release_gray_num) {
        firstSrcPath = '../details_0_gray.png';
        firstButtonDisable = true;
      }
    }

    const onlineButton = (
      <Button
        style={{
          border: 'none',
          backgroundColor: 'transparent',
          fontSize: 'small',
          color: '#46A0FC',
          marginLeft: -20,
        }}
        disabled={firstButtonDisable}
        onClick={() => gotoFirstReleasePage(params, showDelete ? 'gray' : 'ongoing')}
      >
        <img
          src={firstSrcPath}
          width="20"
          height="20"
          alt="1级灰度发布过程详情"
          title="1级灰度发布过程详情"
        />
      </Button>
    );

    if (releaseType === 'one') {
      return (
        <div>
          {firstGrayButton}
          {onlineButton}
          {deleteButton}
        </div>
      );
    } else {
      return (
        <div>
          {grayButton}
          {deleteButton}
        </div>
      );
    }
  };

  /* endregion 操作按钮 */

  /* endregion 灰度发布界面 */

  //发布中列表 数据
  const peddingPublishData = useRequest(() => getFirstGrayscaleListData('ongoing')).data;
  const [peddingButtonTitle, setPeddingButtonTitle] = useState('一键生成正式发布'); // 待发布详情
  const peddingGridApi = useRef<GridApi>();
  const onPeddingGridReady = (params: GridReadyEvent) => {
    peddingGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  /* region 已正式发布列表 */
  const releasedGridApi = useRef<GridApi>();
  const onReleasedGridReady = (params: GridReadyEvent) => {
    releasedGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  //灰度发布失败列表
  const grayFailRef = useRef<GridApi>();
  const [grayFailForm] = Form.useForm();
  const [grayFailList, setGrayFailList] = useState<any[]>([]);
  const onGrayFailReady = (params: GridReadyEvent) => {
    grayFailRef.current = params.api;
    params.api.sizeColumnsToFit();
  };

  // 项目名称
  const projectsArray = useRequest(() => loadPrjNameSelect()).data;

  // 正式发布列表数据
  const formalReleasedData = useRequest(() => getFormalListData(formalQueryCondition)).data;

  // 根据查询条件获取数据
  const getReleasedList = async () => {
    const cond: any = {
      page: 1,
      pageSize: 100,
    };

    if (formalQueryCondition.start && formalQueryCondition.end) {
      cond.start = `${formalQueryCondition.start}`;
      cond.end = `${formalQueryCondition.end}`;
    }
    if (formalQueryCondition.project) {
      cond.project = formalQueryCondition.project;
    }
    const result = await getFormalListData(cond);
    releasedGridApi.current?.setRowData(result.data);
    setGridHeight({
      ...gridHeight,
      formalGrid: result.data.length * 30 + 80,
    });
  };

  // 根据项目获取
  const onProjectChanged = (params: any) => {
    let prjStr = '';
    if (params && params.length > 0) {
      params.forEach((ele: any) => {
        const prjNum = ele.split('&');
        prjStr = prjStr === '' ? prjNum[1] : `${prjStr},${prjNum[1]}`;
      });
    }

    formalQueryCondition.project = prjStr;
    getReleasedList();
  };

  // 根据时间获取
  const onReleaseProject = (params: any, times: any) => {
    formalQueryCondition.start = times[0] === '' ? '' : dayjs(times[0]).format('YYYY-MM-DD');
    formalQueryCondition.end = times[1] === '' ? '' : dayjs(times[1]).format('YYYY-MM-DD');
    getReleasedList();
  };

  const [modalInfo, setModalInfo] = useState({
    visible: false,
    title: '',
    content: '',
  });
  // 跳转到预发布界面
  const formalToReleasePage = (releData: any, gotoType: string) => {
    const detailsLinks: any = [];
    if (gotoType === '0级灰度发布详情') {
      // 跳转到发布过程详情
      const releasedNums = releData.data?.ready_release_num;
      if (releasedNums && releasedNums.length > 0) {
        releasedNums.forEach((reInfo: any) => {
          detailsLinks.push(
            <p>
              {reInfo.ready_release_name}:
              <Link
                to={`/onDutyAndRelease/preRelease?releasedNum=${reInfo.ready_release_num}&history=true`}
              >
                {reInfo.ready_release_num}
              </Link>
            </p>,
          );
        });
      }
    } else if (gotoType === '1级灰度发布详情') {
      // 跳转到正式发布详情
      const releasedNums = releData.data?.release_gray_num;
      if (releasedNums && releasedNums.length > 0) {
        releasedNums.forEach((reInfo: any) => {
          detailsLinks.push(
            <p>
              {reInfo.release_gray_name}:
              <Link
                to={`/onDutyAndRelease/officialRelease?releaseType=gray&onlineReleaseNum=${reInfo.release_gray_num}&history=true`}
              >
                {reInfo.release_gray_num}
              </Link>
            </p>,
          );
        });
      }
    }
    setModalInfo({
      visible: true,
      title: gotoType,
      content: detailsLinks,
    });
  };

  // 跳转到正式发布界面
  const gotoOnlineReleasePage = (releData: any) => {
    const onlineReleasedNum = releData.data?.online_release_num;
    history.push(
      `/onDutyAndRelease/officialRelease?releaseType=online&onlineReleaseNum=${onlineReleasedNum}&history=true`,
    );
  };

  // 取消弹出框
  const handleCancel = () => {
    setModalInfo({
      visible: false,
      title: '',
      content: '',
    });
  };
  /* endregion */

  window.addEventListener('resize', () => {
    zeroGrayscaleGridApi.current?.sizeColumnsToFit();
    firstGrayscaleGridApi.current?.sizeColumnsToFit();
    releasedGridApi.current?.sizeColumnsToFit();
    peddingGridApi.current?.sizeColumnsToFit();
  });

  // 显示button title
  const showButtonTitle = async () => {
    const zeroResult = await vertifyOnlineProjectExit('gray');
    if (zeroResult) {
      // 0级灰度发布列表按钮title
      setZeroButtonTitle('待发布详情');
    }
    const firstResult = await vertifyOnlineProjectExit('online');
    if (firstResult) {
      setFirstButtonTitle('待发布详情');
    }
    // 发布中列表
    const pedding = await vertifyOnlineProjectExit('ongoing');
    if (pedding) setPeddingButtonTitle('待发布详情');
  };

  useEffect(() => {
    showButtonTitle();
    if (formalReleasedData?.data) {
      setGridHeight({
        ...gridHeight,
        formalGrid: (formalReleasedData?.data).length * 30 + 80,
      });
    }
  }, [formalReleasedData]);

  useEffect(() => {
    if (firstGrayscaleData?.data) {
      setGridHeight({
        ...gridHeight,
        firstGrid: (firstGrayscaleData?.data).length * 30 + 80,
      });
    }
  }, [firstGrayscaleData]);

  useEffect(() => {
    if (zeroGrayscaleData?.data) {
      setGridHeight({
        ...gridHeight,
        zeroGrid: (zeroGrayscaleData?.data).length * 30 + 80,
      });
    }
  }, [zeroGrayscaleData]);

  useEffect(() => {
    if (peddingPublishData?.data) {
      setGridHeight({
        ...gridHeight,
        peddingGrid: (peddingPublishData?.data).length * 30 + 80,
      });
    }
  }, [peddingPublishData]);

  useEffect(() => {
    if (peddingPublishData?.data) {
      setGridHeight({
        ...gridHeight,
        grayFailGrid: grayFailList.length * 30 + 80,
      });
    }
  }, [JSON.stringify(grayFailList)]);

  const requestGrayFailList = async () => {
    const values = grayFailForm.getFieldsValue();
    if (!isEmpty(values.time)) {
      values.start = moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss');
      values.end = moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss');
    }
    const data = await PreReleaseServices.getGrayFailList({
      project_ids: values.project_ids?.map((it: string) => it.split('&')[1])?.join(',') ?? '',
      start_time: values.start ?? '',
      end_time: values.end ?? '',
    });
    setGrayFailList(data);
  };

  useEffect(() => {
    grayFailForm.setFieldsValue({
      time: [moment().subtract(7, 'day'), moment().add(7, 'day')],
    });
    requestGrayFailList();
  }, []);

  return (
    <PageContainer>
      {/* 0级灰度积压列表 */}
      <div style={{ marginTop: -20 }}>
        <div style={gridHeadDivStyle}>
          &nbsp;
          <label style={{ fontWeight: 'bold', float: 'left' }}>0级灰度积压列表</label>
          <Button type="text" onClick={generateFormalZeroRelease} style={{ float: 'right' }}>
            <img
              src="../pushMessage.png"
              width="25"
              height="25"
              alt="一键生成1级灰度发布"
              title="一键生成1级灰度发布"
            />
            &nbsp;{zeroButtonTitle}
          </Button>
          {/*<div style={{float: "right"}}>*/}
          {/*  <label style={{marginLeft: 10}}>发布时间: </label>*/}
          {/*  <RangePicker style={{marginLeft: 5}} size={"small"} defaultValue={[moment(zeroStart), moment(zeroEnd)]}*/}
          {/*               onChange={onZeroGrayReleaseTimeChanged}/>*/}
          {/*</div>*/}
        </div>
        <div
          className="ag-theme-alpine init-agGrid"
          style={{ marginTop: -21, height: gridHeight.zeroGrid, width: '100%' }}
        >
          <AgGridReact
            columnDefs={grayscaleBacklogList('zero', zeroButtonTitle == '待发布详情')} // 定义列
            rowData={zeroGrayscaleData?.data} // 数据绑定
            defaultColDef={girdDefaultSetting}
            rowHeight={30}
            headerHeight={35}
            rowSelection={'multiple'} // 设置多行选中
            suppressRowTransform={true}
            onGridReady={onZeroGrayscaleGridReady}
            onGridSizeChanged={onZeroGrayscaleGridReady}
            frameworkComponents={{
              grayReleaseDetails: (params: any) => {
                return grayListOperate('zero', params);
              },
            }}
          />
        </div>
      </div>

      {/* 1级灰度积压列表 */}
      <div style={{ marginTop: 20 }}>
        <div style={gridHeadDivStyle}>
          &nbsp;
          <label style={{ fontWeight: 'bold', float: 'left' }}>1级灰度积压列表</label>
          <Button
            type="text"
            onClick={() => generateFormalFirstRelease()}
            style={{ float: 'right' }}
          >
            <img
              src="../pushMessage.png"
              width="25"
              height="25"
              alt="一键生成正式发布"
              title="一键生成正式发布"
            />
            &nbsp;{firstButtonTitle}
          </Button>
          {/*<div style={{float: "right"}}>*/}
          {/*  <label style={{marginLeft: 10}}>发布时间: </label>*/}
          {/*  <RangePicker style={{marginLeft: 5}} size={"small"} defaultValue={[moment(firstStart), moment(firstEnd)]}*/}
          {/*               onChange={onFirstGrayReleaseTimeChanged}/>*/}
          {/*</div>*/}
        </div>
        <div
          className="ag-theme-alpine init-agGrid"
          style={{ marginTop: -21, height: gridHeight.firstGrid, width: '100%' }}
        >
          <AgGridReact
            columnDefs={grayscaleBacklogList('one', firstButtonTitle == '待发布详情')} // 定义列
            rowData={firstGrayscaleData?.data} // 数据绑定
            defaultColDef={girdDefaultSetting}
            rowHeight={30}
            headerHeight={35}
            rowSelection={'multiple'} // 设置多行选中
            suppressRowTransform={true}
            onGridReady={onFirstGrayscaleGridReady}
            onGridSizeChanged={onFirstGrayscaleGridReady}
            frameworkComponents={{
              grayReleaseDetails: (params: any) => {
                return grayListOperate('one', params);
              },
            }}
          />
        </div>
      </div>
      {/*发布中*/}
      <div style={{ marginTop: 20 }}>
        <div style={gridHeadDivStyle}>
          <label style={{ fontWeight: 'bold', float: 'left' }}>线上2-8集群进行中列表</label>
          <Button
            type="text"
            onClick={() => generateFormalFirstRelease('ongoing')}
            style={{ float: 'right' }}
          >
            <img
              src="../pushMessage.png"
              width="25"
              height="25"
              alt="一键生成正式发布"
              title="一键生成正式发布"
            />
            &nbsp;{peddingButtonTitle}
          </Button>
        </div>
        <div
          className="ag-theme-alpine init-agGrid"
          style={{ height: gridHeight.peddingGrid, width: '100%' }}
        >
          <AgGridReact
            columnDefs={grayscaleBacklogList('one', peddingButtonTitle == '待发布详情')} // 定义列
            rowData={peddingPublishData?.data} // 数据绑定
            defaultColDef={girdDefaultSetting}
            rowHeight={30}
            headerHeight={35}
            rowSelection={'multiple'} // 设置多行选中
            suppressRowTransform={true}
            onGridReady={onPeddingGridReady}
            onColumnEverythingChanged={onPeddingGridReady}
            frameworkComponents={{
              grayReleaseDetails: (params: any) => {
                return grayListOperate('one', params, false);
              },
            }}
          />
        </div>
      </div>

      {/*  已正式发布列表 */}
      <div style={{ marginTop: 20 }}>
        <div style={gridHeadDivStyle}>
          <label style={{ fontWeight: 'bold', float: 'left' }}>已正式发布列表</label>
          <div style={{ textAlign: 'right' }}>
            <label> 项目名称:</label>
            <Select
              size={'small'}
              showSearch
              mode="multiple"
              onChange={onProjectChanged}
              style={{ minWidth: 300, marginLeft: 5 }}
              options={projectsArray}
            >
              {/*{projectsArray}*/}
            </Select>
            <label style={{ marginLeft: 10 }}>发布时间: </label>
            <RangePicker
              style={{ marginLeft: 5 }}
              size={'small'}
              defaultValue={[moment(formalQueryCondition.start), moment(formalQueryCondition.end)]}
              onChange={onReleaseProject}
            />
          </div>
        </div>
        <div
          className="ag-theme-alpine init-agGrid"
          style={{ marginTop: -21, height: gridHeight.formalGrid, width: '100%' }}
        >
          <AgGridReact
            columnDefs={releasedList()} // 定义列
            rowData={formalReleasedData?.data} // 数据绑定
            defaultColDef={girdDefaultSetting}
            rowHeight={30}
            headerHeight={35}
            suppressRowTransform={true}
            onGridReady={onReleasedGridReady}
            frameworkComponents={{
              officialReleaseDetails: (params: any) => {
                // 如果ready_release_num 数组中只有一个值，需要和online_release_num进行对比，如果值相同，则只显示发布过程详情。1级灰度和正式发布详情不能进行跳转。
                let firstSrcPath = '../details_0.png'; // 1级灰度跳转图标
                let firstButtonDisable = false;
                let onlineSrcPath = '../formal_detail.png'; // 正式发布详情图标
                let buttonDisable = false;
                const { ready_release_num, release_gray_num, online_release_num } = params.data;
                if (ready_release_num && ready_release_num.length === 1) {
                  if (ready_release_num[0].ready_release_num === online_release_num) {
                    firstButtonDisable = true;
                    firstSrcPath = '../details_0_gray.png';
                    buttonDisable = true;
                    onlineSrcPath = '../formal_detail_gray.png';
                  }
                } else {
                  // 1级发布
                  if (!release_gray_num || release_gray_num.length === 0) {
                    firstSrcPath = '../details_0_gray.png';
                    firstButtonDisable = true;
                  }
                  // 正式发布
                  if (!online_release_num) {
                    onlineSrcPath = '../formal_detail_gray.png';
                    buttonDisable = true;
                  }
                }
                return (
                  <div>
                    <Button
                      className={'operateButton'} // ready_release_num
                      onClick={() => formalToReleasePage(params, '0级灰度发布详情')}
                    >
                      <img
                        src={'../gray_detail_normal.png'}
                        width="20"
                        height="20"
                        alt="0级灰度发布详情"
                        title="0级灰度发布详情"
                      />
                    </Button>
                    <Button
                      disabled={firstButtonDisable} // release_gray_num
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        fontSize: 'small',
                        color: '#46A0FC',
                        marginLeft: -20,
                      }}
                      onClick={() => formalToReleasePage(params, '1级灰度发布详情')}
                    >
                      <img
                        src={firstSrcPath}
                        width="20"
                        height="20"
                        alt="1级灰度发布详情"
                        title="1级灰度发布详情"
                      />
                    </Button>
                    <Button
                      disabled={buttonDisable} // online_release_num
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        fontSize: 'small',
                        color: '#46A0FC',
                        marginLeft: -20,
                      }}
                      onClick={() => gotoOnlineReleasePage(params)}
                    >
                      <img
                        src={onlineSrcPath}
                        width="20"
                        height="20"
                        alt="正式发布详情"
                        title="正式发布详情"
                      />
                    </Button>
                  </div>
                );
              },
            }}
          ></AgGridReact>
        </div>
      </div>
      {/*灰度发布失败列表*/}
      <div style={{ marginTop: 40 }}>
        <div
          style={{
            ...gridHeadDivStyle,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <label style={{ fontWeight: 'bold' }}>灰度发布失败列表</label>
          <Form
            form={grayFailForm}
            layout={'inline'}
            size={'small'}
            onFieldsChange={(v) => requestGrayFailList()}
          >
            <Form.Item label={'发布项目'} name={'project_ids'}>
              <Select
                showSearch
                mode="multiple"
                options={projectsArray}
                style={{ minWidth: 300 }}
              />
            </Form.Item>
            <Form.Item label={'发布时间'} name={'time'} style={{ marginRight: 0 }}>
              <RangePicker format={'YYYY-MM-DD'} />
            </Form.Item>
          </Form>
        </div>
        <div
          className="ag-theme-alpine init-agGrid"
          style={{ height: gridHeight.grayFailGrid, width: '100%' }}
        >
          <AgGridReact
            columnDefs={releasedList('gray')} // 定义列
            rowData={grayFailList} // 数据绑定
            defaultColDef={girdDefaultSetting}
            rowHeight={30}
            headerHeight={35}
            suppressRowTransform={true}
            onGridReady={onGrayFailReady}
            onRowDataChanged={onGrayFailReady}
            frameworkComponents={{
              officialReleaseDetails: (params: any) => {
                const type = params.data.release_type;
                return (
                  <div>
                    <Button
                      className={'operateButton'}
                      onClick={() => {
                        if (type == 'zero') {
                          history.push(
                            `/onDutyAndRelease/preRelease?releasedNum=${params.data.release_gray_num}&history=true`,
                          );
                        } else if (type == 'one') {
                          history.push(
                            `/onDutyAndRelease/officialRelease?releaseType=gray&onlineReleaseNum=${params.data.release_gray_num}&history=true`,
                          );
                        }
                      }}
                    >
                      <img
                        src={'../gray_detail_normal.png'}
                        width="20"
                        height="20"
                        alt={`${type == 'zero' ? 0 : 1}级灰度发布详情`}
                        title={`${type == 'zero' ? 0 : 1}级灰度发布详情`}
                      />
                    </Button>
                  </div>
                );
              },
            }}
          />
        </div>
      </div>

      {/*详情跳转选择 */}
      <div>
        <Modal
          title={modalInfo.title}
          visible={modalInfo.visible}
          onCancel={handleCancel}
          footer={null}
          centered={true}
        >
          {modalInfo.content}
        </Modal>
      </div>
    </PageContainer>
  );
};

export default ReleaseHistory;

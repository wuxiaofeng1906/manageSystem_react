import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import type {GridApi, GridReadyEvent} from 'ag-grid-community';
import type {GqlClient} from '@/hooks';
import {useGqlClient} from '@/hooks';
import {Button, Checkbox, Col, DatePicker, Form, message, Modal, Row} from 'antd';
import {LogoutOutlined, SettingOutlined} from '@ant-design/icons';
import {getHeight} from '@/publicMethods/pageSet';
import moment from "moment";
import {useRequest} from "ahooks";
import dayjs from 'dayjs';

const {RangePicker} = DatePicker;

// 格式化单元格内容
const cellFormat = (params: any) => {

  if (Number(params.value)) {
    const numbers = params.value.toString();
    if (numbers.indexOf(".") > -1) { // 判断有无小数点
      return Number(params.value).toFixed(2);
    }
    return Number(params.value);
  }
  return 0;
};

// 定义列名
const getSourceColums = () => {

  // 获取缓存的字段
  const fields = localStorage.getItem("data_front_dashboard");

  // 定义的原始字段
  const oraFields: any = [
    {
      headerName: "",
      children: [
        {
          headerName: 'NO.',
          minWidth: 60,
          maxWidth: 80,
          filter: false,
          pinned: 'left',
          suppressMenu: true,
          cellRenderer: (params: any) => {
            return Number(params.node.id) + 1;
          },
        },
        {
          headerName: '姓名',
          field: 'userName',
          pinned: 'left',
          minWidth: 80,
          suppressMenu: false,
        },]
    },
    // {
    //   headerName: '周期时间',
    //   children: [
    //     {
    //       headerName: 'Bug解决时长(H)',
    //       field: 'maxLines',
    //       minWidth: 133,
    //       valueFormatter: cellFormat
    //     },
    //     {
    //       headerName: 'Bug数量',
    //       field: 'avgLines',
    //       minWidth: 88,
    //     }
    //   ]
    // },
    // {
    //   headerName: '',
    //   children: [{
    //     headerName: '任务燃尽图',
    //     field: 'minLines',
    //     minWidth: 120,
    //   }]
    // },
    // {
    //   headerName: '速度',
    //   children: [
    //     {
    //       headerName: '初始需求数',
    //       field: 'deptName',
    //       minWidth: 105,
    //     },
    //     {
    //       headerName: '初始需求完成数',
    //       field: 'groupName',
    //       minWidth: 130,
    //     },
    //     {
    //       headerName: '追加需求数',
    //       field: 'tech',
    //       minWidth: 105,
    //     },
    //     {
    //       headerName: '追加需求完成数',
    //       field: 'area',
    //       minWidth: 130,
    //     }
    //   ]
    // },
    // {
    //   headerName: '对外请求',
    //   children: [{
    //     headerName: '请求数',
    //     field: 'position',
    //     minWidth: 85,
    //   },
    //     {
    //       headerName: '请求平均停留时长',
    //       field: 'job',
    //       minWidth: 140,
    //     }]
    // },
    {
      headerName: '吞吐量',
      children: [
        {
          headerName: '交付需求数',
          field: 'finiStory',
          minWidth: 105,
          valueFormatter: cellFormat
        },
        {
          headerName: '完成任务数',
          field: 'finiTask',
          minWidth: 105,
          valueFormatter: cellFormat
        },
        {
          headerName: '修复Bug数',
          field: 'resolvedBug',
          minWidth: 105,
          valueFormatter: cellFormat
        },
        {
          headerName: '进行中任务数',
          field: 'doingTask',
          minWidth: 115,
          valueFormatter: cellFormat
        },
        {
          headerName: '代码提交次数',
          field: 'codeCommit',
          minWidth: 115,
          valueFormatter: cellFormat
        },
        {
          headerName: '代码新增行数',
          field: 'newLine',
          minWidth: 115,
          valueFormatter: cellFormat
        }
      ]
    }

  ];

  if (fields === null) {
    return oraFields;
  }

  const selected = JSON.parse(fields);

  const component: any = [];
  oraFields.forEach((parent: any) => {
    const p_details = parent.children;
    const childs: any = [];
    p_details.forEach((c_details: any) => {
      const newElement = c_details;
      if (selected.includes(c_details.headerName)) {
        newElement.hide = false;
      } else {
        newElement.hide = true;
      }
      childs.push(newElement);
    });

    component.push({
      headerName: parent.headerName,
      children: childs,
    })

  });

  return component;
};

// 公共查询方法
const queryFrontData = async (client: GqlClient<object>, params: any) => {

  const {data} = await client.query(`{
          dashFront(start:"${params.start}",end:"${params.end}"){
            userName
            finiStory
            finiTask
            resolvedBug
            doingTask
            codeCommit
            newLine
          }

      }
  `);


  return data?.dashFront;
};

const FrontTableList: React.FC<any> = () => {
  const g_currentMonth_range = {
    start: dayjs().startOf('month').format("YYYY-MM-DD"),
    end: dayjs().endOf('month').format("YYYY-MM-DD")
  };

  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() => queryFrontData(gqlClient, g_currentMonth_range),);
  const gridApiForFront = useRef<GridApi>();
  const onSourceGridReady = (params: GridReadyEvent) => {
    gridApiForFront.current = params.api;
    params.api.sizeColumnsToFit();
  };

  if (gridApiForFront.current) {
    if (loading) gridApiForFront.current.showLoadingOverlay();
    else gridApiForFront.current.hideOverlay();
  }

  // 表格的屏幕大小自适应
  const [sourceGridHeight, setGridHeight] = useState(Number(getHeight()));
  window.onresize = function () {
    setGridHeight(Number(getHeight()) - 64);
    gridApiForFront.current?.sizeColumnsToFit();
  };

  const [choicedConditionForSource, setQueryConditionForSource] = useState({
    start: g_currentMonth_range.start,
    end: g_currentMonth_range.end
  });

  //  默认显示本月数据（1号-31号）
  const showSourceDefaultData = async () => {
    setQueryConditionForSource({
      start: g_currentMonth_range.start,
      end: g_currentMonth_range.end
    });
    const datas: any = await queryFrontData(gqlClient, g_currentMonth_range);
    gridApiForFront.current?.setRowData(datas);
  };

  // 时间选择事件： 查询范围：选中的时间中开始时间的周一，和结束时间的周末
  const onSourceTimeSelected = async (params: any, dateString: any) => {

    setQueryConditionForSource({
      start: dateString[0],
      end: dateString[1]
    });

    const range = {
      start: dateString[0],
      end: dateString[1]
    };

    const datas: any = await queryFrontData(gqlClient, range);
    gridApiForFront.current?.setRowData(datas);

  };

  /* region 显示自定义字段 */
  const [isFieldModalVisible, setFieldModalVisible] = useState(false);
  const [selectedFiled, setSelectedFiled] = useState(['']);
  const nessField = ['NO.', '姓名'];
  const unNessField = ['Bug解决时长(H)', 'Bug数量', '任务燃尽图', '初始需求数', '初始需求完成数', '追加需求数', '追加需求完成数',
    '请求数', '请求平均停留时长', '交付需求数', '完成任务数', '修复Bug数', '进行中任务数', '代码提交次数', '代码新增行数'];

// 弹出字段显示层
  const showFieldsModal = () => {
    const fields = localStorage.getItem("data_front_dashboard");
    if (fields === null) {
      setSelectedFiled(nessField.concat(unNessField));
    } else {
      setSelectedFiled(JSON.parse(fields));
    }
    setFieldModalVisible(true);
  };

// 全选
  const selectAllField = (e: any) => {
    if (e.target.checked === true) {
      setSelectedFiled(nessField.concat(unNessField));
    } else {
      setSelectedFiled(nessField);
    }
  };

// 保存按钮
  const commitField = () => {
    localStorage.setItem("data_front_dashboard", JSON.stringify(selectedFiled));
    setFieldModalVisible(false);
    // 首先需要清空原有列，否则会导致列混乱
    gridApiForFront.current?.setColumnDefs([]);

    message.info({
      content: "保存成功！",
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });

  };
// 取消
  const fieldCancel = () => {
    setFieldModalVisible(false);
  };

// 缓存到state
  const onSetFieldsChange = (checkedValues: any) => {
    setSelectedFiled(checkedValues);
  };
  /* endregion */


  return (
    <PageContainer>

      <div>
        {/* 查询条件 */}
        <div style={{width: '100%', height: 45, marginTop: 15, backgroundColor: "white"}}>
          <Form.Item>

            <label style={{marginLeft: "10px", marginTop: 7}}>查询周期：</label>
            <RangePicker
              style={{width: '30%', marginTop: 7}} onChange={onSourceTimeSelected}
              value={[choicedConditionForSource.start === "" ? null : moment(choicedConditionForSource.start),
                choicedConditionForSource.end === "" ? null : moment(choicedConditionForSource.end)]}
            />

            <Button type="text" style={{marginLeft: "20px", color: 'black'}}
                    icon={<LogoutOutlined/>} size={'small'} onClick={showSourceDefaultData}>
              默认：</Button>
            <label style={{marginLeft: "-10px", color: 'black'}}> 默认1个月</label>

            <Button type="text" icon={<SettingOutlined/>} size={'large'} onClick={showFieldsModal}
                    style={{float: "right", marginTop: 5}}> </Button>


          </Form.Item>

        </div>

        {/* 数据表格 */}
        <div className="ag-theme-alpine" style={{height: sourceGridHeight, width: '100%', marginTop: 10}}>
          <AgGridReact
            columnDefs={getSourceColums()} // 定义列
            rowData={data} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              flex: 1,
              cellStyle: {"line-height": "28px"},
              suppressMenu: true,
            }}
            autoGroupColumnDef={{
              minWidth: 250,
              // sort: 'asc'
            }}
            rowSelection={'multiple'} // 设置多行选中
            groupDefaultExpanded={9} // 展开分组
            suppressAggFuncInHeader={true} // 不显示标题聚合函数的标识
            rowHeight={30}
            headerHeight={35}

            onGridReady={onSourceGridReady}
            onGridSizeChanged={onSourceGridReady}
            suppressScrollOnNewData={false}
          >

          </AgGridReact>
        </div>

        {/* 自定义字段 */}
        <Modal
          title={'自定义字段'}
          visible={isFieldModalVisible}
          onCancel={fieldCancel}
          centered={true}
          footer={null}
          width={920}
        >
          <Form>
            <div>
              <Checkbox.Group style={{width: '100%'}} value={selectedFiled} onChange={onSetFieldsChange}>
                <Row>
                  <Col span={4}>
                    <Checkbox defaultChecked disabled value="NO.">NO.</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox defaultChecked disabled value="姓名">姓名</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="Bug解决时长(H)">Bug解决时长</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="Bug数量">Bug数量</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="任务燃尽图">任务燃尽图</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="初始需求数">初始需求数</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="初始需求完成数">初始需求完成数</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="追加需求数">追加需求数</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="追加需求完成数">追加需求完成数</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="请求数">请求数</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="请求平均停留时长">请求平均停留时长</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="交付需求数">交付需求数</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="完成任务数">完成任务数</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="修复Bug数">修复Bug数</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="进行中任务数">进行中任务数</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="代码提交次数">代码提交次数</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="代码新增行数">代码新增行数</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>,
            </div>

            <div>
              <Checkbox onChange={selectAllField}>全选</Checkbox>

              <Button type="primary" style={{marginLeft: '300px'}} onClick={commitField}>
                确定</Button>
              <Button type="primary" style={{marginLeft: '20px'}} onClick={fieldCancel}>
                取消</Button>
            </div>

          </Form>
        </Modal>
      </div>

    </PageContainer>
  );
};

export default FrontTableList;

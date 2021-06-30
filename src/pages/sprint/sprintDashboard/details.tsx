import React, {useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';
import {PageHeader, Button, message, Form, Modal, Row, Col, Checkbox} from 'antd';
import {SettingOutlined} from "@ant-design/icons";
import {history} from 'umi';
import {
  numberRenderToYesNo,
  numberRenderTopass,
  numberRenderToCurrentStageForColor,
  numberRenderToZentaoTypeForLine,
  numberRenderToSource,
  linkToZentaoPage,
  numberRenderToZentaoStatusForRed,
  stageForLineThrough,
  numRenderForSevAndpriForLine,
  proposedTestRender
} from '@/publicMethods/cellRenderer';

import {getHeight} from '@/publicMethods/pageSet';

// 定义列名
const getColums = () => {

  // 获取缓存的字段
  const fields = localStorage.getItem("da_details_filed");
  const oraFields = [
    {
      headerName: '序号',
      maxWidth: 80,
      filter: false,
      pinned: 'left',
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    },
    {
      headerName: '阶段',
      field: 'stage',
      pinned: 'left',
      cellRenderer: numberRenderToCurrentStageForColor,
      minWidth: 120,
    },
    {
      headerName: '测试',
      field: 'tester',
      pinned: 'left',
      minWidth: 80,
      cellRenderer: stageForLineThrough,
      tooltipField: "tester",
      suppressMenu: false
    },
    {
      headerName: '类型',
      field: 'category',
      cellRenderer: numberRenderToZentaoTypeForLine,
      pinned: 'left',
      minWidth: 70,
      suppressMenu: false,

    },
    {
      headerName: '编号',
      field: 'ztNo',
      cellRenderer: linkToZentaoPage,
      pinned: 'left',
      minWidth: 90,
    },
    {
      headerName: '标题内容',
      field: 'title',
      pinned: 'left',
      minWidth: 350,
      cellRenderer: stageForLineThrough,
      tooltipField: "title"

    },
    {
      headerName: '严重等级',
      field: 'severity',
      cellRenderer: numRenderForSevAndpriForLine,
      minWidth: 90,
    },
    // {
    //   headerName: '优先级',
    //   field: 'priority',
    // },
    {
      headerName: '模块',
      field: 'moduleName',
      minWidth: 100,
      cellRenderer: stageForLineThrough,
      tooltipField: "moduleName"
    },
    {
      headerName: '状态',
      field: 'ztStatus',
      cellRenderer: numberRenderToZentaoStatusForRed,
      minWidth: 80,
    },
    {
      headerName: '已提测',
      field: 'proposedTest',
      cellRenderer: proposedTestRender,
    },
    {
      headerName: '发布环境',
      field: 'publishEnv',
      minWidth: 80,
      cellRenderer: stageForLineThrough,
      tooltipField: "publishEnv"

    },
    {
      headerName: '指派给',
      field: 'assignedTo',
      minWidth: 80,
      cellRenderer: stageForLineThrough,
      tooltipField: "assignedTo",
      suppressMenu: false,

    },
    {
      headerName: '解决/完成人',
      field: 'finishedBy',
      minWidth: 80,
      cellRenderer: stageForLineThrough,
      tooltipField: "finishedBy",
      suppressMenu: false,

    },
    {
      headerName: '关闭人',
      field: 'closedBy',
      minWidth: 80,
      cellRenderer: stageForLineThrough,
      tooltipField: "closedBy",
      suppressMenu: false,

    },
    {
      headerName: '备注',
      field: 'memo',
      minWidth: 150,
      cellRenderer: stageForLineThrough,
      tooltipField: "memo"

    },
    {
      headerName: '相关需求',
      field: 'relatedStories',
      minWidth: 80,
      cellRenderer: stageForLineThrough,
    },
    {
      headerName: '相关任务',
      field: 'relatedTasks',
      minWidth: 80,
      cellRenderer: stageForLineThrough,

    },
    {
      headerName: '相关bug',
      field: 'relatedBugs',
      minWidth: 80,
      cellRenderer: stageForLineThrough,

    },
    {
      headerName: '是否可热更',
      field: 'hotUpdate',
      cellRenderer: numberRenderToYesNo,
    },
    {
      headerName: '是否有数据升级',
      field: 'dataUpdate',
      cellRenderer: numberRenderToYesNo,
    },
    {
      headerName: '是否有接口升级',
      field: 'interUpdate',
      cellRenderer: numberRenderToYesNo,
    },
    {
      headerName: '是否有预置数据修改',
      field: 'presetData',
      cellRenderer: numberRenderToYesNo,
    },
    {
      headerName: '是否需要测试验证',
      field: 'testCheck',
      cellRenderer: numberRenderToYesNo,
    },
    {
      headerName: '验证范围建议',
      field: 'scopeLimit',
      cellRenderer: stageForLineThrough,
    },
    {
      headerName: 'UED',
      field: 'uedName',
      cellRenderer: stageForLineThrough,
      suppressMenu: false,
    },
    {
      headerName: 'UED测试环境验证',
      field: 'uedEnvCheck',
      cellRenderer: numberRenderTopass,

    },
    {
      headerName: 'UED线上验证',
      field: 'uedOnlineCheck',
      cellRenderer: numberRenderTopass,
    },
    {
      headerName: '来源',
      field: 'source',
      cellRenderer: numberRenderToSource,
    },
    {
      headerName: '反馈人',
      field: 'feedback',
      cellRenderer: stageForLineThrough,
      suppressMenu: false,
    }
  ];

  if (fields === null) {
    return oraFields;
  }
  const myFields = JSON.parse(fields);
  const component = new Array();

  oraFields.forEach((ele: any) => {
    const newElement = ele;
    if (myFields.includes(ele.headerName)) {
      newElement.hide = false;
    } else {
      newElement.hide = true;
    }
    component.push(newElement);
  });

  return component;
};

const addNewAttributes = (source: any, category: string) => {

  const result = [];
  let type = "";
  if (category === "bug") {
    type = "1";
  } else if (category === "task") {
    type = "2";
  } else {
    type = "3";
  }
  const {data} = source[0];
  if (data !== null) {
    for (let index = 0; index < data.length; index += 1) {
      const details = data[index];
      details["category"] = type;
      result.push(details);
    }
  }

  return result;
};
// 查询数据
const queryDevelopViews = async (client: GqlClient<object>, params: any) => {
  const {data} = await client.query(`
      {
       dashSingleItem(project:${params.prjId},kindName:"${params.prjKind}",itemName:"${params.itemName}") {
        name
        data{
           id
          stage
          tester
          ztNo
          title
          severity
          priority
          moduleName
          ztStatus
          relatedStories
          relatedTasks
          relatedBugs
          assignedTo
          resolvedBy
          closedBy
          activeDuration
          solveDuration
          verifyDuration
          closedDuration
        }
      }
      }
  `);

  return addNewAttributes(data?.dashSingleItem, params.itemKind);
  // const datas = data?.dashSingleItem;
  // return datas[0].data;
};

// 组件初始化
const DetailsList: React.FC<any> = () => {

    /* 获取网页的项目id */
    const projectInfo = {
      prjId: -1,
      prjNames: "",
      prjKind: "",
      itemName: "",
      itemKind: ""
    };

    const location = history.location.query;
    if (location !== undefined && location.projectid !== null) {
      projectInfo.prjId = Number(location.projectid);
      projectInfo.prjNames = location.project === null ? '' : location.project.toString();
      projectInfo.prjKind = location.kind === null ? '' : location.kind.toString();
      const item = location.item === null ? '' : location.item.toString().split("|");
      projectInfo.itemKind = item[0].toString();
      projectInfo.itemName = item[1].toString();
    }

    const gridApi = useRef<GridApi>(); // 绑定ag-grid 组件
    const gqlClient = useGqlClient();
    const {data, loading} = useRequest(() => queryDevelopViews(gqlClient, projectInfo));

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.current = params.api;
      params.api.sizeColumnsToFit();
    };

    if (gridApi.current) {
      if (loading) gridApi.current.showLoadingOverlay();
      else gridApi.current.hideOverlay();
    }


    /* region 设置字段 */

    const [isFieldModalVisible, setFieldModalVisible] = useState(false);
    const [selectedFiled, setSelectedFiled] = useState(['']);
    const nessField = ['序号', '类型', '编号'];
    const unNessField = ['阶段', '测试', '标题内容', '严重等级', '模块', '状态', '已提测', '发布环境',
      '指派给', '解决/完成人', '关闭人', '备注', '相关需求', '相关任务', '相关bug', '是否可热更', '是否有数据升级',
      '是否有接口升级', '是否有预置数据', '是否需要测试验证', '验证范围建议', 'UED', 'UED测试环境验证', 'UED线上验证', '来源', '反馈人'];


    const onSetFieldsChange = (checkedValues: any) => {
      setSelectedFiled(checkedValues);
    };

    // 界面显示
    const showFieldsModal = () => {
      const fields = localStorage.getItem("da_details_filed");
      if (fields === null) {
        setSelectedFiled(nessField.concat(unNessField));
      } else {
        setSelectedFiled(JSON.parse(fields));
      }
      setFieldModalVisible(true);
    };

    const selectAllField = (e: any) => {
      if (e.target.checked === true) {
        setSelectedFiled(nessField.concat(unNessField));
      } else {
        setSelectedFiled(nessField);
      }

    };

    // 保存按钮
    const commitField = () => {
      localStorage.setItem("da_details_filed", JSON.stringify(selectedFiled));
      setFieldModalVisible(false);
      // 首先需要清空原有列，否则会导致列混乱
      gridApi.current?.setColumnDefs([]);

      message.info({
        content: "保存成功！",
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

    };
    // 取消 按钮
    const fieldCancel = () => {
      setFieldModalVisible(false);
    };


    /* endregion */

    const routes = [
      {
        path: '',
        breadcrumbName: 'sprint 工作台',
      }, {
        path: '',
        breadcrumbName: '内容详情',
      }];


    return (
      <div style={{marginTop: "-20px"}}>

        <PageHeader
          ghost={false}
          title={projectInfo.prjNames}
          style={{height: "100px"}}
          breadcrumb={{routes}}
        />
        <div style={{background: 'white', marginTop: "20px", width: "100%"}}>

          <Button type="text"
                  style={{color: 'black', float: 'right'}}
                  icon={<SettingOutlined/>} size={'large'}
                  onClick={showFieldsModal}> </Button>
          <Button></Button>


        </div>

        {/* ag-grid 表格定义 */}
        <div className="ag-theme-alpine" style={{height: getHeight(), width: '100%', marginTop: "9px"}}>
          <AgGridReact
            columnDefs={getColums()} // 定义列
            rowData={data} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              flex: 1,
              minWidth: 100,
              suppressMenu: true,
              cellStyle: {"line-height": "30px"},
            }}

            autoGroupColumnDef={{
              minWidth: 100,
            }}
            rowHeight={32}
            headerHeight={35}
            groupDefaultExpanded={9} // 展开分组
            onGridReady={onGridReady}

          />

        </div>

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
                    <Checkbox defaultChecked disabled value="序号">序号</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox defaultChecked disabled value="类型">类型</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox defaultChecked disabled value="编号">编号</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="阶段">阶段</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="测试">测试</Checkbox>
                  </Col>

                  <Col span={4}>
                    <Checkbox value="标题内容">标题内容</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="严重等级">严重等级</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="模块">模块</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="状态">状态</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="发布环境">发布环境</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="已提测">已提测</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="指派给">指派给</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="解决/完成人">解决/完成人</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="关闭人">关闭人</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="备注">备注</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="相关需求">相关需求</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="相关任务">相关任务</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="相关bug">相关bug</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="是否可热更">是否可热更</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="是否有数据升级">是否有数据升级</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="是否有接口升级">是否有接口升级</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="是否有预置数据">是否有预置数据</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="是否需要测试验证">是否需要测试验证</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="验证范围建议">验证范围建议</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="UED">UED</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="UED测试环境验证">UED测试环境验证</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="UED线上验证">UED线上验证</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="来源">来源</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="反馈人">反馈人</Checkbox>
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
    );
  }
;
export default DetailsList;

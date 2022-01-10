/*
 * @Description: 查询、筛选组件
 * @Author: jieTan
 * @Date: 2021-11-22 10:50:27
 * @LastEditTime: 2022-01-10 08:09:45
 * @LastEditors: jieTan
 * @LastModify:
 */
import {
  Form,
  DatePicker,
  Divider,
  TreeSelect,
  Row,
  Col,
  Tooltip,
  Dropdown,
  Menu,
  Radio,
} from 'antd';
import { selectFilter, mySelector, treeSelectActive } from './index.css';
import { useMount } from 'ahooks';
import { useGqlClient } from '@/hooks';
import { GQL_PARAMS, GRAPHQL_QUERY } from '@/namespaces';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { projectKpiGql, organizationGql, queryGQL } from '@/pages/gqls';
import { ColumnHeightOutlined, ReloadOutlined } from '@ant-design/icons';
import { deptTreeNodes, onTreeMultiChange, projOptsElems } from './extra';

const { RangePicker } = DatePicker;

/*  */
let dateStr: [string, string] | undefined; // 存放时间range信息
let doChange = false;
const defaultSeclectItems = { deptIds: [], projIds: [], dates: null, doQuery: false };
/* ************************************************************************************************************** */
export default () => {
  /* 数据区 */
  const gqlClient = useGqlClient(); // 必须提前初始化该对象
  const [treeActive1, setTreeActive1] = useState(''); // 部门<Select>选中时的样式
  const [treeActive2, setTreeActive2] = useState(''); // 部门<Select>选中时的样式
  const [projElems, setProjElems] = useState(null); // 保存项目信息
  const [treeData, setTreeData] = useState([]); // 部门树形结构的数据
  const { gqlData, setGqlData, setLoading, gridApi, gridHeight, pkGqlParmas, setPkGqlParmas } =
    useModel('projectMetric'); // 获取“过程质量”查询的结果数据
  const [selectItems, setSelectItems] = useState(defaultSeclectItems); // 存放多个筛选的值
  const [ratioVal, setRatioVal] = useState(gridHeight.row);
  //
  const defaultParams: any = {
    showArrow: true,
    allowClear: 'allowClear',
    placeholder: '默认选择全部',
    multiple: 'multiple',
    dropdownStyle: { maxHeight: 400, overflow: 'auto' },
    treeDefaultExpandAll: 'treeDefaultExpandAll',
    treeCheckable: true,
    maxTagCount: 'responsive',
    filterTreeNode: (inputValue: string, treeNode: { title: string }) =>
      treeNode?.title.includes(inputValue) ? true : false,
  }; // <Select>默认的一些配置
  const menu = (
    <Menu>
      <Radio.Group
        onChange={(e) => {
          setRatioVal(e.target.value);
          gridHeight.row = e.target.value;
          (gridApi as any)?.resetRowHeights();
        }}
        value={ratioVal}
      >
        <Menu.Item children={<Radio value={36}>宽松</Radio>} />
        <Menu.Item children={<Radio value={32}>适中</Radio>} />
        <Menu.Item children={<Radio value={28}>紧凑</Radio>} />
      </Radio.Group>
    </Menu>
  );

  /* 方法区 */
  const _onSelect = async () => {
    // 参数构建
    const gqlParams = pkGqlParmas;
    //
    if (selectItems.deptIds.length !== 0)
      Object.assign(gqlParams, { deptIds: selectItems.deptIds });
    else if (gqlParams['deptIds'] !== undefined) delete gqlParams['deptIds']; // 参数不存在时，移除key
    //
    if (selectItems.projIds.length !== 0)
      Object.assign(gqlParams, { projIds: selectItems.projIds.map((x) => parseInt(x)) });
    else if (gqlParams['projIds'] !== undefined) delete gqlParams['projIds'];
    //
    if (dateStr) Object.assign(gqlParams, { dates: { start: dateStr[0], end: dateStr[1] } });
    else if (gqlParams['dates'] !== undefined) delete gqlParams['dates'];

    //
    setPkGqlParmas(gqlParams);
    const params: GQL_PARAMS = {
      func: GRAPHQL_QUERY['PROJECT_KPI'],
      params: gqlParams,
    };

    // 数据查询
    const rets = (await queryGQL(gqlClient, projectKpiGql, params)) ?? [];
    setGqlData(rets);
  };

  /*  */
  useEffect(() => {
    if (selectItems.doQuery && doChange) {
      setLoading(true);
      setSelectItems((prev) => Object.assign({ ...prev }, { doQuery: false }));
      _onSelect();
      doChange = false;
    }
  }, [selectItems]);
  //
  useEffect(() => {
    gqlData !== undefined ? projOptsElems(gqlData, setProjElems, selectItems.projIds) : null;
  }, [gqlData]);
  // 界面挂载后，立马查询部门组织架构
  useMount(async () => {
    const rets = await queryGQL(gqlClient, organizationGql, {
      func: GRAPHQL_QUERY['ORGANIZATION'],
    });
    rets ? deptTreeNodes(rets, treeData, setTreeData) : null;
  });

  /* 绘制区 */
  return (
    <div className={mySelector}>
      <Row align="middle">
        <Col lg={24} xl={22}>
          <Form layout="inline">
            <Form.Item label="所属部门/组" key="depts">
              <TreeSelect
                {...defaultParams}
                treeData={treeData}
                className={`${selectFilter} ${treeActive1}`}
                onDropdownVisibleChange={(open: boolean) => {
                  setTreeActive1(treeActive1 ? '' : treeSelectActive);
                  !open && doChange
                    ? setSelectItems((prev) => Object.assign({ ...prev }, { doQuery: true }))
                    : null;
                }}
                onChange={(values: string) =>
                  (doChange = onTreeMultiChange(values, setSelectItems, 'deptIds'))
                }
                onClear={() => {
                  setSelectItems((prev) =>
                    Object.assign({ ...prev }, { deptIds: [], doQuery: true }),
                  );
                }}
                value={selectItems.deptIds}
              />
            </Form.Item>
            <Form.Item label="特性项目" key="projects">
              <TreeSelect
                {...defaultParams}
                treeData={projElems}
                className={`${selectFilter} ${treeActive2}`}
                onDropdownVisibleChange={(open: boolean) => {
                  setTreeActive2(treeActive2 ? '' : treeSelectActive);
                  !open && doChange
                    ? setSelectItems((prev) => Object.assign({ ...prev }, { doQuery: true }))
                    : null;
                }}
                onChange={(values: string) =>
                  (doChange = onTreeMultiChange(values, setSelectItems, 'projIds'))
                }
                onClear={() => {
                  setSelectItems((prev) =>
                    Object.assign({ ...prev }, { projIds: [], doQuery: true }),
                  );
                }}
                value={selectItems.projIds}
              />
            </Form.Item>
            <Form.Item label="时间范围" key="dates">
              <RangePicker
                style={{ width: 230 }}
                onChange={(dates: any, dateString) => {
                  dateStr = dates ? dateString : undefined;
                  doChange = true;
                  setSelectItems((prev) =>
                    Object.assign({ ...prev }, { dates: dates, doQuery: true }),
                  );
                }}
                value={selectItems.dates}
              />
            </Form.Item>
          </Form>
        </Col>
        <Col lg={24} xl={2} style={{ textAlign: 'right' }}>
          <Dropdown overlay={menu} placement="bottomCenter" arrow>
            <ColumnHeightOutlined />
          </Dropdown>
          <Divider type="vertical" />
          <Tooltip title="刷新" color="cyan">
            <ReloadOutlined
              onClick={() => {
                doChange = true;
                setProjElems(null);
                setSelectItems(Object.assign({ ...defaultSeclectItems }, { doQuery: true }));
                dateStr = undefined;
              }}
            />
          </Tooltip>
        </Col>
      </Row>
    </div>
  );
};

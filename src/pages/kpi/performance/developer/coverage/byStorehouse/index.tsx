import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { useRequest } from 'ahooks';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { GqlClient, useGqlClient, useQuery } from '@/hooks';
import * as dayjs from 'dayjs';
import { Button, Drawer, Form, Select } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import { getHeight } from '@/publicMethods/pageSet';

const { Option } = Select;

const queryBranchViews = async (client: GqlClient<object>, queryCondition: any) => {
  let project = ''; // 拼接gql 需要的数组
  if (queryCondition.frontLib) {
    project = `"${queryCondition.frontLib}"`;
  }

  if (queryCondition.backendLib) {
    project =
      project === ''
        ? `"${queryCondition.backendLib}"`
        : `${project},"${queryCondition.backendLib}"`;
  }

  let qurStr: any = '';
  if (queryCondition.module) {
    qurStr = `module:"${queryCondition.module}"`;
  }

  if (project) {
    qurStr = qurStr === '' ? `project:[${project}]` : `${qurStr},project:[${project}]`;
  }

  if (qurStr) {
    qurStr = `(${qurStr})`;
  }

  const { data } = await client.query(`
    {
      fileCovers${qurStr}
      {
          side
          branch
          reportDate
          project
          instCove
          branCove
          createAt
          moduleName
      }
    }
    `);

  const datas = data?.fileCovers;
  const front: any = [];
  const backend: any = [];

  datas.forEach((ele: any) => {
    if (ele.side === 'FRONT') {
      front.push(ele);
    } else {
      backend.push(ele);
    }
  });

  return front.concat(backend);
};

// 日期渲染（加上latest）
function dateCellRenderer(params: any) {
  if (params.value === undefined) {
    return '';
  }

  const times: any = params.value;
  const currentTime: string = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  if (times <= currentTime) {
    return ` <span><span>  ${times} </span> <span style='color: darkorange'> (latest) </span></span>`;
  }
  return ` <span>  ${times} </span>`;
}

// 区分前端或者后端
function sideCellRenderer(params: any) {
  const module = params.value;
  let cModule = '';
  if (module === 'BACKEND') {
    cModule = '后端';
  }
  if (module === 'FRONT') {
    cModule = '前端';
  }
  return ` <span> ${cModule}</span>`;
}

// 值为0显示为蓝色
function coverageCellRenderer(params: any) {
  if (params.value === undefined) {
    return '';
  }
  let values: number = 0;
  if (params.value === '' || params.value == null) {
    values = 0;
  } else {
    values = params.value;
  }
  if (values === 0) {
    return ` <span style="color: dodgerblue">  ${values} </span> `;
  }
  return values.toString();
}

const LoadBranchCombobox = (module: any) => {
  const combobox = [<Option value=""> </Option>];

  // 传入的参数module不能是任何类型的数据。在后端，FRONT 和 BACKEND 本身就是一个类型，因此需要将传入的字符串双引号去掉。
  const { data: { fileCoverBrachRepository = [] } = {} } = useQuery(`
          {
             fileCoverBrachRepository(side:${module.replaceAll('"', '')}){
              side
              name
            }
          }
      `);

  if (fileCoverBrachRepository === null) {
    return combobox;
  }
  for (let index = 0; index < fileCoverBrachRepository.length; index += 1) {
    combobox.push(
      <Option value={fileCoverBrachRepository[index].name}>
        {' '}
        {fileCoverBrachRepository[index].name}
      </Option>,
    );
  }
  return combobox;
};

const LoadProjectCombobox = () => {
  const combobox = [<Option value=""> </Option>];

  const { data: { fileCoverBrachModule = [] } = {} } = useQuery(`
          {
            fileCoverBrachModule{
              name
            }
          }
      `);

  for (let index = 0; index < fileCoverBrachModule.length; index += 1) {
    combobox.push(
      <Option value={fileCoverBrachModule[index].name}> {fileCoverBrachModule[index].name}</Option>,
    );
  }
  return combobox;
};

const BranchTableList: React.FC<any> = () => {
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const [conditon, setCondition] = useState({
    module: '',
    frontLib: '',
    backendLib: '',
  });
  const { data, loading } = useRequest(() => queryBranchViews(gqlClient, conditon));

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
    // console.log("新高度：", getHeight());
    setGridHeight(getHeight());
    gridApi.current?.sizeColumnsToFit();
  };

  const updateGrid = async () => {
    const datas: any = await queryBranchViews(gqlClient, conditon);
    gridApi.current?.setRowData(
      datas?.flatMap((it: any) =>
        it.branch.startsWith('emergency') || it.branch.startsWith('stage-patch') ? [] : [it],
      ) ?? [],
    );
  };

  const projectChanged = (values: any) => {
    console.log(values);
    setCondition({
      ...conditon,
      module: values,
    });
  };

  const frontLibChanged = (values: any) => {
    console.log(values);
    setCondition({
      ...conditon,
      frontLib: values,
    });
  };

  const backendLibChanged = (values: any) => {
    console.log(values);
    setCondition({
      ...conditon,
      backendLib: values,
    });
  };

  /* region 提示规则显示 */
  const [messageVisible, setVisible] = useState(false);
  const showRules = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const cssIndent = { textIndent: '2em' };
  /* endregion */

  useEffect(() => {
    updateGrid();
  }, [conditon]);

  return (
    <PageContainer>
      <div style={{ background: 'white' }}>
        <Form.Item>
          <label style={{ marginLeft: '10px' }}>项目名：</label>
          <Select
            placeholder="请选择"
            style={{ width: '200px', marginTop: '5px' }}
            showSearch
            optionFilterProp="children"
            onChange={projectChanged}
          >
            {LoadProjectCombobox()}
          </Select>

          <label style={{ marginLeft: '20px' }}>前端库：</label>
          <Select
            placeholder="请选择"
            style={{ width: '200px', marginTop: '5px' }}
            showSearch
            optionFilterProp="children"
            onChange={frontLibChanged}
          >
            {LoadBranchCombobox('FRONT')}
          </Select>

          <label style={{ marginLeft: '20px' }}>后端库：</label>
          <Select
            placeholder="请选择"
            style={{ width: '200px' }}
            showSearch
            optionFilterProp="children"
            onChange={backendLibChanged}
          >
            {LoadBranchCombobox('BACKEND')}
          </Select>

          <Button
            type="text"
            style={{ color: '#1890FF', float: 'right' }}
            icon={<QuestionCircleTwoTone />}
            size={'large'}
            onClick={showRules}
          >
            计算规则
          </Button>
        </Form.Item>
      </div>

      <div className="ag-theme-alpine" style={{ height: gridHeight, width: '100%' }}>
        <AgGridReact
          rowData={
            data?.flatMap((it: any) =>
              it.branch.startsWith('emergency') || it.branch.startsWith('stage-patch') ? [] : [it],
            ) ?? []
          }
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            flex: 1,
            minWidth: 100,
            cellStyle: { 'margin-top': '-5px' },
          }}
          autoGroupColumnDef={{
            minWidth: 130, // rowGroup 的最大宽度
          }}
          rowHeight={32}
          headerHeight={35}
          groupDefaultExpanded={9} // 展开分组
          // suppressDragLeaveHidesColumns
          // suppressMakeColumnVisibleAfterUnGroup
          onGridReady={onGridReady}
        >
          <AgGridColumn
            field="side"
            headerName="技术侧"
            // minWidth={150}
            rowGroup={true}
            hide={true}
            cellRenderer={sideCellRenderer}
          />
          <AgGridColumn field="moduleName" headerName="项目名" minWidth={150} />
          <AgGridColumn field="branch" headerName="分支名" minWidth={150} />
          <AgGridColumn
            field="reportDate"
            headerName="日期"
            minWidth={150}
            cellRenderer={dateCellRenderer}
          />
          <AgGridColumn
            field="instCove"
            headerName="结构覆盖率"
            cellRenderer={coverageCellRenderer}
          />
          <AgGridColumn
            field="branCove"
            headerName="分支覆盖率"
            // type="numericColumn"
            cellRenderer={coverageCellRenderer}
          />
          <AgGridColumn field="createAt" headerName="扫描时间" />
        </AgGridReact>
      </div>

      <div>
        <Drawer
          title={<label style={{ fontWeight: 'bold', fontSize: 20 }}>计算规则</label>}
          placement="right"
          width={300}
          closable={false}
          onClose={onClose}
          visible={messageVisible}
        >
          <p>
            <strong>1.统计公式说明</strong>
          </p>
          <p style={cssIndent}>结构覆盖率 = 所拥有文件结构覆盖数之和/所有拥有文件总结构数之和； </p>
          <p style={cssIndent}>分支覆盖率 = 所拥有文件分支覆盖数之和/所有拥有文件总分支数之和； </p>
          <p>
            <strong>2.取值方式</strong>
          </p>
          <p style={cssIndent}>前端：结构数：Statements 分支数：Branches；</p>
          <p style={cssIndent}>后端：结构数：Instructions Cov 分支数：Branches；</p>
        </Drawer>
      </div>
    </PageContainer>
  );
};

export default BranchTableList;

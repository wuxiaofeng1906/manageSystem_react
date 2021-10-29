import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {getHeight} from '@/publicMethods/pageSet';
import "./style.css";

import CustomCellRenderer from './customCellRenderer';

import {Button, Form, Input, message, Modal} from "antd";

import {DeleteTwoTone, EditTwoTone, FolderAddTwoTone} from "@ant-design/icons";
import axios from "axios";
import {history} from "@@/core/history";

const {TextArea} = Input;

const seletedDataNum = {
  "id": 0,
  "sort_num": 0
}

// 查询数据
const queryDevelopViews = async () => {

  let result: any = [];
  const paramData = {
    page: 1,
    page_size: 100
  };


  await axios.get('/api/verify/app_tools/app_list', {params: paramData})
    .then(function (res) {

      if (res.data.code === 200) {
        result = res.data.data;
      } else {
        message.error({
          content: `错误：${res.data.msg}`,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      }


    }).catch(function (error) {

      message.error({
        content: `异常信息:${error.toString()}`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    });

  return result;
};

// 组件初始化
const ToolIntegrate: React.FC<any> = () => {


  // 跳转到当前网站的链接
  (window as any).gotoCurrentPage = (params: any) => {
    history.push(params);
  };

  // 定义列名
  const colums = () => {
    const component = new Array();
    component.push(
      {
        headerName: '',
        checkboxSelection: true,
        // headerCheckboxSelection: true,  // 禁用全选按钮
        maxWidth: 50,
        pinned: 'left',
      },
      {
        headerName: '序号',
        maxWidth: 90,
        filter: false,
        cellRenderer: (params: any) => {
          return Number(params.node.id) + 1;
        },
      },
      {
        headerName: '应用名称',
        field: 'app_name',
        minWidth: 130,
        cellRenderer: (params: any) => {
          if (params.value) {
            const myHref = window.location.origin;
            const goToHref = params.data.app_url;

            if (goToHref.indexOf(myHref) > -1) {
              const newUrl = goToHref.replace(myHref, "").trim();

              // > -1就代表是同一个地址。。就不另起网页调转了
              return `<a  style="text-decoration: underline" onclick='gotoCurrentPage(${JSON.stringify(newUrl)})'>${params.value}</a>`;
            }

            return `<a href="${goToHref}" target="_blank" style="text-decoration: underline" >${params.value}</a>`
          }
          return params.value;
        },
      },
      {
        headerName: '应用描述',
        field: 'app_description',
        minWidth: 130,
      },
      {
        headerName: '排序',
        minWidth: 80,
        cellRenderer: "myCustomCell",
      }
    );

    return component;
  };

  /* region  表格相关事件 */
  const gridApi = useRef<GridApi>(); // 绑定ag-grid 组件
  const {data, loading} = useRequest(() => queryDevelopViews());

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

  const onChangeGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const refreshGrid = async () => {
    const datas = await queryDevelopViews();

    gridApi.current?.setRowData(datas?.data);
  }
  /* endregion */

  // region 新增、修改、删除、排序
  const [formForAppInfo] = Form.useForm();
  const [title, setTitle] = useState("新增");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // region 新增和修改工具信息

  const addToolInfo = () => {
    setIsModalVisible(true);
    formForAppInfo.setFieldsValue({
      appName: null,
      appUrl: null,
      appDesc: null
    });
  };
  // 取消
  const modalCancel = () => {
    setIsModalVisible(false);
  };

  // 执行新增操作
  const carryAddOperate = (datas: any) => {
    axios.post('/api/verify/app_tools/app_list', datas)
      .then(function (res) {

        if (res.data.code === 200) {
          setIsModalVisible(false);
          refreshGrid();
          message.info({
            content: `保存成功！`,
            duration: 1, // 1S 后自动关闭
            style: {
              marginTop: '50vh',
            },
          });

        } else {
          message.error({
            content: `保存失败：${res.data.msg}`,
            duration: 1, // 1S 后自动关闭
            style: {
              marginTop: '50vh',
            },
          });
        }

      }).catch(function (error) {

      message.error({
        content: `异常信息:${error.toString()}`,
        duration: 1, // 1S 后自动关闭
        style: {
          marginTop: '50vh',
        },
      });
    });
  };

  // 修改工具信息
  const modifyToolInfo = () => {
    const selectedData = gridApi.current?.getSelectedNodes();
    if (selectedData && selectedData.length <= 0) {
      message.error({
        content: "请选中需要修改的数据！",
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return;
    }

    if (selectedData && selectedData.length > 1) {
      message.error({
        content: "一次只能修改一条数据！",
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return;
    }
    let s_row = null;
    if (selectedData) {
      s_row = selectedData[0].data;
    }

    seletedDataNum.id = s_row.id;
    seletedDataNum.sort_num = s_row.sort_num;

    setTitle("修改");
    setIsModalVisible(true);
    formForAppInfo.setFieldsValue({
      appName: s_row.app_name,
      appUrl: s_row.app_url,
      appDesc: s_row.app_description
    });

  };

  // 执行修改操作
  const carryModifyOperate = (datas: any) => {
    axios.put("/api/verify/app_tools/app_list", datas)
      .then(function (res) {

        if (res.data.code === 200) {
          setIsModalVisible(false);
          refreshGrid();
          message.info({
            content: `保存成功！`,
            duration: 1, // 1S 后自动关闭
            style: {
              marginTop: '50vh',
            },
          });

        } else {
          message.error({
            content: `保存失败：${res.data.msg}`,
            duration: 1, // 1S 后自动关闭
            style: {
              marginTop: '50vh',
            },
          });
        }


      }).catch(function (error) {

      message.error({
        content: `异常信息:${error.toString()}`,
        duration: 1, // 1S 后自动关闭
        style: {
          marginTop: '50vh',
        },
      });
    });
  }

  // 保存设置
  const saveAppInfo = () => {

    const formData = formForAppInfo.getFieldsValue();

    // 应用名称不能为空
    if (!formData.appName) {
      message.error({
        content: "应用名称不能为空！",
        duration: 1, // 1S 后自动关闭
        style: {
          marginTop: '50vh',
        },
      });
      return;
    }

    // 验证url是否符合正常rul规则
    const url = formData.appUrl;
    const strRegex = '(http|ftp|https):\\/\\/[\\w\\-_]+(\\.[\\w\\-_]+)+([\\w\\-\\.,@?^=%&amp;:/~\\+#]*[\\w\\-\\@?^=%&amp;/~\\+#])?';
    const re = new RegExp(strRegex);
    if (!re.test(url)) {
      message.error({
        content: "应用地址不符合规则！",
        duration: 1, // 1S 后自动关闭
        style: {
          marginTop: '50vh',
        },
      });
      return;
    }


    if (!formData.appDesc) {
      message.error({
        content: "应用描述不能为空！",
        duration: 1, // 1S 后自动关闭
        style: {
          marginTop: '50vh',
        },
      });
      return;
    }

    const datas = {
      "app_name": formData.appName,
      "app_url": formData.appUrl,
      "app_description": formData.appDesc
    };

    if (title === "新增") {
      carryAddOperate(datas);
    } else {
      datas["id"] = seletedDataNum.id;
      datas["sort_num"] = seletedDataNum.sort_num;
      carryModifyOperate([datas]);
    }

  };

  // endregion

  // region 删除工具信息

  const [isdelModalVisible, setDelModalVisible] = useState(false);
  // 点击删除按钮
  const deleteToolInfo = () => {

    const selectedData = gridApi.current?.getSelectedNodes();
    if (selectedData && selectedData.length <= 0) {
      message.error({
        content: "请选中需要删除的数据！",
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return;
    }

    setDelModalVisible(true);
  };
  // 取消删除
  const delCancel = () => {
    setDelModalVisible(false);
  };
  // 确认删除操作
  const delAppInfo = () => {
    const selectedData = gridApi.current?.getSelectedNodes();
    let s_row = null;
    if (selectedData) {
      s_row = selectedData[0].data;
    }

    axios.delete('/api/verify/app_tools/app_list', {params: {_id: Number(s_row.id)}})
      .then(function (res) {
        if (res.data.code === 200) {
          setDelModalVisible(false);
          refreshGrid();
          message.info({
            content: "记录删除成功！",
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        } else if (Number(res.data.code) === 403) {
          message.error({
            content: "您无权删除信息！",
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        } else {
          message.error({
            content: `${res.data.message}`,
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        }
      })
      .catch(function (error) {
        if (error.toString().includes("403")) {
          message.error({
            content: "您无权删除信息！",
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        } else {
          message.error({
            content: error.toString(),
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        }

      });

  };
  // endregion

  // region 排序拖动
  const dragOver = () => {

    const orderArray: any = [];
    gridApi.current?.forEachNode(function (node, index) {
      const currentDt = node.data;

      orderArray.push({
        "app_name": currentDt.app_name,
        "app_url": currentDt.app_url,
        "app_description": currentDt.app_description,
        "id": currentDt.id,
        "sort_num": index + 1
      })

    });

    carryModifyOperate(orderArray);

  }
  // endregion

  // endregion

  return (
    <PageContainer>
      {/* 查询条件 */}
      <div style={{width: '100%', backgroundColor: "white", marginTop: -15}}>
        <Button type="text" icon={<FolderAddTwoTone/>} size={'large'} onClick={addToolInfo}>新增</Button>
        <Button type="text" icon={<EditTwoTone/>} size={'large'} onClick={modifyToolInfo}>修改</Button>
        <Button type="text" icon={<DeleteTwoTone/>} size={'large'} onClick={deleteToolInfo}>删除</Button>
      </div>

      {/* ag-grid 表格定义 */}
      {/* 拖拽功能:https://www.ag-grid.com/react-data-grid/row-dragging/#multi-row-dragging */}
      <div className="ag-theme-alpine" style={{height: gridHeight, width: '100%'}}>
        <AgGridReact
          columnDefs={colums()} // 定义列
          rowData={data?.data} // 数据绑定
          defaultColDef={{
            resizable: true,
            // sortable: true,
            filter: true,
            flex: 1,
            suppressMenu: true,
          }}
          rowDragManaged={true}
          animateRows={true}
          frameworkComponents={{myCustomCell: CustomCellRenderer}}
          onRowDragEnd={dragOver}
          onGridReady={onGridReady}
          onGridSizeChanged={onChangeGridReady}

        >
        </AgGridReact>
      </div>

      <Modal
        title={title}
        visible={isModalVisible}
        onCancel={modalCancel}
        centered={true}
        width={520}
        bodyStyle={{height: 220}}
        footer={
          [
            <Button style={{borderRadius: 5, marginTop: -100}} onClick={modalCancel}>取消</Button>,
            <Button type="primary"
                    style={{marginLeft: 10, color: '#46A0FC', backgroundColor: "#ECF5FF", borderRadius: 5}}
                    onClick={saveAppInfo}>保存
            </Button>
          ]
        }
      >
        <Form form={formForAppInfo} style={{marginTop: -8}} autoComplete={"off"}>

          <Form.Item label="应用名称：" name="appName" required={true}>
            <Input style={{marginLeft: 5, width: 380}}/>
          </Form.Item>

          <Form.Item label="应用地址" name="appUrl" required={true}>
            <Input style={{marginLeft: 5, width: 380}}/>
          </Form.Item>

          <Form.Item label="应用描述" name="appDesc" required={true}>
            <TextArea rows={3} style={{marginLeft: 5, width: 380}}/>
          </Form.Item>

        </Form>
      </Modal>

      {/* 删除 */}
      <Modal
        title={'删除'}
        visible={isdelModalVisible}
        onCancel={delCancel}
        centered={true}
        footer={null}
        width={400}
      >
        <Form>
          <Form.Item>
            <label style={{marginLeft: '90px'}}>您确定删除选中的应用信息吗？</label>
          </Form.Item>

          <Form.Item>
            <Button type="primary" style={{marginLeft: '100px'}} onClick={delAppInfo}>
              确定
            </Button>
            <Button type="primary" style={{marginLeft: '20px'}} onClick={delCancel}>
              取消
            </Button>
          </Form.Item>

          <Form.Item name="groupId" style={{display: "none", width: "32px", marginTop: "-55px", marginLeft: "270px"}}>
            <Input/>
          </Form.Item>
        </Form>
      </Modal>

    </PageContainer>
  );
};

export default ToolIntegrate;

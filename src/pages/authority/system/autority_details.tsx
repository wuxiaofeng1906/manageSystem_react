import React, {useState} from 'react';
import {getHeight} from '@/publicMethods/pageSet';
import {PageContainer} from "@ant-design/pro-layout";
import {Table, Space, Button, Checkbox} from 'antd';
import {history} from "@@/core/history";
import {removeElement, addOrRemoveElement} from '@/publicMethods/arrayMethod';

const CheckboxGroup = Checkbox.Group;


// 组件初始化
const AuthorityDetails: React.FC<any> = () => {
  const clickedRowData = {
    module: [],
    method: []
  };
  // 测试数据
  const datas = [
    {id: 1, module: ["首页"], method: ['功能一']},
    {id: 2, module: ["我的地盘"], method: ['功能二', '功能三']},
    {id: 3, module: ["代办"], method: ['功能四', '功能五', '功能六']}
  ];

  // region title获取
  let pageTitle: string = '';
  const location = history.location.query;
  if (location !== null && location !== undefined && location.groupname !== undefined && location.groupname !== null) {
    pageTitle = location.groupname.toString();
  }

  // endregion

  // region 模块勾选动作

  const [moduleList, setModuleList] = useState(['我的地盘']);

  const onModuleChange = (params: any) => {
    let moduleGroup = [];
    for (let index = 0; index < moduleList.length; index += 1) {
      moduleGroup.push(moduleList[index]);  // 将默认的数据添加到新数组中
    }
    const data: any = clickedRowData.module[0];
    if (params.length === 0 && clickedRowData.module.length > 0) {
      // 为取消动作：整体数组减去点击的行
      moduleGroup = removeElement(moduleGroup, data);

    } else {
      // 为添加动作：整体数组添加点击的行
      moduleGroup.push(data);
    }
    setModuleList(moduleGroup);
  };

  // endregion

  /* region 方法勾选动作 */
  const [methodList, setMethodList] = useState(['功能二', '功能三']);

  // 方法勾选动作
  const onMethodChange = (params: any) => {

    const methodGroup = [];
    for (let index = 0; index < methodList.length; index += 1) {
      methodGroup.push(methodList[index]);  // 将默认的数据添加到新数组中
    }
    const groups = addOrRemoveElement(methodGroup, params);
    const data: any = clickedRowData.method;
    // if (params.length === 0 && clickedRowData.method.length > 0) {
    //   // 为取消动作：整体数组减去点击的行
    //   methodGroup = removeElement(methodGroup, data);
    //
    // } else {
    //   // 为添加动作：整体数组添加点击行的数据
    //   methodGroup.push(params[0]);
    //   // data.forEach((element: string) => {
    //   //   methodGroup.push(element);
    //   // });
    // }
    setMethodList(groups);
  };
  /* endregion */

  /* region 全选功能 */
  const [checkAll, setCheckAll] = useState(false);
  // 所有功能全选
  const selectAll = (params: any) => {

    if (params.target.checked === true) {

      setCheckAll(true);
      setMethodList(['功能一', '功能二', '功能三', '功能四', '功能五', '功能六']);
      setModuleList(['首页', '我的地盘', '代办', '全选']);

    } else {
      setCheckAll(false);
      setMethodList([]);
      setModuleList([]);
    }
  };

  /* endregion */


  // 列的定义
  const columns = [
    {
      title: <span style={{fontWeight: "bold", fontSize: "17px"}}> 编号</span>,
      dataIndex: 'id',
      key: 'id',
      width: 60
    },
    {
      title: <span style={{fontWeight: "bold", fontSize: "17px"}}> 模块</span>,
      key: 'module',
      width: 200,
      render: (text: any) => (
        <Space size="middle">
          <CheckboxGroup options={text.module} value={moduleList} onChange={onModuleChange}/>

        </Space>
      ),
    },
    {
      title: <span style={{fontWeight: "bold", fontSize: "17px"}}> 方法</span>,
      key: 'method',
      render: (text: any) => (
        <Space size="middle">
          <div>
            <CheckboxGroup options={text.method} value={methodList} onChange={onMethodChange}/>

          </div>
        </Space>
      ),
    },
  ];

  // region 最终按钮功能
  // 保存权限按钮
  const saveAuthority = () => {
    console.log("保存权限");

    // 1.获取当前角色（用户组）
    // pageTitle就是组名

    // 2.获取已勾选的权限

  };

  // 点击返回按钮
  const returns = () => {
    history.push(`/authority/main`);
  };

  // endregion
  return (
    <PageContainer title={pageTitle} style={{height: getHeight(), backgroundColor: "#F2F2F2"}}>
      {/* 表格控件 */}
      <div>
        <Table columns={columns}
               dataSource={datas}
               pagination={false}  // 禁止分页
               size="small"  // 紧凑型
               bordered={true}
               summary={() => (
                 <Table.Summary.Row>
                   <Table.Summary.Cell index={0}>4</Table.Summary.Cell>
                   <Table.Summary.Cell index={1}>
                     <Checkbox checked={checkAll} onChange={selectAll}>全选</Checkbox>
                   </Table.Summary.Cell>
                   <Table.Summary.Cell index={2}>
                     <div><Button type="primary" onClick={saveAuthority}> 保存 </Button> <Button
                       onClick={returns}> 返回 </Button></div>
                   </Table.Summary.Cell>
                 </Table.Summary.Row>
               )}

               onRow={(record: any) => {
                 return {
                   onClick: () => {
                     // console.log("record", record);
                     clickedRowData.module = record.module;
                     clickedRowData.method = record.method;
                   }
                 };
               }}


        />
      </div>
    </PageContainer>
  );
};

export default AuthorityDetails;

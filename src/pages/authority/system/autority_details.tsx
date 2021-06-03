import React, {useState} from 'react';
import {getHeight} from '@/publicMethods/pageSet';
import {PageContainer} from "@ant-design/pro-layout";
import {Table, Space, Button, Checkbox} from 'antd';
import {history} from "@@/core/history";
import {addOrRemoveElement} from '@/publicMethods/arrayMethod';
import {GqlClient, useGqlClient} from "@/hooks";
import {useRequest} from "ahooks";

const CheckboxGroup = Checkbox.Group;

const querydetailsViews = async (client: GqlClient<object>) => {
  const {data} = await client.query(`
      {
        roleAuthority(group:1){
          name
          description
          authorities{
            id
            name
            parent
            description
          }
        }
      }
  `);

  return data?.roleAuthority;
};


const AuthorityDetails: React.FC<any> = () => {
  const gqlClient = useGqlClient();
  const {data} = useRequest(() => querydetailsViews(gqlClient));


  const clickedRowData = {
    module: [],
    method: []
  };

  const clickedValue = {
    module: "",
    method: ""
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

  /* region 方法勾选动作 */
  const [methodList, setMethodList] = useState(['功能二', '功能三']);

  // 方法勾选动作
  const onMethodChange = () => {

    const methodGroup = [];
    for (let index = 0; index < methodList.length; index += 1) {
      methodGroup.push(methodList[index]);  // 将默认的数据添加到新数组中
    }
    const groups = addOrRemoveElement(methodGroup, clickedValue.method);

    setMethodList(groups);
  };
  /* endregion */

  // region 模块勾选动作

  const [moduleList, setModuleList] = useState(['我的地盘']);

  const onModuleChange = () => {

    const moduleGroup = [];
    for (let index = 0; index < moduleList.length; index += 1) {
      moduleGroup.push(moduleList[index]);  // 将默认的数据添加到新数组中
    }
    const groups = addOrRemoveElement(moduleGroup, clickedValue.method);

    setModuleList(groups);
    setMethodList(["功能四", "功能五", "功能六"]);  // 需要获取响应的模块的所有方法


  };

  // endregion


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
        <CheckboxGroup options={text.method} value={methodList} onChange={onMethodChange}/>
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
               dataSource={data}
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

               onRow={(key: any, record: any) => {
                 return {
                   onClick: (param: any) => {

                     // console.log("param", param);
                     // clickedValue.module = param.target.innerText;
                     clickedValue.method = param.target.defaultValue;
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

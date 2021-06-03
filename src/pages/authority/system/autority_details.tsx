import React, {useEffect, useState} from 'react';
import {getHeight} from '@/publicMethods/pageSet';
import {PageContainer} from "@ant-design/pro-layout";
import {Table, Space, Button, Checkbox} from 'antd';
import {history} from "@@/core/history";
import {addOrRemoveElement} from '@/publicMethods/arrayMethod';
import type {GqlClient} from "@/hooks";
import {useGqlClient} from "@/hooks";
import {useRequest} from "ahooks";

const CheckboxGroup = Checkbox.Group;

const alaySelectedAuthority = (params: any) => {

  const moduleArray = Array();
  const methodArray = Array();

  params.forEach((ele: any) => {
    const detais = ele.authorities;
    detais.forEach((author: any) => {
      if (moduleArray.indexOf(author.parent.description) === -1) {
        moduleArray.push(author.parent.description);
      }
      methodArray.push(author.description);
    });
  });

  const datas = {
    moduleData: moduleArray,
    methodData: methodArray
  };
  return datas;
};

const queryselectedAuthorityViews = async (client: GqlClient<object>, groupId: any) => {
  const {data} = await client.query(`
      {
        roleAuthority(group:${groupId}){
          name
          description
          authorities{
            id
            name
            description
            parent
            {
              id
              name
              description
            }
          }
        }
      }
  `);

  return alaySelectedAuthority(data?.roleAuthority);
};

const alayAllAuthority = (params: any) => {
  const datas = [];
  const allModule: any = [];
  const allMethod: any = [];

  // 先找寻parent（parent就是模块）
  const moduleArray = Array();
  params.forEach((ele: any) => {
    if (moduleArray.indexOf(ele.parent.id) === -1) {
      moduleArray.push(ele.parent.id);
    }
  });


  for (let index = 0; index < moduleArray.length; index += 1) {

    const myModule: any = Array();
    const myMethod: any = [];
    params.forEach((me: any) => {
      if (moduleArray[index] === me.parent.id) {
        if (myModule.indexOf(me.parent.description) === -1) {
          myModule.push(me.parent.description);
          allModule.push(me.parent.description);
        }
        myMethod.push(me.description);
        allMethod.push(me.description);
      }

    });

    datas.push(
      {
        id: index + 1,
        module: myModule,
        method: myMethod
      });

  }


  return {"datas": datas, "allModule": allModule, "allMethod": allMethod};
};

const queryAllAuthorityViews = async (client: GqlClient<object>) => {
  const {data} = await client.query(`
      {
        authorityItems{
          id
          name
          description
          parent{
            id
            name
            description
          }
        }
      }
  `);

  return alayAllAuthority(data?.authorityItems);
};

// 获取某个模块下的方法
const getChildMethod = (parent: any, module: any) => {
  let methodFOrModule: any = [];
  for (let mIndex = 0; mIndex < module.length; mIndex += 1) {

    const module_value = module[mIndex];
    for (let index = 0; index < parent.length; index += 1) {
      const moduleName = parent[index].module;

      if (moduleName[0] === module_value) {
        const child = parent[index].method;
        methodFOrModule = methodFOrModule.concat(child);
      }
    }
  }

  return methodFOrModule;
};
const AuthorityDetails: React.FC<any> = () => {

  const clickedRowData = {
    module: [],
    method: []
  };
  let clickedValue = "";

  // region title获取
  let pageTitle: string = '';
  let groupId: any = "";
  const location = history.location.query;
  if (location !== null && location !== undefined && location.groupname !== undefined && location.groupname !== null) {
    pageTitle = location.groupname.toString();
    groupId = location.groupid === null ? 0 : Number(location.groupid);
  }

  // endregion

  const gqlClient = useGqlClient();
  const {data} = useRequest(() => queryAllAuthorityViews(gqlClient));
  const oraData = data === undefined ? [] : data.datas;

  const selectedAuthority: any = useRequest(() => queryselectedAuthorityViews(gqlClient, groupId)).data;

  /* region 方法勾选动作 */
  const [methodList, setMethodList] = useState(['']);

  // 方法勾选动作
  const onMethodChange = () => {

    const methodGroup: any = [];
    for (let index = 0; index < methodList.length; index += 1) {
      methodGroup.push(methodList[index]);  // 将默认的数据添加到新数组中
    }
    const groups = addOrRemoveElement(methodGroup, clickedValue);

    setMethodList(groups);
  };
  /* endregion */

  // region 模块勾选动作

  const [moduleList, setModuleList] = useState(['']);

  const onModuleChange = () => {

    const moduleGroup = [];
    for (let index = 0; index < moduleList.length; index += 1) {
      moduleGroup.push(moduleList[index]);  // 将默认的数据添加到新数组中
    }

    const groups = addOrRemoveElement(moduleGroup, clickedValue);

    // 获取模块对应的方法
    const methodArray = getChildMethod(oraData, groups);

    setModuleList(groups);// 选中模块
    setMethodList(methodArray);  // 选中方法

  };

  // endregion

  /* region 全选功能 */
  const [checkAll, setCheckAll] = useState(false);
  // 所有功能全选
  const selectAll = (params: any) => {
    if (params.target.checked === true) {
      if (data !== undefined) {

        // 选中所有的项目
        setMethodList(data.allMethod);
        setModuleList(data.allModule);
      }
      setCheckAll(true);
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
      width: 120,
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


  useEffect(() => {
    if (selectedAuthority !== undefined) {
      console.log("selectedAuthority.methodData", selectedAuthority.moduleData);
      setMethodList(selectedAuthority.methodData);
      setModuleList(selectedAuthority.moduleData);
    }
  }, [selectedAuthority]);
  return (
    <PageContainer title={pageTitle} style={{height: getHeight(), backgroundColor: "#F2F2F2"}}>
      {/* 表格控件 */}
      <div>
        <Table columns={columns}
               dataSource={oraData}
               pagination={false}  // 禁止分页
               size="small"  // 紧凑型
               bordered={true}
               summary={() => (
                 <Table.Summary.Row>
                   <Table.Summary.Cell index={0}></Table.Summary.Cell>
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
                     clickedValue = param.target.defaultValue;
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

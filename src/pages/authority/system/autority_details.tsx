import React, { useEffect, useState } from 'react';
import { getHeight } from '@/publicMethods/pageSet';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Space, Button, Checkbox, message, Row, Col } from 'antd';
import { history } from '@@/core/history';
import { addOrRemoveElement } from '@/publicMethods/arrayMethod';
import type { GqlClient } from '@/hooks';
import { useGqlClient } from '@/hooks';
import { useRequest } from 'ahooks';
import axios from 'axios';
import { judgeAuthority } from '@/publicMethods/authorityJudge';
import Ellipsis from '@/components/Elipsis';
import { useUser } from '@/hooks/user';
import { useModel } from 'umi';

const CheckboxGroup = Checkbox.Group;

/* region 已选择的方法功能 */
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
    methodData: methodArray,
  };
  return datas;
};

const queryselectedAuthorityViews = async (client: GqlClient<object>, groupId: any) => {
  const { data } = await client.query(`
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

  console.log('已选择的方法功能 data?.roleAuthority', data?.roleAuthority);

  return alaySelectedAuthority(data?.roleAuthority);
};
/* endregion */

/* region 获取所有的方法功能 */
const alayAllAuthority = (params: any) => {
  const datas = [];
  const allModule: any = [];
  const allMethod: any = [];
  if (params !== undefined && params !== null) {
    // 先找寻parent（parent就是模块）
    const moduleArray = Array();
    params.forEach((ele: any) => {
      if (ele.parent) {
        if (moduleArray.indexOf(ele.parent.id) === -1) {
          moduleArray.push(ele.parent.id);
        }
      }
    });

    for (let index = 0; index < moduleArray.length; index += 1) {
      const myModule: any = Array();
      const myMethod: any = [];
      params.forEach((me: any) => {
        if (moduleArray[index] === me.parent?.id) {
          if (myModule.indexOf(me.parent.description) === -1) {
            myModule.push(me.parent.description);
            allModule.push(me.parent.description);
          }
          myMethod.push(me.description);
          allMethod.push(me.description);
        }
      });

      datas.push({
        id: index + 1,
        module: myModule,
        method: myMethod,
      });
    }
  }

  return { datas: datas, allModule: allModule, allMethod: allMethod };
};

const queryAllAuthorityViews = async (client: GqlClient<object>) => {
  const { data } = await client.query(`
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

  // console.log("获取所有的方法功能 data?.authorityItems", data?.authorityItems);
  // console.log("获取所有的方法功能 errors", errors);
  return data?.authorityItems;
};

/* endregion */

// 获取某个模块下的所有方法
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

const getselectedId = (alls: any, sModule: any, sMethod: any) => {
  const selectedIdArray = [];

  // 获取被选中的id
  for (let index = 0; index < alls.length; index += 1) {
    // 方法id
    for (let nIndex = 0; nIndex < sMethod.length; nIndex += 1) {
      if (sMethod[nIndex] === alls[index].description) {
        selectedIdArray.push(alls[index].id);
        break;
      }
    }

    // 模块id
    const moduleInfo = alls[index].parent;
    for (let mIndex = 0; mIndex < sModule.length; mIndex += 1) {
      if (sModule[mIndex] === moduleInfo.description) {
        selectedIdArray.push(moduleInfo.id);
        break;
      }
    }
  }

  return selectedIdArray;
};

const AuthorityDetails: React.FC<any> = () => {
  const sys_accessToken = localStorage.getItem('accessId');
  const { initialState } = useModel('@@initialState');
  const { setUser } = useUser();

  const clickedRowData = {
    module: [],
    method: [],
  };
  let clickedValue = '';

  // region title获取
  let pageTitle: string = '';
  let groupId: any = '';
  const location = history.location.query;
  if (
    location !== null &&
    location !== undefined &&
    location.groupname !== undefined &&
    location.groupname !== null
  ) {
    pageTitle = location.groupname.toString();
    groupId = location.groupid === null ? 0 : Number(location.groupid);
  }

  // endregion

  /* region 数据查询 */
  const gqlClient = useGqlClient();
  // 查询所有权限
  const { data } = useRequest(() => queryAllAuthorityViews(gqlClient));

  // 将数据解析成表格可用的格式
  const alaieddata = alayAllAuthority(data);
  const oraData = data === undefined ? [] : alaieddata.datas; // 拿去表格需要的数据

  // 初始化已选择的权限
  const selectedAuthority: any = useRequest(() => queryselectedAuthorityViews(gqlClient, groupId))
    .data;

  /* endregion */

  /* region 方法勾选动作 */
  const [methodList, setMethodList] = useState(['']);

  // 方法勾选动作
  const onMethodChange = () => {
    const methodGroup: any = [];
    for (let index = 0; index < methodList.length; index += 1) {
      methodGroup.push(methodList[index]); // 将默认的数据添加到新数组中
    }
    const groups = addOrRemoveElement(methodGroup, clickedValue);

    setMethodList(groups);
  };
  /* endregion */

  // region 模块勾选动作

  const [moduleList, setModuleList] = useState(['']);

  const onModuleChange = () => {
    // 获取已有模块
    const moduleGroup = [];
    for (let index = 0; index < moduleList.length; index += 1) {
      moduleGroup.push(moduleList[index]); // 将默认的数据添加到新数组中
    }

    // 获取已有方法
    let methodGroup: any = [];
    for (let index = 0; index < methodList.length; index += 1) {
      methodGroup.push(methodList[index]); // 将默认的数据添加到新数组中
    }

    const clickedModule = [clickedValue];

    const flag = moduleGroup.indexOf(clickedValue);
    if (flag > -1) {
      // 如果是移除模块，则移除已有模块和已有方法。
      moduleGroup.splice(flag, 1); // 移除模块

      const methodArray = getChildMethod(oraData, clickedModule); // 获取被选中的模块所有方法
      // 从原有方法中移除被移除模块对应的所有方法
      methodArray.forEach((item: any) => {
        const delFlag = methodGroup.indexOf(item);
        if (delFlag > -1) {
          // 删除有的方法
          methodGroup.splice(delFlag, 1);
        }
      });
    } else {
      // 如果是新增模块，则新增模块和方法。
      moduleGroup.push(clickedValue); // 增加模块

      const methodArray = getChildMethod(oraData, clickedModule);
      methodGroup = methodGroup.concat(methodArray); // 将已有方法和现有方法链接起来。
    }

    setModuleList(moduleGroup); // 选中模块
    setMethodList(methodGroup); // 选中方法
  };

  // endregion

  /* region 全选功能 */
  const [checkAll, setCheckAll] = useState(false);
  // 所有功能全选
  const selectAll = (params: any) => {
    if (params.target.checked === true) {
      if (alaieddata !== undefined) {
        // 选中所有的项目
        setMethodList(alaieddata.allMethod);
        setModuleList(alaieddata.allModule);
      }
      setCheckAll(true);
    } else {
      // 所有选中状态置为空
      setCheckAll(false);
      setMethodList([]);
      setModuleList([]);
    }
  };

  /* endregion */

  const GetMethod = (method: any) => {
    const methodArray = method.params;
    return (
      <Row>
        <Col>
          {methodArray.map((item: string) => {
            return (
              <Checkbox
                value={item}
                style={{
                  marginLeft: '10px',
                  // width: '150px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <Ellipsis title={item} width={150} placement={'bottomLeft'} color={'#108ee9'} />
              </Checkbox>
            );
          })}
        </Col>
      </Row>
    );
  };

  // 列的定义
  const columns = [
    {
      title: <span style={{ fontWeight: 'bold', fontSize: '17px' }}> 编号</span>,
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: <span style={{ fontWeight: 'bold', fontSize: '17px' }}> 模块</span>,
      key: 'module',
      width: 120,
      render: (text: any) => (
        <Space size="middle">
          <CheckboxGroup options={text.module} value={moduleList} onChange={onModuleChange} />
        </Space>
      ),
    },
    {
      title: <span style={{ fontWeight: 'bold', fontSize: '17px' }}> 方法</span>,
      key: 'method',
      render: (text: any) => (
        <Checkbox.Group value={methodList} onChange={onMethodChange}>
          <GetMethod params={text.method} />
        </Checkbox.Group>
      ),
    },
  ];

  // region 最终按钮功能
  // 保存权限按钮
  const saveAuthority = () => {
    // 1.获取当前角色id（用户组id）  上面已获取到
    const methodGroup: any = [];
    for (let index = 0; index < methodList.length; index += 1) {
      methodGroup.push(methodList[index]); // 将默认的数据添加到新数组中
    }

    const moduleGroup = [];
    for (let index = 0; index < moduleList.length; index += 1) {
      moduleGroup.push(moduleList[index]); // 将默认的数据添加到新数组中
    }

    const idArray = getselectedId(data, moduleGroup, methodGroup);

    // 2.获取已勾选的权限id
    axios
      .put(
        `/api/role/authority/${groupId}`,
        { data: idArray },
        { headers: { Authorization: `Bearer ${sys_accessToken}` } },
      )
      .then(function (res) {
        if (res.data.ok === true) {
          message.info({
            content: '权限保存成功！',
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
          if (initialState?.currentUser?.userid == 'LiuQing') {
            setUser();
          }
        } else if (Number(res.data.code) === 403) {
          message.error({
            content: '您无权限修改！',
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
        if (error.toString().includes('403')) {
          message.error({
            content: '您无权限修改！',
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        } else {
          message.error({
            content: `异常信息${error.toString()}`,
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        }
      });
  };

  // 点击返回按钮
  const returns = () => {
    history.push(`/authority/main`);
  };

  // endregion

  useEffect(() => {
    if (selectedAuthority !== undefined) {
      // console.log("selectedAuthority.methodData", selectedAuthority.moduleData);
      setMethodList(selectedAuthority.methodData);
      setModuleList(selectedAuthority.moduleData);
    }
  }, [selectedAuthority]);

  return (
    <PageContainer title={pageTitle} style={{ height: getHeight(), backgroundColor: '#F2F2F2' }}>
      {/* 表格控件 */}
      <div>
        <Table
          columns={columns}
          dataSource={oraData}
          pagination={false} // 禁止分页
          size="small" // 紧凑型
          bordered={true}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}></Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <Checkbox checked={checkAll} onChange={selectAll}>
                  全选
                </Checkbox>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <div>
                  <Button
                    type="primary"
                    style={{
                      display: judgeAuthority('修改权限组的人员') === true ? 'inline' : 'none',
                    }}
                    onClick={saveAuthority}
                  >
                    保存
                  </Button>
                  <Button onClick={returns}> 返回 </Button>
                </div>
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
              },
            };
          }}
        />
      </div>
    </PageContainer>
  );
};

export default AuthorityDetails;

import React, {useEffect, useState} from 'react';
import {PageContainer} from "@ant-design/pro-layout";
import {Button, Checkbox, Row, Col, Tree, message} from 'antd';
import {history} from "@@/core/history";
import {DownOutlined} from "@ant-design/icons";
import type {GqlClient} from "@/hooks";
import {useGqlClient} from "@/hooks";
import {useRequest} from "ahooks";
import axios from "axios";
import {judgeAuthority} from "@/publicMethods/authorityJudge";

const parTree = (oraData: any) => {

  const oldData = oraData.organization;

  // 更换Key
  const parentData = oldData.map((item: any) => {
    return {
      key: item.id,
      title: item.name,
      parent: item.parent
    };
  });

  const parents = parentData.filter((value: any) => value.parent === 'undefined' || value.parent === null || value.parent === 0);
  const children = parentData.filter((value: any) => value.parent !== 'undefined' && value.parent != null);
  const translator = (parentB: any, childrenB: any) => {
    parentB.forEach((parent: any) => {
      childrenB.forEach((current: any, index: any) => {
        if (current.parent === parent.key) {
          const temp: any = JSON.parse(JSON.stringify(childrenB));
          temp.splice(index, 1);
          translator([current], temp);

          if (typeof (parent.children) !== 'undefined') {
            parent.children.push(current);
          } else {
            // eslint-disable-next-line no-param-reassign
            parent.children = [current];
          }
        }
      });
    });
  };

  translator(parents, children);
  return parents;
};

const queryDeptment = async (client: GqlClient<object>) => {
  const {data} = await client.query(`
      {
        organization{
          organization{
            id
            name
            parent
            parentName
          }
        }
      }
  `);

  return parTree(data?.organization);
};

// 组里面已存在的有权限的成员
const alasSelectedUser = (oraDatas: any) => {
  const {users} = oraDatas[0];

  const seletecArray: any = [];
  users.forEach((user: any) => {
    seletecArray.push(user.userName);
  });

  return seletecArray;
};

const queryAuthUsers = async (client: GqlClient<object>, groupId: any) => {
  const {data} = await client.query(`
      {
        roleGroup (group:${groupId}){
          id,
          name,
          description,
          users{
            id,
            userName
          }
        }
      }
  `);
  return alasSelectedUser(data?.roleGroup);
};


const getAllusers = (oraData: any) => {
  const users = [];
  const userData = oraData.users;

  for (let index = 0; index < userData.length; index += 1) {
    users.push(userData[index].name);
  }
  return users;
};
const queryGroupAllUsers = async (client: GqlClient<object>, deptId: any) => {
  let users = Object();
  if (deptId === 0) {
    users = await client.query(`
      {
          organization{
          users{
            userid
            name
          }
        }
      }
  `);
  } else {
    users = await client.query(`
      {
          organization(dept:${deptId}){
          users{
            userid
            name
          }
        }
      }
  `);
  }

  return {nameArray: getAllusers(users.data.organization), idArray: users.data.organization.users};

};

// 组件初始化
const UserDetails: React.FC<any> = () => {

  // region title获取
  let pageTitle: string = '';
  let groupId = 0;
  const location = history.location.query;

  if (location !== null && location !== undefined && location.groupname !== undefined && location.groupname !== null) {
    pageTitle = location.groupname.toString();
    groupId = location.groupid === null ? 0 : Number(location.groupid);
  }

  // endregion

  /* region 获取默认显示的人员和组 */
  const gqlClient = useGqlClient();
  // 查询部门组织架构
  const treeDept = useRequest(() => queryDeptment(gqlClient)).data;

  // 查询组织架构对应的所有成员
  const allGroupMember: any = useRequest(() => queryGroupAllUsers(gqlClient, 0)).data;

  // 查询已勾选的成员
  const initSelectedUser: any = useRequest(() => queryAuthUsers(gqlClient, groupId)).data;


  /* endregion */

  /* region 部门树选择事件 */
  const [selectedUser, setSelectedUser] = useState(['']);
  const [allMember, setAllMember] = useState(['']);

  const onSelect = async (selectedKeys: any, info: any) => {
    console.log('selected', selectedKeys, info);
    const keys = selectedKeys[0];
    const deptMember = await queryGroupAllUsers(gqlClient, keys);
    setAllMember(deptMember.nameArray);
    setSelectedUser(initSelectedUser);

  };

  /* endregion */

  /* region 人员选择触发事件 */

  const userSelectChange = (checkedValues: any) => {

    setSelectedUser(checkedValues);
  };

  /* endregion */

  /* region 按钮点击事件 */
  const saveUsers = () => {
    const idData = allGroupMember.idArray;
    // 保存人员
    const idArray: any = [];

    // 将原有的人也一并加进去
    // const initUsers = initSelectedUser;
    // initUsers.forEach((eles: string) => {
    //   for (let index = 0; index < idData.length; index += 1) {
    //     const dets = idData[index];
    //     if (dets.name === eles) {
    //       idArray.push(dets.userid);
    //       break;
    //     }
    //   }
    // });


    selectedUser.forEach((eles: string) => {

      for (let index = 0; index < idData.length; index += 1) {
        const dets = idData[index];
        if (dets.name === eles) {
          idArray.push(dets.userid);
          break;
        }
      }
    });

    axios.put(`/api/role/user/${groupId}`, {data: idArray})
      .then(function (res) {
        if (res.data.ok === true) {
          message.info({
            content: "人员保存成功！",
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
        message.error({
          content: `连接异常${error.toString()}`,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      });

  };
  const returns = () => {
    history.push(`/authority/main`);
  };
  /* endregion */

  useEffect(() => {

    if (allGroupMember !== undefined) {
      setAllMember(allGroupMember.nameArray);
    }
    setSelectedUser(initSelectedUser);
  }, [initSelectedUser, allGroupMember]);

  return (
    <PageContainer title={pageTitle} style={{height: window.innerHeight - 100, backgroundColor: "white"}}>

      <div style={{}}>

        <Row gutter={16}>
          {/* 部门tree */}
          <Col span={6}
               style={{backgroundColor: "white"}}>

            <div>
              <Tree
                showLine
                switcherIcon={<DownOutlined/>}
                defaultExpandAll={true}
                onSelect={onSelect}
                treeData={treeDept}
                style={{
                  height: window.innerHeight - 250,
                  boxShadow: '-2px -2px 0px 0px #F2F2F2,2px 2px 0px 0px #F2F2F2'
                }} // 左 上
              />
            </div>

          </Col>

          {/* 组内成员 */}
          <Col span={18}
               style={{
                 height: window.innerHeight - 250,
                 backgroundColor: "white",
                 boxShadow: '-2px -2px 0px 0px #F2F2F2,2px 2px 0px 0px #F2F2F2'
               }}>
            <div>
              <div>
                <Checkbox.Group options={allMember} value={selectedUser} onChange={userSelectChange}/>
              </div>
              {/* <div style={{position: "absolute", bottom: 0}}> */}
              <div style={{
                marginLeft: "-6px",
                width: "100%",
                boxShadow: '-2px -2px 0px 0px #F2F2F2,2px 2px 0px 0px #F2F2F2',
                marginTop: "50px",
                backgroundColor: "#F2F2F2",
                position: "absolute",
                bottom: 0
              }}>
                <Button style={{display: judgeAuthority("修改权限组的人员") === true ? "inline" : "none"}}
                        type="primary" onClick={saveUsers}> 保存 </Button>
                <Button style={{marginLeft: "30px"}} type="primary" onClick={returns}> 返回 </Button>
              </div>
            </div>

          </Col>
        </Row>

      </div>
    </PageContainer>
  );
};

export default UserDetails;

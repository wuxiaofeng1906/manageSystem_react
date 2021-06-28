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
  const parentID: any = [];

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
          debugger;
          // if (current.title === "研发中心") {
          parentID.push(parent.key);

          // }
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

  return {dept: parents, deptId: parentID};
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
  const sys_accessToken = localStorage.getItem("accessId");
  axios.defaults.headers['Authorization'] = `Bearer ${sys_accessToken}`;

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

  // 组内人员
  const GetInGroupusers = () => {
    if (initSelectedUser === undefined) {
      return <label></label>;
    }

    return <Row>
      <Col>
        {
          initSelectedUser.map((item: string) => {
            return <Checkbox
              style={{
                width: "85px",
                marginLeft: "10px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
              value={item}>{item}</Checkbox>;
          })
        }
      </Col>
    </Row>;
  };

  // 组外人员
  const GetOutGroupusers = (params: any) => {

    if (params.users === undefined || params.users.length <= 1) {
      return <label></label>;
    }
    const arrays = params.users;
    if (initSelectedUser.length > 0) {
      // 要去除已选择的人员放到组内人员中去
      return <Row>
        <Col>
          {
            arrays.map((item: string) => {
              if (initSelectedUser.indexOf(item) === -1) {
                return <Checkbox
                  style={{
                    width: "85px",
                    marginLeft: "10px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                  value={item}>{item}
                </Checkbox>;
              }
              return <label></label>;
            })
          }
        </Col>
      </Row>;

    }

    return <Row>
      <Col>
        {
          arrays.map((item: string) => {

            return <Checkbox
              style={{
                width: "85px",
                marginLeft: "10px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
              value={item}>{item}</Checkbox>;
          })
        }
      </Col>
    </Row>;

  };


  /* endregion */

  /* region 部门树选择事件 */
  const [inGroupUser, setIngroupUser] = useState(['']);
  const [outGroupUser, setOutGroupUser] = useState(['']);
  const [selectDeptUser, setSelectDeptUser] = useState(['']);

  const onSelect = async (selectedKeys: any) => {
    // console.log('selected', selectedKeys, info);
    const keys = selectedKeys[0];
    const deptMember = await queryGroupAllUsers(gqlClient, keys);
    setSelectDeptUser(deptMember.nameArray);
    setIngroupUser(initSelectedUser);

  };

  /* endregion */

  /* region 人员选择触发事件 */

  // 组内人员出发
  const userInGroupSelectChange = (checkedValues: any) => {
    setIngroupUser(checkedValues);
  };

  // 组外人员触发
  const userOutGroupSelectChange = (checkedValues: any) => {
    setOutGroupUser(checkedValues);
  };


  /* endregion */

  /* region 按钮点击事件 */
  const saveUsers = () => {
    const idData = allGroupMember.idArray;
    // 保存人员
    const idArray: any = [];

    outGroupUser.forEach((eles: string) => {

      for (let index = 0; index < idData.length; index += 1) {
        const dets = idData[index];
        if (dets.name === eles) {
          idArray.push(dets.userid);
          break;
        }
      }
    });

    inGroupUser.forEach((eles: string) => {

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

    setSelectDeptUser(allGroupMember === undefined ? [] : allGroupMember.nameArray);
    setIngroupUser(initSelectedUser);
  }, [initSelectedUser, allGroupMember]);


  return (
    <PageContainer title={pageTitle} style={{height: window.innerHeight - 100, backgroundColor: "white"}}>

      <div style={{}}>

        <Row gutter={16}>
          {/* 部门tree */}
          <Col span={6} style={{backgroundColor: "white"}}>

            <div>
              <Tree
                height={600}
                showLine
                switcherIcon={<DownOutlined/>}
                onSelect={onSelect}
                treeData={treeDept?.dept}
                style={{
                  // boxShadow: '-2px -2px 0px 0px #F2F2F2,2px 2px 0px 0px #F2F2F2'
                }} // 左 上
                expandedKeys={treeDept?.deptId}   // 展开指定节点

              />{null}
            </div>

          </Col>

          {/* 组内成员 */}
          <Col span={18} style={{

            // height: window.innerHeight ,

            backgroundColor: "white",
            boxShadow: '-2px -2px 0px 0px #F2F2F2,2px 2px 0px 0px #F2F2F2'
          }}>

            {/* 组内成员 */}

            <Row style={{marginLeft: "-7px", width: "101%", backgroundColor: "#F2F2F2"}}>
              <Col span={2}>
                <label style={{fontWeight: "bold", marginLeft: "10px"}}> 组内用户</label>
              </Col>
              <Col span={22}>
                <Checkbox.Group onChange={userInGroupSelectChange} value={inGroupUser}>
                  <GetInGroupusers/>
                </Checkbox.Group>
              </Col>
            </Row>

            {/* 组外成员 */}

            <Row style={{marginTop: "20px", marginLeft: "-7px", width: "101%"}}>
              <Col span={2}>
                <label style={{fontWeight: "bold", marginLeft: "10px"}}> 组外用户</label>
              </Col>
              <Col span={22}>
                <Checkbox.Group onChange={userOutGroupSelectChange}>
                  <GetOutGroupusers users={selectDeptUser}/>
                </Checkbox.Group>

              </Col>
            </Row>

            <Row>
              <div style={{
                marginLeft: "-6px",
                width: "120%",
                marginTop: "20px",
                // boxShadow: '-2px -2px 0px 0px #F2F2F2,2px 2px 0px 0px #F2F2F2',
                backgroundColor: "#F2F2F2",

              }}>
                <Button style={{marginLeft: "40%", display: judgeAuthority("修改权限组的人员") === true ? "inline" : "none"}}
                        type="primary" onClick={saveUsers}> 保存 </Button>
                <Button style={{marginLeft: judgeAuthority("修改权限组的人员") === true ? "30px" : "40%"}} type="primary"
                        onClick={returns}> 返回 </Button>
              </div>
            </Row>

          </Col>
        </Row>

      </div>
    </PageContainer>
  );
};

export default UserDetails;

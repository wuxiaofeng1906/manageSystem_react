import React, {useRef} from 'react';
import {useRequest} from 'ahooks';
import {GqlClient, useGqlClient} from '@/hooks';
import {getHeight} from '@/publicMethods/pageSet';
import {PageContainer} from "@ant-design/pro-layout";
import {
  LockTwoTone,
  IdcardTwoTone,
  EditTwoTone,
  DeleteTwoTone,
  FolderAddTwoTone
} from '@ant-design/icons';

import {Table, Space, Button, Tooltip, message} from 'antd';

const authorityClick = (params: any) => {
  console.log("权限维护：", params);
};

const memberClick = (params: any) => {
  console.log("成员维护：", params);
};
const editClick = (params: any) => {
  console.log("编辑：", params);
};
const deleteClick = (params: any) => {
  console.log("删除：", params);
};
const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '组名',
    dataIndex: 'groupName',
    key: 'groupName',
  },
  {
    title: '描述',
    dataIndex: 'describe',
    key: 'describe',
  },
  {
    title: '用户列表',
    dataIndex: 'userList',
    key: 'userList',
  },
  {
    title: '操作',
    key: 'action',
    render: (text: any) => (

      <Space size="middle">
        <Tooltip title="权限维护">
          <Button shape="circle" icon={<LockTwoTone/>} onClick={() => authorityClick(text)}/>
        </Tooltip>
        <Tooltip title="成员维护">
          <Button shape="circle" icon={<IdcardTwoTone/>} onClick={() => memberClick(text)}/>
        </Tooltip>
        <Tooltip title="编辑">
          <Button shape="circle" icon={<EditTwoTone/>} onClick={() => editClick(text)}/>
        </Tooltip>
        <Tooltip title="删除">
          <Button shape="circle" icon={<DeleteTwoTone/>} onClick={() => deleteClick(text)}/>
        </Tooltip>
      </Space>
    ),
  },
];

const data = [
  {
    id: '1',
    groupName: '管理员',
    describe: '系统管理员',
    userList: '陈欢，胡玉，何江，谭杰，吴晓凤'
  },
  {
    id: '2',
    groupName: '研发',
    describe: '研发人员',
    userList: '邬波，那超，陈楷，王东帆，李昕宇，李小雷，胡小雯，丁鑫，欧兴扬，时新威，朱秀杰，刘学斌，张学鹏，贾洋，张燕茹，任毅，周毅，黄义森，杨小美，龙喻，刘云鹏，陈泽鹏，赵增辉，陈震华，郎志强，杨志强，许智远，王濯'
  }, {
    id: '3',
    groupName: '测试',
    describe: '测试人员',
    userList: '刘潮，徐超，胡志立，谭国治，王鹄，左江令，邓九洲，袁俊，胡李，冯林，周丽莎，刘梦，张倩，孟庆双，龚蓉蓉，罗天刚，自动化测试账号，陈雯静，帅霞，吴小兰，董绪瀚，徐睿，焦艳秋，赵宇飞，余志强，冯紫琳'
  }, {
    id: '4',
    groupName: '项目经理',
    describe: '项目经理',
    userList: '黄朝阳，曾晨，陈锴，王东帆，李昕宇，闫坤杰，郭俊，何羽，胡敬华，唐力，袁烈权，刘黎明，罗林，欧治成，任航，蒲姣，杨期成，吴生祥，雷远亮，郑江，蒋宗良，李小雷，欧兴扬，朱秀杰，刘学斌，张燕茹，任毅，杨小美，刘云鹏，赵增辉'
  },
];

// 组件初始化
const Authority: React.FC<any> = () => {

  const addGroup = () => {
    message.info({
      content: '新增组',
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  };

  return (
    <PageContainer style={{height: getHeight(), backgroundColor: "#F2F2F2"}}>
      <div style={{width: "100%", height: "40px", background: 'white'}}>
        <Button></Button>
        <Button type="text" style={{color: '#1890FF', float: 'right'}} icon={<FolderAddTwoTone/>}
                size={'large'} onClick={addGroup}>新增分组</Button>
      </div>

      <Table columns={columns} dataSource={data}
             pagination={false}  // 禁止分页
      />
    </PageContainer>
  );
};
export default Authority;

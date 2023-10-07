import React from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Avatar, List} from 'antd';


export default () => {
  const data = [
    {
      title: 'wxf',
      value: `我的博客地址：https://blog.csdn.net/WQearl`
    },
    {
      title: '小明',
      value: `我是一个粉刷匠,粉刷本领强,我要把那新房子,刷得很漂亮,刷了房顶又刷墙刷子像飞一样,哎呀我的小鼻子,变呀变了样。`
    },
    {
      title: '李华',
      value: `小兔子乖乖,把门儿开开,快点儿开开,我要进来,不开不开我不开,妈妈不回来,谁来也不开`
    },
    {
      title: '小李',
      value: `两只老虎,两只老虎,跑得快,跑得快,一只没有眼睛,一只没有尾巴,真奇怪,真奇怪`
    },

  ];


  return (
    <PageContainer>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}/>}
              title={<a href="https://ant.design">{item.title}</a>}
              description={item.value}
            />
          </List.Item>
        )}
      />
    </PageContainer>
  );
};


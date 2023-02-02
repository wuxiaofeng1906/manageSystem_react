import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {errorMessage, sucMessage} from '@/publicMethods/showMessages';
import {
  Button, Form, Input,
  Radio, Tabs, Divider, Layout
} from 'antd';
import {useParams} from "umi";
import {isEmpty} from "lodash";
import moment from "moment";
import {history} from "@@/core/history";
import style from '../style.less';

const {Header, Footer, Sider, Content} = Layout;
const {TextArea} = Input;
const {TabPane} = Tabs;

const PopupCard: React.FC<any> = (props: any) => {

  const {isCarousel, count} = useParams() as { isCarousel: string; count: string };
  //carousel 大于0
  if (isCarousel === "true") {

  } else {

  }

  return (

    <PageContainer>
      <div style={{marginTop: -15, background: 'white', padding: 10}}>

        <Divider/>
        <Footer style={{height: 70, backgroundColor: "white", marginTop: -20}}>
          <div id={"message"}>
            <Button className={style.saveButtonStyle} type="primary" style={{marginLeft: 10}}>保存</Button>
            <Button className={style.commonBtn} style={{marginLeft: 10}}>一键发布</Button>
            <Button className={style.commonBtn} style={{marginLeft: 10}}>预览</Button>
            <Button className={style.commonBtn} style={{marginLeft: 10}}
                    onClick={() => history.push(`/onlineSystem/announcementDetail/1/1/false/true`)}>上一步</Button>
          </div>
        </Footer>
      </div>
    </PageContainer>
  );
};


export default PopupCard;

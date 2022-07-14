import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {errorMessage} from '@/publicMethods/showMessages';
import {Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select} from 'antd';
// import './style/style.css';
import {useRequest} from 'ahooks';
import {loadDutyNamesSelect} from '@/pages/onDutyAndRelease/preRelease/comControl/controler';




const Announce: React.FC<any> = (props: any) => {

  const onlineReleaseNum = props.location?.query?.onlineReleaseNum; // 正式发布列表的数据

  const dutyNameArray = useRequest(() => loadDutyNamesSelect(true)).data; // 关联值班名单

  return (
    <PageContainer>
      <div style={{marginTop: -15}}>

      </div>
    </PageContainer>
  );
};

export default Announce;

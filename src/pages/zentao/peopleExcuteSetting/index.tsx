import React, {useEffect, useRef, useState} from 'react';
import {useModel} from "@@/plugin-model/useModel";
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {
  Button,
  message,
  Form,
  Select,
  Modal,
  Input,
  Divider,
  Spin
} from 'antd';

import {getHeight} from '@/publicMethods/pageSet';
import axios from 'axios';
import dayjs from "dayjs";

const {Option} = Select;

// 查询数据


// 组件初始化
const PeopleExcuteSetting: React.FC<any> = () => {


  return (
    <PageContainer>


    </PageContainer>
  );
};


export default PeopleExcuteSetting;

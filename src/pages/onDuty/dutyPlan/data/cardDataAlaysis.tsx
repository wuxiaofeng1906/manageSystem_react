// 解析数据
const parseData = (params: any) => {
  const returnValue: any = [];
  if (params) {
    params.forEach((project: any) => {
      const projectItemArray: any = [];
      const projectItem_Front = {
        person_num: '',
        user_tech: '',
        user_name: '',
        duty_start_time: '',
        duty_end_time: '',
        duty_order: '',
      };
      const projectItem_Backend = {
        person_num: '',
        user_tech: '',
        user_name: '',
        duty_start_time: '',
        duty_end_time: '',
        duty_order: '',
      };
      const projectItem_Test = {
        person_num: '',
        user_tech: '',
        user_name: '',
        duty_start_time: '',
        duty_end_time: '',
        duty_order: '',
      };
      const projectItem_Flow = {
        person_num: '',
        user_tech: '流程',
        user_name: '',
        duty_start_time: '',
        duty_end_time: '',
        duty_order: '',
      };
      const projectItem_SQA = {
        person_num: '',
        user_tech: 'SQA',
        user_name: '',
        duty_start_time: '',
        duty_end_time: '',
        duty_order: '',
      };
      const projectItem_global = {
        person_num: '',
        user_tech: 'global',
        user_name: '',
        duty_start_time: '',
        duty_end_time: '',
        duty_order: '',
      };
      const projectItem_openApi = {
        person_num: '',
        user_tech: 'openApi&qtms',
        user_name: '',
        duty_start_time: '',
        duty_end_time: '',
        duty_order: '',
      };
      const projectItem_qbos_store = {
        person_num: '',
        user_tech: 'qbos&store',
        user_name: '',
        duty_start_time: '',
        duty_end_time: '',
        duty_order: '',
      };
      const projectItem_jsf = {
        person_num: '',
        user_tech: 'jsf',
        user_name: '',
        duty_start_time: '',
        duty_end_time: '',
        duty_order: '',
      };
      const projectItem_devops = {
        person_num: '',
        user_tech: '运维',
        user_name: '',
        duty_start_time: '',
        duty_end_time: '',
        duty_order: '',
      };
      const projectItem_emitter = {
        person_num: '',
        user_tech: 'emitter',
        user_name: '',
        duty_start_time: '',
        duty_end_time: '',
        duty_order: '',
      };
      const projectItem_idps = {
        person_num: '',
        user_tech: 'idps',
        user_name: '',
        duty_start_time: '',
        duty_end_time: '',
        duty_order: '',
      };
      project.forEach((ele: any, index: number) => {
        const username = ele.user_name === null ? '' : ele.user_name;
        switch (ele.user_tech) {
          case '前端':
            projectItem_Front.person_num = ele.person_num;
            projectItem_Front.user_tech = ele.user_tech;
            projectItem_Front.duty_start_time = ele.duty_start_time;
            projectItem_Front.duty_end_time = ele.duty_end_time;
            projectItem_Front.duty_order = ele.duty_order;
            if (ele.duty_order === '1') {
              projectItem_Front.user_name =
                projectItem_Front.user_name === ''
                  ? username
                  : `${username}/${projectItem_Front.user_name}`;
            } else {
              projectItem_Front.user_name =
                projectItem_Front.user_name === ''
                  ? username
                  : `${projectItem_Front.user_name}/${username}`;
            }
            break;
          case '后端':
            projectItem_Backend.person_num = ele.person_num;
            projectItem_Backend.user_tech = ele.user_tech;
            projectItem_Backend.duty_start_time = ele.duty_start_time;
            projectItem_Backend.duty_end_time = ele.duty_end_time;
            projectItem_Backend.duty_order = ele.duty_order;
            if (ele.duty_order === '1') {
              projectItem_Backend.user_name =
                projectItem_Backend.user_name === ''
                  ? username
                  : `${username}/${projectItem_Backend.user_name}`;
            } else {
              projectItem_Backend.user_name =
                projectItem_Backend.user_name === ''
                  ? username
                  : `${projectItem_Backend.user_name}/${username}`;
            }
            break;
          case '测试':
            projectItem_Test.person_num = ele.person_num;
            projectItem_Test.user_tech = ele.user_tech;
            projectItem_Test.duty_start_time = ele.duty_start_time;
            projectItem_Test.duty_end_time = ele.duty_end_time;
            projectItem_Test.duty_order = ele.duty_order;
            if (ele.duty_order === '1') {
              projectItem_Test.user_name =
                projectItem_Test.user_name === ''
                  ? username
                  : `${username}/${projectItem_Test.user_name}`;
            } else {
              projectItem_Test.user_name =
                projectItem_Test.user_name === ''
                  ? username
                  : `${projectItem_Test.user_name}/${username}`;
            }
            break;
          case '流程':
            projectItem_Flow.person_num = ele.person_num;
            projectItem_Flow.user_tech = ele.user_tech;
            projectItem_Flow.duty_start_time = ele.duty_start_time;
            projectItem_Flow.duty_end_time = ele.duty_end_time;
            projectItem_Flow.duty_order = ele.duty_order;
            if (ele.duty_order === '1') {
              projectItem_Flow.user_name =
                projectItem_Flow.user_name === ''
                  ? username
                  : `${username}/${projectItem_Flow.user_name}`;
            } else {
              projectItem_Flow.user_name =
                projectItem_Flow.user_name === ''
                  ? username
                  : `${projectItem_Flow.user_name}/${username}`;
            }
            break;
          case 'SQA':
            projectItem_SQA.person_num = ele.person_num;
            projectItem_SQA.user_tech = ele.user_tech;
            projectItem_SQA.duty_start_time = ele.duty_start_time;
            projectItem_SQA.duty_end_time = ele.duty_end_time;
            projectItem_SQA.duty_order = ele.duty_order;
            if (ele.duty_order === '1') {
              projectItem_SQA.user_name =
                projectItem_SQA.user_name === ''
                  ? username
                  : `${username}/${projectItem_SQA.user_name}`;
            } else {
              projectItem_SQA.user_name =
                projectItem_SQA.user_name === ''
                  ? username
                  : `${projectItem_SQA.user_name}/${username}`;
            }
            break;
          case 'global':
            projectItem_global.person_num = ele.person_num;
            projectItem_global.user_tech = ele.user_tech;
            projectItem_global.duty_start_time = ele.duty_start_time;
            projectItem_global.duty_end_time = ele.duty_end_time;
            projectItem_global.duty_order = ele.duty_order;
            if (ele.duty_order === '1') {
              projectItem_global.user_name =
                projectItem_global.user_name === ''
                  ? username
                  : `${username}/${projectItem_global.user_name}`;
            } else {
              projectItem_global.user_name =
                projectItem_global.user_name === ''
                  ? username
                  : `${projectItem_global.user_name}/${username}`;
            }
            break;
          case 'openapi':
            projectItem_openApi.person_num = ele.person_num;
            // projectItem_openApi.user_tech = ele.user_tech;
            projectItem_openApi.duty_start_time = ele.duty_start_time;
            projectItem_openApi.duty_end_time = ele.duty_end_time;
            projectItem_openApi.duty_order = ele.duty_order;
            if (ele.duty_order === '1') {
              projectItem_openApi.user_name =
                projectItem_openApi.user_name === ''
                  ? username
                  : `${username}/${projectItem_openApi.user_name}`;
            } else {
              projectItem_openApi.user_name =
                projectItem_openApi.user_name === ''
                  ? username
                  : `${projectItem_openApi.user_name}/${username}`;
            }
            break;
          case 'qbos与store':
            projectItem_qbos_store.person_num = ele.person_num;
            projectItem_qbos_store.user_tech = 'qbos&store';
            projectItem_qbos_store.duty_start_time = ele.duty_start_time;
            projectItem_qbos_store.duty_end_time = ele.duty_end_time;
            projectItem_qbos_store.duty_order = ele.duty_order;
            if (ele.duty_order === '1') {
              projectItem_qbos_store.user_name =
                projectItem_qbos_store.user_name === ''
                  ? username
                  : `${username}/${projectItem_qbos_store.user_name}`;
            } else {
              projectItem_qbos_store.user_name =
                projectItem_qbos_store.user_name === ''
                  ? username
                  : `${projectItem_qbos_store.user_name}/${username}`;
            }
            break;
          case 'jsf':
            projectItem_jsf.person_num = ele.person_num;
            projectItem_jsf.user_tech = ele.user_tech;
            projectItem_jsf.duty_start_time = ele.duty_start_time;
            projectItem_jsf.duty_end_time = ele.duty_end_time;
            projectItem_jsf.duty_order = ele.duty_order;
            if (ele.duty_order === '1') {
              projectItem_jsf.user_name =
                projectItem_jsf.user_name === ''
                  ? username
                  : `${username}/${projectItem_jsf.user_name}`;
            } else {
              projectItem_jsf.user_name =
                projectItem_jsf.user_name === ''
                  ? username
                  : `${projectItem_jsf.user_name}/${username}`;
            }
            break;
          case '运维':
            projectItem_devops.person_num = ele.person_num;
            projectItem_devops.user_tech = ele.user_tech;
            projectItem_devops.duty_start_time = ele.duty_start_time;
            projectItem_devops.duty_end_time = ele.duty_end_time;
            projectItem_devops.duty_order = ele.duty_order;
            if (ele.duty_order === '1') {
              projectItem_devops.user_name =
                projectItem_devops.user_name === ''
                  ? username
                  : `${username}/${projectItem_devops.user_name}`;
            } else {
              projectItem_devops.user_name =
                projectItem_devops.user_name === ''
                  ? username
                  : `${projectItem_devops.user_name}/${username}`;
            }
            break;
          case 'emitter':
            projectItem_emitter.person_num = ele.person_num;
            projectItem_emitter.user_tech = ele.user_tech;
            projectItem_emitter.duty_start_time = ele.duty_start_time;
            projectItem_emitter.duty_end_time = ele.duty_end_time;
            projectItem_emitter.duty_order = ele.duty_order;
            if (ele.duty_order === '1') {
              projectItem_emitter.user_name =
                projectItem_emitter.user_name === ''
                  ? username
                  : `${username}/${projectItem_emitter.user_name}`;
            } else {
              projectItem_emitter.user_name =
                projectItem_emitter.user_name === ''
                  ? username
                  : `${projectItem_emitter.user_name}/${username}`;
            }
            break;
          case 'idps':
            projectItem_idps.person_num = ele.person_num;
            projectItem_idps.user_tech = ele.user_tech;
            projectItem_idps.duty_start_time = ele.duty_start_time;
            projectItem_idps.duty_end_time = ele.duty_end_time;
            projectItem_idps.duty_order = ele.duty_order;
            if (ele.duty_order === '1') {
              projectItem_idps.user_name =
                projectItem_idps.user_name === ''
                  ? username
                  : `${username}/${projectItem_idps.user_name}`;
            } else {
              projectItem_idps.user_name =
                projectItem_idps.user_name === ''
                  ? username
                  : `${projectItem_idps.user_name}/${username}`;
            }
            break;
          default:
            break;
        }

        if (index === project.length - 1) {
          projectItemArray.push(projectItem_Front);
          projectItemArray.push(projectItem_Backend);
          projectItemArray.push(projectItem_Test);
          projectItemArray.push(projectItem_Flow);
          projectItemArray.push(projectItem_devops);
          projectItemArray.push(projectItem_SQA);
          projectItemArray.push(projectItem_global);
          projectItemArray.push(projectItem_openApi);
          projectItemArray.push(projectItem_qbos_store);
          projectItemArray.push(projectItem_jsf);
          projectItemArray.push(projectItem_emitter);
          projectItemArray.push(projectItem_idps);
        }
      });
      returnValue.push(projectItemArray);
    });
  }

  return returnValue;
};

const parseSaveCardData = (data: any, oldDutyTask: any, startTime: string, endTime: string) => {
  const person_data_array: any = [];

  const {
    firstFront,
    secondFront,
    firstBackend,
    secondBackend,
    firstTester,
    secondTester,
    firstFlow,
    secondFlow,
    firstSQA,
    secondSQA,
    firstJsf,
    secondJsf,
    firstGlobal,
    secondGlobal,
    firstOpenApil,
    secondOpenApi,
    firstQbosStore,
    secondQbosStore,
    firstDevops,
    secondDevops,
    firstEmitter,
    secondEmitter,
    firstIdps,
    secondIdps,
  } = data;

  // 前端第一值班人
  person_data_array.push({
    peron_num: oldDutyTask.personNum, // 值班编号id 例如：202111190002
    duty_start_time: startTime,
    duty_end_time: endTime,
    person_id: oldDutyTask.firstFrontId, // 序号 id
    user_id: firstFront === null ? '' : firstFront.split('&')[0], // 用户id
    user_name: firstFront === null ? '' : firstFront.split('&')[1], // 用户名
    user_tech: '1', // 前端还是后端
    duty_order: '1', // 第几值班人
  });

  // 前端第二值班人
  person_data_array.push({
    peron_num: oldDutyTask.personNum,
    duty_start_time: startTime,
    duty_end_time: endTime,
    person_id: oldDutyTask.secondFrontId,
    user_id: secondFront === null ? '' : secondFront.split('&')[0],
    user_name: secondFront === null ? '' : secondFront.split('&')[1],
    user_tech: '1',
    duty_order: '2',
  });

  // 后端第一值班人
  person_data_array.push({
    peron_num: oldDutyTask.personNum,
    duty_start_time: startTime,
    duty_end_time: endTime,
    person_id: oldDutyTask.firstBackendId,
    user_id: firstBackend === null ? '' : firstBackend.split('&')[0],
    user_name: firstBackend === null ? '' : firstBackend.split('&')[1],
    user_tech: '2',
    duty_order: '1',
  });

  // 后端第二值班人
  person_data_array.push({
    peron_num: oldDutyTask.personNum,
    duty_start_time: startTime,
    duty_end_time: endTime,
    person_id: oldDutyTask.secondBackendId,
    user_id: secondBackend === null ? '' : secondBackend.split('&')[0],
    user_name: secondBackend === null ? '' : secondBackend.split('&')[1],
    user_tech: '2',
    duty_order: '2',
  });

  // 测试第一值班人
  person_data_array.push({
    peron_num: oldDutyTask.personNum,
    duty_start_time: startTime,
    duty_end_time: endTime,
    person_id: oldDutyTask.firstTesterId,
    user_id: firstTester === null ? '' : firstTester.split('&')[0],
    user_name: firstTester === null ? '' : firstTester.split('&')[1],
    user_tech: '3',
    duty_order: '1',
  });

  // 测试第二值班人
  person_data_array.push({
    peron_num: oldDutyTask.personNum,
    duty_start_time: startTime,
    duty_end_time: endTime,
    person_id: oldDutyTask.secondTesterId,
    user_id: secondTester === null ? '' : secondTester.split('&')[0],
    user_name: secondTester === null ? '' : secondTester.split('&')[1],
    user_tech: '3',
    duty_order: '2',
  });

  // 流程第一值班人
  person_data_array.push({
    peron_num: oldDutyTask.personNum,
    duty_start_time: startTime,
    duty_end_time: endTime,
    person_id: oldDutyTask.firstFlowId,
    user_id: firstFlow === null ? '' : firstFlow.split('&')[0],
    user_name: firstFlow === null ? '' : firstFlow.split('&')[1],
    user_tech: '6',
    duty_order: '1',
  });

  // 流程第二值班人
  person_data_array.push({
    peron_num: oldDutyTask.personNum,
    duty_start_time: startTime,
    duty_end_time: endTime,
    person_id: oldDutyTask.secondFlowId,
    user_id: secondFlow === null ? '' : secondFlow.split('&')[0],
    user_name: secondFlow === null ? '' : secondFlow.split('&')[1],
    user_tech: '6',
    duty_order: '2',
  });

  // SQA第一值班人
  person_data_array.push({
    peron_num: oldDutyTask.personNum,
    duty_start_time: startTime,
    duty_end_time: endTime,
    person_id: oldDutyTask.firstSQAId,
    user_id: firstSQA === null ? '' : firstSQA.split('&')[0],
    user_name: firstSQA === null ? '' : firstSQA.split('&')[1],
    user_tech: '7',
    duty_order: '1',
  });

  // SQA第二值班人
  person_data_array.push({
    peron_num: oldDutyTask.personNum,
    duty_start_time: startTime,
    duty_end_time: endTime,
    person_id: oldDutyTask.secondSQAId,
    user_id: secondSQA === null ? '' : secondSQA.split('&')[0],
    user_name: secondSQA === null ? '' : secondSQA.split('&')[1],
    user_tech: '7',
    duty_order: '2',
  });

  // global第一值班人
  person_data_array.push({
    peron_num: oldDutyTask.personNum,
    duty_start_time: startTime,
    duty_end_time: endTime,
    person_id: oldDutyTask.firstGlobalId,
    user_id: firstGlobal === null ? '' : firstGlobal.split('&')[0],
    user_name: firstGlobal === null ? '' : firstGlobal.split('&')[1],
    user_tech: '8',
    duty_order: '1',
  });

  // global第二值班人
  person_data_array.push({
    peron_num: oldDutyTask.personNum,
    duty_start_time: startTime,
    duty_end_time: endTime,
    person_id: oldDutyTask.secondGlobalId,
    user_id: secondGlobal === null ? '' : secondGlobal.split('&')[0],
    user_name: secondGlobal === null ? '' : secondGlobal.split('&')[1],
    user_tech: '8',
    duty_order: '2',
  });

  // openApi第一值班人
  person_data_array.push({
    peron_num: oldDutyTask.personNum,
    duty_start_time: startTime,
    duty_end_time: endTime,
    person_id: oldDutyTask.firstOpenApiId,
    user_id: firstOpenApil === null ? '' : firstOpenApil.split('&')[0],
    user_name: firstOpenApil === null ? '' : firstOpenApil.split('&')[1],
    user_tech: '10',
    duty_order: '1',
  });

  // openApi第二值班人
  person_data_array.push({
    peron_num: oldDutyTask.personNum,
    duty_start_time: startTime,
    duty_end_time: endTime,
    person_id: oldDutyTask.secondOpenApiId,
    user_id: secondOpenApi === null ? '' : secondOpenApi.split('&')[0],
    user_name: secondOpenApi === null ? '' : secondOpenApi.split('&')[1],
    user_tech: '10',
    duty_order: '2',
  });

  // qbos&store第一值班人
  person_data_array.push({
    peron_num: oldDutyTask.personNum,
    duty_start_time: startTime,
    duty_end_time: endTime,
    person_id: oldDutyTask.firstQbosStoreId,
    user_id: firstQbosStore === null ? '' : firstQbosStore.split('&')[0],
    user_name: firstQbosStore === null ? '' : firstQbosStore.split('&')[1],
    user_tech: '11',
    duty_order: '1',
  });

  // qbos&store第二值班人
  person_data_array.push({
    peron_num: oldDutyTask.personNum,
    duty_start_time: startTime,
    duty_end_time: endTime,
    person_id: oldDutyTask.secondQbosStoreId,
    user_id: secondQbosStore === null ? '' : secondQbosStore.split('&')[0],
    user_name: secondQbosStore === null ? '' : secondQbosStore.split('&')[1],
    user_tech: '11',
    duty_order: '2',
  });

  // jsf第一值班人
  person_data_array.push({
    peron_num: oldDutyTask.personNum,
    duty_start_time: startTime,
    duty_end_time: endTime,
    person_id: oldDutyTask.firstJsfId,
    user_id: firstJsf === null ? '' : firstJsf.split('&')[0],
    user_name: firstJsf === null ? '' : firstJsf.split('&')[1],
    user_tech: '12',
    duty_order: '1',
  });

  // jsf第二值班人
  person_data_array.push({
    peron_num: oldDutyTask.personNum,
    duty_start_time: startTime,
    duty_end_time: endTime,
    person_id: oldDutyTask.secondJsfId,
    user_id: secondJsf === null ? '' : secondJsf.split('&')[0],
    user_name: secondJsf === null ? '' : secondJsf.split('&')[1],
    user_tech: '12',
    duty_order: '2',
  });

  // 运维第一值班人
  person_data_array.push({
    peron_num: oldDutyTask.personNum,
    duty_start_time: startTime,
    duty_end_time: endTime,
    person_id: oldDutyTask.firstDevopsId,
    user_id: firstDevops === null ? '' : firstDevops?.split('&')[0],
    user_name: firstDevops === null ? '' : firstDevops?.split('&')[1],
    user_tech: '13',
    duty_order: '1',
  });

  // 运维第二值班人
  person_data_array.push({
    peron_num: oldDutyTask.personNum,
    duty_start_time: startTime,
    duty_end_time: endTime,
    person_id: oldDutyTask.secondDevopsId,
    user_id: secondDevops === null ? '' : secondDevops?.split('&')[0],
    user_name: secondDevops === null ? '' : secondDevops?.split('&')[1],
    user_tech: '13',
    duty_order: '2',
  });
  // emitter
  person_data_array.push(
    {
      peron_num: oldDutyTask.personNum,
      duty_start_time: startTime,
      duty_end_time: endTime,
      person_id: oldDutyTask.firstEmitterId,
      user_id: firstEmitter === null ? '' : firstEmitter?.split('&')[0],
      user_name: firstEmitter === null ? '' : firstEmitter?.split('&')[1],
      user_tech: '14',
      duty_order: '1',
    },
    {
      peron_num: oldDutyTask.personNum,
      duty_start_time: startTime,
      duty_end_time: endTime,
      person_id: oldDutyTask.secondEmitterId,
      user_id: secondEmitter === null ? '' : secondEmitter?.split('&')[0],
      user_name: secondEmitter === null ? '' : secondEmitter?.split('&')[1],
      user_tech: '14',
      duty_order: '2',
    },
  );

  // idps
  person_data_array.push(
    {
      peron_num: oldDutyTask.personNum,
      duty_start_time: startTime,
      duty_end_time: endTime,
      person_id: oldDutyTask.firstIdpsId,
      user_id: firstIdps === null ? '' : firstIdps?.split('&')[0],
      user_name: firstIdps === null ? '' : firstIdps?.split('&')[1],
      user_tech: '15',
      duty_order: '1',
    },
    {
      peron_num: oldDutyTask.personNum,
      duty_start_time: startTime,
      duty_end_time: endTime,
      person_id: oldDutyTask.secondIdpsId,
      user_id: secondIdps === null ? '' : secondIdps?.split('&')[0],
      user_name: secondIdps === null ? '' : secondIdps?.split('&')[1],
      user_tech: '15',
      duty_order: '2',
    },
  );
  return person_data_array;
};

export {parseData, parseSaveCardData};

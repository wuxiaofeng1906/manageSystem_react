
// 解析数据
const parseData = (params: any) => {

  const returnValue: any = [];
  if (params) {
    params.forEach((project: any) => {
      const projectItemArray: any = [];
      const projectItem_Front = {
        person_num: "",
        user_tech: "",
        user_name: "",
        duty_start_time: "",
        duty_end_time: "",
        duty_order: ""
      };
      const projectItem_Backend = {
        person_num: "",
        user_tech: "",
        user_name: "",
        duty_start_time: "",
        duty_end_time: "",
        duty_order: ""
      };
      const projectItem_Test = {
        person_num: "",
        user_tech: "",
        user_name: "",
        duty_start_time: "",
        duty_end_time: "",
        duty_order: ""
      };
      const projectItem_Flow = {
        person_num: "",
        user_tech: "流程",
        user_name: "",
        duty_start_time: "",
        duty_end_time: "",
        duty_order: ""
      };
      const projectItem_SQA = {
        person_num: "",
        user_tech: "SQA",
        user_name: "",
        duty_start_time: "",
        duty_end_time: "",
        duty_order: ""
      };
      const projectItem_global = {
        person_num: "",
        user_tech: "global",
        user_name: "",
        duty_start_time: "",
        duty_end_time: "",
        duty_order: ""
      };
      const projectItem_openApi = {
        person_num: "",
        user_tech: "openApi",
        user_name: "",
        duty_start_time: "",
        duty_end_time: "",
        duty_order: ""
      };
      const projectItem_qbos_store = {
        person_num: "",
        user_tech: "qbos&store",
        user_name: "",
        duty_start_time: "",
        duty_end_time: "",
        duty_order: ""
      };
      const projectItem_jsf = {
        person_num: "",
        user_tech: "jsf",
        user_name: "",
        duty_start_time: "",
        duty_end_time: "",
        duty_order: ""
      };
      project.forEach((ele: any, index: number) => {
        const username = ele.user_name === null ? "" : ele.user_name;
        switch (ele.user_tech) {
          case "前端":
            projectItem_Front.person_num = ele.person_num;
            projectItem_Front.user_tech = ele.user_tech;
            projectItem_Front.duty_start_time = ele.duty_start_time;
            projectItem_Front.duty_end_time = ele.duty_end_time;
            projectItem_Front.duty_order = ele.duty_order;
            if (ele.duty_order === "1") {
              projectItem_Front.user_name = projectItem_Front.user_name === "" ? username : `${username}/${projectItem_Front.user_name}`;

            } else {
              projectItem_Front.user_name = projectItem_Front.user_name === "" ? username : `${projectItem_Front.user_name}/${username}`;
            }
            break;
          case "后端":
            projectItem_Backend.person_num = ele.person_num;
            projectItem_Backend.user_tech = ele.user_tech;
            projectItem_Backend.duty_start_time = ele.duty_start_time;
            projectItem_Backend.duty_end_time = ele.duty_end_time;
            projectItem_Backend.duty_order = ele.duty_order;
            if (ele.duty_order === "1") {
              projectItem_Backend.user_name = projectItem_Backend.user_name === "" ? username : `${username}/${projectItem_Backend.user_name}`;

            } else {
              projectItem_Backend.user_name = projectItem_Backend.user_name === "" ? username : `${projectItem_Backend.user_name}/${username}`;
            }
            break;
          case "测试":
            projectItem_Test.person_num = ele.person_num;
            projectItem_Test.user_tech = ele.user_tech;
            projectItem_Test.duty_start_time = ele.duty_start_time;
            projectItem_Test.duty_end_time = ele.duty_end_time;
            projectItem_Test.duty_order = ele.duty_order;
            if (ele.duty_order === "1") {
              projectItem_Test.user_name = projectItem_Test.user_name === "" ? username : `${username}/${projectItem_Test.user_name}`;

            } else {
              projectItem_Test.user_name = projectItem_Test.user_name === "" ? username : `${projectItem_Test.user_name}/${username}`;
            }
            break;
          case "流程":
            projectItem_Flow.person_num = ele.person_num;
            projectItem_Flow.user_tech = ele.user_tech;
            projectItem_Flow.duty_start_time = ele.duty_start_time;
            projectItem_Flow.duty_end_time = ele.duty_end_time;
            projectItem_Flow.duty_order = ele.duty_order;
            if (ele.duty_order === "1") {
              projectItem_Flow.user_name = projectItem_Flow.user_name === "" ? username : `${username}/${projectItem_Flow.user_name}`;

            } else {
              projectItem_Flow.user_name = projectItem_Flow.user_name === "" ? username : `${projectItem_Flow.user_name}/${username}`;
            }
            break;
          case "SQA":
            projectItem_SQA.person_num = ele.person_num;
            projectItem_SQA.user_tech = ele.user_tech;
            projectItem_SQA.duty_start_time = ele.duty_start_time;
            projectItem_SQA.duty_end_time = ele.duty_end_time;
            projectItem_SQA.duty_order = ele.duty_order;
            if (ele.duty_order === "1") {
              projectItem_SQA.user_name = projectItem_SQA.user_name === "" ? username : `${username}/${projectItem_SQA.user_name}`;

            } else {
              projectItem_SQA.user_name = projectItem_SQA.user_name === "" ? username : `${projectItem_SQA.user_name}/${username}`;
            }
            break;
          case "global":
            projectItem_global.person_num = ele.person_num;
            projectItem_global.user_tech = ele.user_tech;
            projectItem_global.duty_start_time = ele.duty_start_time;
            projectItem_global.duty_end_time = ele.duty_end_time;
            projectItem_global.duty_order = ele.duty_order;
            if (ele.duty_order === "1") {
              projectItem_global.user_name = projectItem_global.user_name === "" ? username : `${username}/${projectItem_global.user_name}`;

            } else {
              projectItem_global.user_name = projectItem_global.user_name === "" ? username : `${projectItem_global.user_name}/${username}`;
            }
            break;
          case "openapi":
            projectItem_openApi.person_num = ele.person_num;
            projectItem_openApi.user_tech = ele.user_tech;
            projectItem_openApi.duty_start_time = ele.duty_start_time;
            projectItem_openApi.duty_end_time = ele.duty_end_time;
            projectItem_openApi.duty_order = ele.duty_order;
            if (ele.duty_order === "1") {
              projectItem_openApi.user_name = projectItem_openApi.user_name === "" ? username : `${username}/${projectItem_openApi.user_name}`;

            } else {
              projectItem_openApi.user_name = projectItem_openApi.user_name === "" ? username : `${projectItem_openApi.user_name}/${username}`;
            }
            break;
          case "qbos与store":
            projectItem_qbos_store.person_num = ele.person_num;
            projectItem_qbos_store.user_tech = "qbos&store";
            projectItem_qbos_store.duty_start_time = ele.duty_start_time;
            projectItem_qbos_store.duty_end_time = ele.duty_end_time;
            projectItem_qbos_store.duty_order = ele.duty_order;
            if (ele.duty_order === "1") {
              projectItem_qbos_store.user_name = projectItem_qbos_store.user_name === "" ? username : `${username}/${projectItem_qbos_store.user_name}`;

            } else {
              projectItem_qbos_store.user_name = projectItem_qbos_store.user_name === "" ? username : `${projectItem_qbos_store.user_name}/${username}`;
            }
            break;
          case "jsf":
            projectItem_jsf.person_num = ele.person_num;
            projectItem_jsf.user_tech = ele.user_tech;
            projectItem_jsf.duty_start_time = ele.duty_start_time;
            projectItem_jsf.duty_end_time = ele.duty_end_time;
            projectItem_jsf.duty_order = ele.duty_order;
            if (ele.duty_order === "1") {
              projectItem_jsf.user_name = projectItem_jsf.user_name === "" ? username : `${username}/${projectItem_jsf.user_name}`;

            } else {
              projectItem_jsf.user_name = projectItem_jsf.user_name === "" ? username : `${projectItem_jsf.user_name}/${username}`;
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
          projectItemArray.push(projectItem_SQA);
          projectItemArray.push(projectItem_global);
          projectItemArray.push(projectItem_openApi);
          projectItemArray.push(projectItem_qbos_store);
          projectItemArray.push(projectItem_jsf);
        }
      });
      returnValue.push(projectItemArray);
    });

  }

  return returnValue;
}
export {parseData}

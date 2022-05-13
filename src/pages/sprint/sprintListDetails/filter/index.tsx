import {Select} from 'antd';
import {GqlClient} from "@/hooks";

const {Option} = Select;

// 解析成树形数据
const getCenterTree = (parentData: any) => {
  const parents = parentData.filter((value: any) => value.parent === 'undefined' || value.parent === null || value.parent === 1);
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


  return parents
};

// 对应部门和个数：  如果是测试部门，就看统计【测试】字段的值；如果是开发部门，则先看解决人/完成人。如果解决人为空，就看指派给。
const getDeptAndCount = (dept: any, gridData: any) => {

  const deptData = dept.organization;
  const deptCountData: any = [];
  deptData.forEach((item: any) => {
    let final_count = 0;
    gridData.forEach((rows: any) => {
      console.log(rows);
    });

    deptCountData.push({
      key: item.id,
      title: item.name,
      parent: item.parent,
      value: item.id,
      count: final_count
    });
  });

  return deptCountData;
};

const devCenterDept = async (client: GqlClient<object>, gridData: any) => {
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

  const deptCountArray = getDeptAndCount(data?.organization, gridData);
  const deptArray = getCenterTree(deptCountArray);
  const devCenter: any = [];
  if (deptArray && deptArray.length > 0) {
    deptArray.forEach((ele: any) => {
      if (ele.key === 59) {
        devCenter.push(ele);
      }
    });
  }
  return devCenter;
};

// 阶段的下拉框数据
const getStageOption = (gridData: any) => {

  if (!gridData || gridData.length === 0) {
    return [];
  }

  const count = {
    count_1: 0,
    count_2: 0,
    count_3: 0,
    count_4: 0,
    count_5: 0,
    count_6: 0,
    count_7: 0,
    count_8: 0,
    count_9: 0,
    count_10: 0,
    count_11: 0,
    count_12: 0
  };

  gridData.forEach((rows: any) => {

    switch (rows.stage) {
      case 1:  // stage = "未开始";
        count.count_1 += 1;
        break;
      case 2: //  stage = "开发中";
        count.count_2 += 1;
        break;
      case 3: //  stage = "开发完";
        count.count_3 += 1;
        break;
      case 4: // stage = "已提测";
        count.count_4 += 1;
        break;
      case 5:  // stage = "测试中";
        count.count_5 += 1;
        break;
      case 6:  //  stage = "TE测试环境已验过";
        count.count_6 += 1;
        break;
      case 7:   // stage = "UED测试环境已验过";
        count.count_7 += 1;
        break;
      case 8:   //  stage = "已取消";
        count.count_8 += 1;
        break;
      case 9:  // stage = "开发已revert";
        count.count_9 += 1;
        break;
      case 10: // stage = "测试已验证revert";
        count.count_10 += 1;
        break;
      case 11:  //  stage = "灰度已验过";
        count.count_11 += 1;
        break;
      case 12:  //  stage = "线上已验过";
        count.count_12 += 1;
        break;

      default:
        break;
    }
  });

  return [
    <Option key={1} value={1}>未开始({count.count_1})</Option>,
    <Option key={2} value={2}>开发中({count.count_2})</Option>,
    <Option key={3} value={3}>开发完({count.count_3})</Option>,
    <Option key={4} value={4}>已提测({count.count_4})</Option>,
    <Option key={5} value={5}>测试中({count.count_5})</Option>,
    <Option key={6} value={6}>TE测试环境已验过({count.count_6})</Option>,
    <Option key={7} value={7}>UED测试环境已验过({count.count_7})</Option>,
    <Option key={8} value={8}>已取消({count.count_8})</Option>,
    <Option key={9} value={9}>开发已revert({count.count_9})</Option>,
    <Option key={10} value={10}>测试已验证revert({count.count_10})</Option>,
    <Option key={11} value={11}>灰度已验过({count.count_11})</Option>,
    <Option key={12} value={12}>线上已验过({count.count_12})</Option>
  ];
};

// 类型下拉框
const getTypeOption = (gridData: any) => {
  if (!gridData || gridData.length === 0) {
    return [];
  }
  const count = {
    count_bug: 0,
    count_task: 0,
    count_story: 0,
    count_b_story: 0,
  };
  gridData.forEach((rows: any) => {
    const {category} = rows;
    if (category === "1") {  // type = "Bug";
      count.count_bug += 1;
    } else if (category === "2") {   //   type = "Task";
      count.count_task += 1;
    } else if (category === "3" && rows.fromBug === 0) {   //   type = "Story";
      count.count_story += 1;
    } else if (category === "-3") {   //   type = "Story";
      count.count_b_story += 1;
    }
  });

  return [
    <Option key={"1"} value={"bug"}>Bug({count.count_bug})</Option>,
    <Option key={"2"} value={"task"}>Task({count.count_task})</Option>,
    <Option key={"3"} value={"story"}>Story({count.count_story})</Option>,
    <Option key={"-3"} value={"B_story"}>B_Story({count.count_b_story})</Option>,
  ];
};

/* 指派给、测试、解决人下拉框中的值就显示最初数据中的名字即可，不拿取全部研发中心人员。 */

// 指派给下拉框
const getAssignedToOption = (personName: any, gridData: any) => {

  const optionArray: any = [];
  personName.forEach((name: string) => {
    let count = 0;
    gridData.forEach((rows: any) => {
      let assignedTo = (rows.assignedTo)?.name;
      if (!assignedTo) {
        assignedTo = "";
      }
      if (name === assignedTo) {
        count += 1;
      }
    });
    const person = name === "" ? "空" : name;
    if (person === "空" || person === "closed") {  // 空值显示在最前面
      optionArray.unshift(<Option key={name} value={name}>{person}({count})</Option>);
    } else {
      optionArray.push(<Option key={name} value={name}>{person}({count})</Option>);
    }

  });

  return optionArray;
};

// 测试下拉框
const getTesterOption = (personName: any, gridData: any) => {

  const optionArray: any = [];
  personName.forEach((name: string) => {
    let count = 0;
    gridData.forEach((rows: any) => {
      const testrArray = rows.tester;
      if (testrArray && testrArray.length > 0) {
        testrArray.forEach((ele: any) => {
          if (ele.name === name) {
            count += 1;
          }
        });
      } else if (name === "NA") { // 没有数据的话则
        count += 1;
      }
    });
    const person = name === "NA" ? "NA" : name;
    if (person === "NA") {  // 空值显示在最前面
      optionArray.unshift(<Option key={name} value={name}>{person}({count})</Option>);
    } else {
      optionArray.push(<Option key={name} value={name}>{person}({count})</Option>);
    }
  });

  return optionArray;
};

// 由谁解决
const getSolvedByOption = (personName: any, gridData: any) => {
  const optionArray: any = [];
  personName.forEach((name: string) => {
    let count = 0;
    gridData.forEach((rows: any) => {
      let finishedBy = (rows.finishedBy)?.name;
      if (!finishedBy) {
        finishedBy = "";
      }
      if (finishedBy === name) {
        count += 1;
      }
    });
    const person = name === "" ? "空" : name;
    if (person === "空") {  // 空值显示在最前面
      optionArray.unshift(<Option key={name} value={name}>{person}({count})</Option>);
    } else {
      optionArray.push(<Option key={name} value={name}>{person}({count})</Option>);
    }
  });

  return optionArray;
};

// 过滤部门数据： 如果是测试部门，就看统计【测试】字段的值；如果是开发部门，则先看解决人/完成人。如果解决人为空，就看指派给。
const filterDeptData = (dept: any, oraData: any) => {
  debugger;
  let filterDeptResult: any = [];
  if (!dept || dept.length === 0) {
    filterDeptResult = [...oraData];
  } else {
    dept.forEach(() => {
      oraData.forEach(() => {

      });
    })
  }
  return filterDeptResult;
};

// 过滤阶段数据
const filterStageData = (stage: any, oraData: any) => {
  let filterStageResult: any = [];
  if (!stage || stage.length === 0) {
    filterStageResult = [...oraData];
  } else {
    stage.forEach((ele: any) => {
      oraData.forEach((row: any) => {
        if (ele === row.stage) {
          filterStageResult.push(row);
        }
      });
    })
  }

  return filterStageResult;
};

// 过滤类型
const filterTypesData = (types: any, oraData: any) => {
  let filterTypesResult: any = [];
  if (!types || types.length === 0) {
    filterTypesResult = [...oraData];
  } else {
    types.forEach((ele: any) => {
      oraData.forEach((row: any) => {
        let rowsType = "";
        const {category, fromBug} = row;
        if (category === "1") {  // type = "Bug";
          rowsType = "bug";
        } else if (category === "2") {   //   type = "Task";
          rowsType = "task";
        } else if (category === "3" && fromBug === 0) {   //   type = "Story";
          rowsType = "story";
        } else if (category === "-3") {   //   type = "b_Story";
          rowsType = "B_story";
        }

        if (ele === rowsType) {
          filterTypesResult.push(row);
        }
      });
    })
  }
  return filterTypesResult;
};

// 过滤指派给
const filterAssignedData = (assignedTo: any, oraData: any) => {
  let filterAssignedResult: any = [];
  if (!assignedTo || assignedTo.length === 0) {
    filterAssignedResult = [...oraData];
  } else {
    assignedTo.forEach((ele: any) => {
      oraData.forEach((row: any) => {
        const assignedT = row.assignedTo === null ? "" : (row.assignedTo).name;
        if (ele === assignedT) {
          filterAssignedResult.push(row);
        }
      });
    })
  }
  return filterAssignedResult;
};

// 过滤测试
const filterTesterData = (test: any, oraData: any) => {
  let filterTestResult: any = [];
  const filterTestID: any = [];
  if (!test || test.length === 0) {
    filterTestResult = [...oraData];
  } else {
    oraData.forEach((row: any) => {
      const gridTester = row.tester;
      const testerStr: any = [];
      if (gridTester && gridTester.length > 0) {
        gridTester.forEach((testers: any) => {
          testerStr.push(testers.name);
        });
        test.forEach((ele: any) => {
          if (testerStr.includes(ele)) {
            // 重复的数据不添加
            if (!filterTestID.includes(row.ztNo)) {
              filterTestID.push(row.ztNo);
              filterTestResult.push(row);
            }
          }
        })
      }
    });
  }
  return filterTestResult;
};

// 过滤解决/已完成
const filterSolvedData = (solved: any, oraData: any) => {
  let filterSolvedResult: any = [];
  if (!solved || solved.length === 0) {
    filterSolvedResult = [...oraData];
  } else {
    solved.forEach((ele: any) => {
      oraData.forEach((row: any) => {
        const finishedB = row.finishedBy === null ? "" : (row.finishedBy).name;
        if (ele === finishedB) {
          filterSolvedResult.push(row);
        }
      });
    })
  }
  return filterSolvedResult;
};

// 对表格中的数据进行条件过滤
const filterDatasByCondition = (condition: any, oraData: any) => {
  debugger;
  if (!oraData || oraData.length === 0) {
    return [];
  }
  const {dept, stage, types, assignedTo, test, solved} = condition;

  // 过滤所属部门
  let filteredResult = filterDeptData(dept, oraData);
  // 过滤所属阶段
  filteredResult = filterStageData(stage, filteredResult);
  // 过滤类型
  filteredResult = filterTypesData(types, filteredResult);
  // 过滤指派给
  filteredResult = filterAssignedData(assignedTo, filteredResult);
  // 过滤测试
  filteredResult = filterTesterData(test, filteredResult);
  // 过滤解决/已完成
  filteredResult = filterSolvedData(solved, filteredResult);

  return filteredResult;
};

export {
  devCenterDept, getStageOption, getTypeOption, getAssignedToOption,
  getTesterOption, getSolvedByOption, filterDatasByCondition
};

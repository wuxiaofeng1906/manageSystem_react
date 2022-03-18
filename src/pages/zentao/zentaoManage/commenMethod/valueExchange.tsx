import {
  requestAddType, requestAssignedTo, requestPriorityApi,
  requestTaskTypeApi, requestSideApi, requestTaskSourceApi
} from './reauestApi';

/* region  转换增加类型 */

// ID转Value
const convertAddTypeToValue = async () => {

  const sourceData = await requestAddType();
  if (!sourceData || sourceData.length === 0) {
    return {};
  }

  const returnType = {};
  sourceData.forEach((types: any) => {
    returnType[types.task_type] = types.task_type_name;
  });
  return returnType;
};

// value转ID
const convertAddTypeToID = async () => {
  const sourceData = await requestAddType();
  if (!sourceData || sourceData.length === 0) {
    return {};
  }

  const returnType = {};
  sourceData.forEach((types: any) => {
    returnType[types.task_type_name] = types.task_type;
  });
  return returnType;

};


/* endregion  转换增加类型 */

/* region  转换禅道ID人名 */

// ID转Value
const convertUsersToValue = async () => {

  const sourceData = await requestAssignedTo();
  if (!sourceData || sourceData.length === 0) {
    return {};
  }

  const returnValue = {};
  sourceData.forEach((types: any) => {
    returnValue[types.account] = types.realname;
  });
  return returnValue;
};

// value转ID
const convertUsersToID = async () => {
  const sourceData = await requestAssignedTo();
  if (!sourceData || sourceData.length === 0) {
    return {};
  }

  const returnValue = {};
  sourceData.forEach((types: any) => {
    returnValue[types.realname] = types.account;
  });
  return returnValue;

};


/* endregion  转换增加类型 */

/* region  转换任务类型 */

// ID转Value
const convertTaskTypeToValue = async () => {

  const sourceData = await requestTaskTypeApi();
  if (!sourceData || sourceData.length === 0) {
    return {};
  }

  const returnValue = {};
  sourceData.forEach((types: any) => {
    returnValue[types.task_type] = types.task_type_name;
  });
  return returnValue;
};

// value转ID
const convertTaskTypeToID = async () => {
  const sourceData = await requestTaskTypeApi();
  if (!sourceData || sourceData.length === 0) {
    return {};
  }

  const returnValue = {};
  sourceData.forEach((types: any) => {
    returnValue[types.task_type_name] = types.task_type;
  });
  return returnValue;

};


/* endregion  转换增加类型 */

/* region  转换所属端 */

// ID转Value
const convertSideToValue = async () => {

  const sourceData = await requestSideApi();
  if (!sourceData || sourceData.length === 0) {
    return {};
  }

  const returnValue = {};
  sourceData.forEach((types: any) => {
    returnValue[types.belongs] = types.belongs_name;
  });
  return returnValue;
};

// value转ID
const convertSideToID = async () => {
  const sourceData = await requestSideApi();
  if (!sourceData || sourceData.length === 0) {
    return {};
  }

  const returnValue = {};
  sourceData.forEach((types: any) => {
    returnValue[types.belongs_name] = types.belongs;
  });
  return returnValue;

};


/* endregion  转换增加类型 */

/* region  转换所属端 */

// ID转Value
const convertTaskSourceToValue = async () => {

  const sourceData = await requestTaskSourceApi();
  if (!sourceData || sourceData.length === 0) {
    return {};
  }

  const returnValue = {};
  sourceData.forEach((types: any) => {
    returnValue[types.task_source] = types.task_source_name;
  });
  return returnValue;
};

// value转ID
const convertTaskSourceToID = async () => {
  const sourceData = await requestTaskSourceApi();
  if (!sourceData || sourceData.length === 0) {
    return {};
  }

  const returnValue = {};
  sourceData.forEach((types: any) => {
    returnValue[types.task_source_name] = types.task_source;
  });
  return returnValue;

};


/* endregion  转换增加类型 */

export {convertAddTypeToID, convertUsersToID, convertTaskTypeToID,convertSideToID,convertTaskSourceToID}

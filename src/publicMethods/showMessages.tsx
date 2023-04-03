import {message} from "antd";

// 错误信息
const errorMessage = (errMsg: string, dutationTime: number = 1.5, position: string = '50vh') => {
  message.error({
    content: errMsg,
    duration: dutationTime,
    style: {
      marginTop: position,
    },
  });
};

// 提示信息
const infoMessage = (infoMsg: string, dutationTime: number = 1.5) => {
  message.info({
    content: infoMsg,
    duration: dutationTime,
    style: {
      marginTop: '50vh',
    },
  });
};

// 成功信息
const sucMessage = (sucMsg: string, dutationTime: number = 1.5) => {
  message.success({
    content: sucMsg,
    duration: dutationTime,
    style: {
      marginTop: '50vh',
    },
  });
};

// 警告信息
const warnMessage = (warningMsg: string, dutationTime: number = 1.5) => {
  message.warning({
    content: warningMsg,
    duration: dutationTime,
    style: {
      marginTop: '50vh',
    },
  });
};

export {errorMessage, infoMessage, sucMessage, warnMessage}

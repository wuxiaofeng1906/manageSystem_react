import {message} from "antd";

// 错误信息
const errorMessage = (errMsg: string) => {
  message.error({
    content: errMsg,
    duration: 1.5,
    style: {
      marginTop: '50vh',
    },
  });
};

// 提示信息
const infoMessage = (infoMsg: string) => {
  message.info({
    content: infoMsg,
    duration: 1.5,
    style: {
      marginTop: '50vh',
    },
  });
};

// 成功信息
const sucMessage = (sucMsg: string) => {
  message.success({
    content: sucMsg,
    duration: 1.5,
    style: {
      marginTop: '50vh',
    },
  });
};

// 警告信息
const warnMessage = (warningMsg: string) => {
  message.warning({
    content: warningMsg,
    duration: 1.5,
    style: {
      marginTop: '50vh',
    },
  });
};

export {errorMessage, infoMessage, sucMessage, warnMessage}

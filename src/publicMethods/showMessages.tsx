import {message} from "antd";


interface Iparam {
  type: string; // 提示类型
  msg: string; // 展示信息
  dutationTime?: number; // 展示的时间长度
  position?: string; // 展示的位置：50vh 是居中展示

}

// 自定义错误信息展示
export const customMessage = ({type = "info", msg = "错误", dutationTime = 1.5, position = '50vh'}: Iparam) => {

  const msgConfig = {
    content: msg,
    duration: dutationTime,
    style: {
      marginTop: position,
    },
  }

  switch (type) {
    case "error":
      message.error(msgConfig);
      break;

    case "info":
      message.info(msgConfig);
      break;

    case "success":
      message.success(msgConfig);
      break;

    case "warn":
      message.warning(msgConfig);
      break;

    default:
      break;
  }
};


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

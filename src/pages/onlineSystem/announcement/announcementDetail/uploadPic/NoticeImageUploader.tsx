import {axiosPost_77Service, axiosGet_77Service} from '@/publicMethods/axios';

export const getS3Key = async (fileName: string) => {
  const result = await axiosGet_77Service(`/identity/Attachment/signature/post`, {
    fileName: fileName,
    isPublicRead: "true",
    isHttp: "true"
  });
  return result;
};

// 上传图片到上s3服务器
export const uploadPicToS3 = async (s3Data: any, picFile: any) => {

  debugger
  const fileReader = new FileReader();  // 通过FileReader对象读取文件
  fileReader.readAsDataURL(picFile.originFileObj); // 图片、文字、需要用不同的转换，
  let result;

  new Promise((returnValue, reject) => {
    fileReader.onload = async (event: any) => {
      const picFlow = event.target?.result;
      const data = {...s3Data.fields};
      data["file"] = picFlow;
      result = await axiosPost_77Service(`/postImage/cn-northwest-1-q7link-test`, data);
      returnValue(result);
    };
  });

  // console.log(result)
  // http://s3.cn-northwest-1.amazonaws.com.cn/cn-northwest-1-q7link-test
  // const result = await axiosPost_77Service(`/postImage/cn-northwest-1-q7link-test`, data);
  // return result;
};





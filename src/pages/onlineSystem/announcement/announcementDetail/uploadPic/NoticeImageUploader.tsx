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

  const fileReader = new FileReader();  // 通过FileReader对象读取文件
  fileReader.readAsDataURL(picFile.originFileObj);
  let result;
  var formdata = new FormData();

  const data = {...s3Data.fields};
  formdata.append("x-amz-date", data["x-amz-date"]);
  formdata.append("x-amz-signature", data["x-amz-signature"]);
  formdata.append("x-amz-meta-extension", data["x-amz-meta-extension"]);
  formdata.append("Content-Disposition", data["Content-Disposition"]);
  formdata.append("x-amz-meta-name", data["x-amz-meta-name"]);
  formdata.append("acl", data["acl"]);
  formdata.append("key", data["key"]);
  formdata.append("x-amz-algorithm", data["x-amz-algorithm"]);
  formdata.append("x-amz-credential", data["x-amz-credential"]);
  formdata.append("Content-Type", data["Content-Type"]);
  formdata.append("policy", data["policy"]);
  // 获取二进制文件
  fileReader.onload = async (event: any) => {
    formdata.append("file", event.target?.result);
    debugger
    result = await axiosPost_77Service(`/postImage/cn-northwest-1-q7link-test`, formdata);

  };


  // console.log(result)
  // http://s3.cn-northwest-1.amazonaws.com.cn/cn-northwest-1-q7link-test
  // const result = await axiosPost_77Service(`/postImage/cn-northwest-1-q7link-test`, data);
  // return result;
};





import {axiosGet_TJ, axiosGet_77Service} from '@/publicMethods/axios';

export const getS3Key = async (fileName: string) => {
  const result = await axiosGet_77Service(`/identity/Attachment/signature/post`, {
    fileName: fileName,
    isPublicRead: "true",
    isHttp: "true"
  });
  return result;
};






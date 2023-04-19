export const Notice_Env_Query = "hotfix-aws-1-global"; // GQL 查询的环境
export const Notice_Env = "hotfix-aws-1"; // 传给后端的环境
export const Notice_Common = `http://identity.${Notice_Env_Query}.e7link.com/`;   // 上传图片之前的鉴权获取，以及公告GQL查询
export const Notice_ImageView = "http://s3.cn-northwest-1.amazonaws.com.cn/cn-northwest-1-q7link-test/"; // 图片上传后，通过这个链接拼接上传后的图片ID就可以访问到图片。
export const Notice_PostImage = "http://s3.cn-northwest-1.amazonaws.com.cn/";   // 将选中的图片发送到该地址对应的服务器
// export const Notice_Preview = "https://app.77hub.com/cn-global/login";   // 公告预览预览环境

export const Notice_PreviewEnv = "http://ops.q7link.com:8080/api/qqsystem/busenv/?page=1&limit=1000";


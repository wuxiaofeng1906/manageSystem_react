export const imgUrlHeader = "http://s3.cn-northwest-1.amazonaws.com.cn/cn-northwest-1-q7link-test/"
export const defaultImgsUrl = [
  "0/2023/03/0b2feb96-0295-4e2b-8179-1326ff072625.jpg",
  "0/2023/03/7e413865-f78d-4dff-be2c-8e5ff1cd3f46.jpg",
  "0/2023/03/4bef829b-a368-47ab-bc34-5701fa6d0be1.jpg",
  "0/2023/03/8249dc6c-bab6-4304-b037-054e2bcf7dda.jpg"
];

export const bannerTips = '图片支持jpg、jpeg、png等图片格式, 比例将自动为你裁剪为2.35：1，图片的大小不超过10M';
export const picType: any = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/svg", "image/psd"];


// 通过选择的图片ID和布局来判定传给后端哪一张图片   1:上下布局，2：左右布局
export const getImageToBackend = (imgId: string, laout: string) => {

  let resultIgm = "";
  switch (imgId) {
    case "0/2023/03/0b2feb96-0295-4e2b-8179-1326ff072625.jpg":
      resultIgm = laout === "1" ? "0/2023/03/4088f8aa-423f-4e74-85e9-e3c5ff5f88fc.png" : "0/2023/03/42d57b16-78ab-444b-923e-fa2d5213fe19.png";
      break;
    case "0/2023/03/7e413865-f78d-4dff-be2c-8e5ff1cd3f46.jpg":
      resultIgm = laout === "1" ? "0/2023/03/9103625c-5d0d-4c2a-9a3f-9a4640c77feb.png" : "0/2023/03/9e24c058-4754-480a-a548-6c96da642b70.png";
      break;
    case "0/2023/03/4bef829b-a368-47ab-bc34-5701fa6d0be1.jpg":
      resultIgm = laout === "1" ? "0/2023/03/1f9414e8-02f8-4f10-b2a0-5b60d87bb7af.png" : "0/2023/03/8f062779-bb59-46c7-944d-85bf0eb39ae7.png";
      break;
    case "0/2023/03/8249dc6c-bab6-4304-b037-054e2bcf7dda.jpg":
      resultIgm = laout === "1" ? "0/2023/03/1be0bcc8-6e6a-4a2e-861c-69976189f9dd.png" : "0/2023/03/955009c8-63c9-40c0-93ba-223c4724efaf.png";
      break;
    default:
      break;
  }

  return resultIgm;
};

// 通过后端的传给前端的图片来判定前端展示的图片是哪张
export const getImageForFront = (imgId: string) => {

  let resultIgm = "";
  switch (imgId) {

    case "0/2023/03/4088f8aa-423f-4e74-85e9-e3c5ff5f88fc.png":
    case "0/2023/03/42d57b16-78ab-444b-923e-fa2d5213fe19.png":
      resultIgm = "0/2023/03/0b2feb96-0295-4e2b-8179-1326ff072625.jpg";
      break;

    case "0/2023/03/9103625c-5d0d-4c2a-9a3f-9a4640c77feb.png":
    case "0/2023/03/9e24c058-4754-480a-a548-6c96da642b70.png":
      resultIgm = "0/2023/03/7e413865-f78d-4dff-be2c-8e5ff1cd3f46.jpg";
      break;

    case "0/2023/03/1f9414e8-02f8-4f10-b2a0-5b60d87bb7af.png":
    case  "0/2023/03/8f062779-bb59-46c7-944d-85bf0eb39ae7.png":
      resultIgm = "0/2023/03/4bef829b-a368-47ab-bc34-5701fa6d0be1.jpg";
      break;

    case "0/2023/03/1be0bcc8-6e6a-4a2e-861c-69976189f9dd.png":
    case  "0/2023/03/955009c8-63c9-40c0-93ba-223c4724efaf.png":
      resultIgm = "0/2023/03/8249dc6c-bab6-4304-b037-054e2bcf7dda.jpg";
      break;

    default:
      break;
  }

  return resultIgm;
};

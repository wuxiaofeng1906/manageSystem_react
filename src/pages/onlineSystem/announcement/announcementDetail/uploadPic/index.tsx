export const imgUrlHeader = "http://s3.cn-northwest-1.amazonaws.com.cn/cn-northwest-1-q7link-test/"
export const defaultImgsUrl = [
  "0/2023/03/0b2feb96-0295-4e2b-8179-1326ff072625.jpg",
  "0/2023/03/7e413865-f78d-4dff-be2c-8e5ff1cd3f46.jpg",
  "0/2023/03/4bef829b-a368-47ab-bc34-5701fa6d0be1.jpg",
  "0/2023/03/8249dc6c-bab6-4304-b037-054e2bcf7dda.jpg"
];

export const bannerTips = '图片支持jpg、jpeg、png等图片格式, 比例将自动为你裁剪为2.35：1，图片的大小不超过10M';
export const picType: any = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/svg", "image/psd"];

// 1:上下布局，2：左右布局
const imagUrl = [{
  "0/2023/03/0b2feb96-0295-4e2b-8179-1326ff072625.jpg": [{1: "0/2023/03/d6b5d9ff-f07e-4583-b4f4-7ab1f26f3abd.png"}, {2: "0/2023/03/c77e384f-6600-4fda-af94-81a647d8a08d.png"}],
  "0/2023/03/7e413865-f78d-4dff-be2c-8e5ff1cd3f46.jpg": [{1: "0/2023/03/9cf12f70-9746-4eb9-9094-acf77a54c4e7.png"}, {2: "0/2023/03/bf467b85-c07e-48ed-9fe5-6c31aca63b79.png"}],
  "0/2023/03/4bef829b-a368-47ab-bc34-5701fa6d0be1.jpg": [{1: "0/2023/03/9ad4986d-c47e-4699-a9f0-904878e97c73.png"}, {2: "0/2023/03/26b222ba-b1a6-4bcb-9548-8c0202fb51d0.png"}],
  "0/2023/03/8249dc6c-bab6-4304-b037-054e2bcf7dda.jpg": [{1: "0/2023/03/b1c4dd17-3505-40e5-9c1c-c22be50dc071.png"}, {2: "0/2023/03/da3b5224-ae5e-4849-8a5d-24ceec716dee.png"}]
}];

// 通过选择的图片ID和布局来判定传给后端哪一张图片   1:上下布局，2：左右布局
export const getImageToBackend = (imgId: string, laout: string) => {

  let resultIgm = "";
  switch (imgId) {
    case "0/2023/03/0b2feb96-0295-4e2b-8179-1326ff072625.jpg":
      resultIgm = laout === "1" ? "0/2023/03/d6b5d9ff-f07e-4583-b4f4-7ab1f26f3abd.png" : "0/2023/03/c77e384f-6600-4fda-af94-81a647d8a08d.png";
      break;
    case "0/2023/03/7e413865-f78d-4dff-be2c-8e5ff1cd3f46.jpg":
      resultIgm = laout === "1" ? "0/2023/03/9cf12f70-9746-4eb9-9094-acf77a54c4e7.png" : "0/2023/03/bf467b85-c07e-48ed-9fe5-6c31aca63b79.png";
      break;
    case "0/2023/03/4bef829b-a368-47ab-bc34-5701fa6d0be1.jpg":
      resultIgm = laout === "1" ? "0/2023/03/9ad4986d-c47e-4699-a9f0-904878e97c73.png" : "0/2023/03/26b222ba-b1a6-4bcb-9548-8c0202fb51d0.png";
      break;
    case "0/2023/03/8249dc6c-bab6-4304-b037-054e2bcf7dda.jpg":
      resultIgm = laout === "1" ? "0/2023/03/b1c4dd17-3505-40e5-9c1c-c22be50dc071.png" : "0/2023/03/da3b5224-ae5e-4849-8a5d-24ceec716dee.png";
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

    case "0/2023/03/d6b5d9ff-f07e-4583-b4f4-7ab1f26f3abd.png":
    case "0/2023/03/c77e384f-6600-4fda-af94-81a647d8a08d.png":
      resultIgm = "0/2023/03/0b2feb96-0295-4e2b-8179-1326ff072625.jpg";
      break;

    case "0/2023/03/9cf12f70-9746-4eb9-9094-acf77a54c4e7.png":
    case "0/2023/03/bf467b85-c07e-48ed-9fe5-6c31aca63b79.png":
      resultIgm = "0/2023/03/7e413865-f78d-4dff-be2c-8e5ff1cd3f46.jpg";
      break;

    case "0/2023/03/9ad4986d-c47e-4699-a9f0-904878e97c73.png":
    case  "0/2023/03/26b222ba-b1a6-4bcb-9548-8c0202fb51d0.png":
      resultIgm = "0/2023/03/4bef829b-a368-47ab-bc34-5701fa6d0be1.jpg";
      break;

    case "0/2023/03/b1c4dd17-3505-40e5-9c1c-c22be50dc071.png":
    case  "0/2023/03/da3b5224-ae5e-4849-8a5d-24ceec716dee.png":
      resultIgm = "0/2023/03/8249dc6c-bab6-4304-b037-054e2bcf7dda.jpg";
      break;

    default:
      break;
  }

  return resultIgm;
};

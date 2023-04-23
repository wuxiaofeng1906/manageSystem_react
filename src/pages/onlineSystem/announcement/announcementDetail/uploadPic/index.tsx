// export const imgUrlHeader = "http://s3.cn-northwest-1.amazonaws.com.cn/cn-northwest-1-q7link-test/"
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
      resultIgm = laout === "1" ? "0/2023/04/4177803e-79f5-443e-bd87-cace079abb63.png" : "0/2023/04/c32620da-2be3-43ab-a17b-0edd23727898.png";
      break;
    case "0/2023/03/7e413865-f78d-4dff-be2c-8e5ff1cd3f46.jpg":
      resultIgm = laout === "1" ? "0/2023/04/f923f318-9b57-40af-914e-3a19e266f0bd.png" : "0/2023/04/4558d410-b557-4e5e-942e-1371dbf86602.png";
      break;
    case "0/2023/03/4bef829b-a368-47ab-bc34-5701fa6d0be1.jpg":
      resultIgm = laout === "1" ? "0/2023/04/fef2f7ab-0a91-4bf3-aaf3-9336b2aadbc9.png" : "0/2023/04/9f9ff3d9-506b-487d-a0bf-e0c4a086f7e3.png";
      break;
    case "0/2023/03/8249dc6c-bab6-4304-b037-054e2bcf7dda.jpg":
      resultIgm = laout === "1" ? "0/2023/04/78c3649f-6fdb-41e2-9be6-ee5355c49b06.png" : "0/2023/04/89891198-8286-40e6-ba88-ff6ce62d473c.png";
      break;
    default:
      resultIgm = imgId; // 手动上传的图片没有对应的后端图片
      break;
  }

  return resultIgm;
};

// 通过后端的传给前端的图片来判定前端展示的图片是哪张
export const getImageForFront = (imgId: string) => {

  let resultIgm = "";
  switch (imgId) {

    case "0/2023/04/4177803e-79f5-443e-bd87-cace079abb63.png":
    case "0/2023/04/c32620da-2be3-43ab-a17b-0edd23727898.png":
      resultIgm = "0/2023/03/0b2feb96-0295-4e2b-8179-1326ff072625.jpg";
      break;

    case "0/2023/04/f923f318-9b57-40af-914e-3a19e266f0bd.png":
    case "0/2023/04/4558d410-b557-4e5e-942e-1371dbf86602.png":
      resultIgm = "0/2023/03/7e413865-f78d-4dff-be2c-8e5ff1cd3f46.jpg";
      break;

    case "0/2023/04/fef2f7ab-0a91-4bf3-aaf3-9336b2aadbc9.png":
    case  "0/2023/04/9f9ff3d9-506b-487d-a0bf-e0c4a086f7e3.png":
      resultIgm = "0/2023/03/4bef829b-a368-47ab-bc34-5701fa6d0be1.jpg";
      break;

    case "0/2023/04/78c3649f-6fdb-41e2-9be6-ee5355c49b06.png":
    case  "0/2023/04/89891198-8286-40e6-ba88-ff6ce62d473c.png":
      resultIgm = "0/2023/03/8249dc6c-bab6-4304-b037-054e2bcf7dda.jpg";
      break;

    default:
      resultIgm = imgId; // 手动上传的图片没有对应的后端图片
      break;
  }

  return resultIgm;
};
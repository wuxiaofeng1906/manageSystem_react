export const picType: any = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/svg", "image/psd"];

// 获取默认图片
export const getDefaultImg = () => {

  if (location.origin.includes('rd.q7link.com')) {
    return [
      "public/2023/05/a2957334-035d-4f40-abfc-166787baf2d6.jpg",
      "public/2023/05/c13e1c55-0e10-46f0-90f1-4f0b625324e6.jpg",
      "public/2023/05/fe680877-4146-49c7-b82a-6d08035f12e9.jpg",
      "public/2023/05/9aff7379-c31e-42e6-9e0b-abd440fff29c.jpg"
    ];
  }
  return [
    "0/2023/03/0b2feb96-0295-4e2b-8179-1326ff072625.jpg",
    "0/2023/03/7e413865-f78d-4dff-be2c-8e5ff1cd3f46.jpg",
    "0/2023/03/4bef829b-a368-47ab-bc34-5701fa6d0be1.jpg",
    "0/2023/03/8249dc6c-bab6-4304-b037-054e2bcf7dda.jpg"
  ];
}


// 通过选择的图片ID和布局来判定传给后端哪一张图片   1:上下布局，2：左右布局
export const getImageToBackend = (imgId: string, laout: string) => {
  let resultIgm = "";

  if (location.origin.includes('rd.q7link.com')) {
    switch (imgId) {
      case  "public/2023/05/a2957334-035d-4f40-abfc-166787baf2d6.jpg":
        resultIgm = laout === "1" ? "public/2023/05/63d766f3-1de6-46bc-a020-c70078ac78be.png" : "public/2023/05/85e19d04-2274-4532-a85f-867bd2927e9a.png";
        break;
      case "public/2023/05/c13e1c55-0e10-46f0-90f1-4f0b625324e6.jpg":
        resultIgm = laout === "1" ? "public/2023/05/7547d365-0fe3-4658-90bc-56ab045cf003.png" : "public/2023/05/3e1301c4-e090-49e3-a3ca-cb9d7cb94f34.png";
        break;
      case "public/2023/05/fe680877-4146-49c7-b82a-6d08035f12e9.jpg":
        resultIgm = laout === "1" ? "public/2023/05/4ad34134-e77d-498d-822f-92024c652a3b.png" : "public/2023/05/e205d8ef-dc73-4034-b5d4-13952645b5c2.png";
        break;
      case"public/2023/05/9aff7379-c31e-42e6-9e0b-abd440fff29c.jpg":
        resultIgm = laout === "1" ? "public/2023/05/3314dede-a0db-4897-956c-e81ed5ac3882.png" : "public/2023/05/fb34def3-7830-40f9-bf0c-62325f6fb954.png";
        break;
      default:
        resultIgm = imgId; // 手动上传的图片没有对应的后端图片
        break;
    }
    return resultIgm;
  }

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
  if (location.origin.includes('rd.q7link.com')) {
    switch (imgId) {

      case "public/2023/05/63d766f3-1de6-46bc-a020-c70078ac78be.png":
      case "public/2023/05/85e19d04-2274-4532-a85f-867bd2927e9a.png":
        resultIgm = "public/2023/05/a2957334-035d-4f40-abfc-166787baf2d6.jpg";
        break;

      case  "public/2023/05/7547d365-0fe3-4658-90bc-56ab045cf003.png":
      case "public/2023/05/3e1301c4-e090-49e3-a3ca-cb9d7cb94f34.png":
        resultIgm = "public/2023/05/c13e1c55-0e10-46f0-90f1-4f0b625324e6.jpg";
        break;

      case "public/2023/05/4ad34134-e77d-498d-822f-92024c652a3b.png":
      case "public/2023/05/e205d8ef-dc73-4034-b5d4-13952645b5c2.png":
        resultIgm = "public/2023/05/fe680877-4146-49c7-b82a-6d08035f12e9.jpg";
        break;

      case"public/2023/05/3314dede-a0db-4897-956c-e81ed5ac3882.png":
      case "public/2023/05/fb34def3-7830-40f9-bf0c-62325f6fb954.png":
        resultIgm = "public/2023/05/9aff7379-c31e-42e6-9e0b-abd440fff29c.jpg";
        break;

      default:
        resultIgm = imgId; // 手动上传的图片没有对应的后端图片
        break;
    }
    return resultIgm;
  }
  switch (imgId) {

    case "0/2023/04/4177803e-79f5-443e-bd87-cace079abb63.png":
    case "0/2023/04/c32620da-2be3-43ab-a17b-0edd23727898.png":
      resultIgm = "0/2023/03/0b2feb96-0295-4e2b-8179-1326ff072625.jpg";
      break;

    case "0/2023/04/f923f318-9b57-40af-914e-3a19e266f0bd.png":
    case "0/2023/04/4558d410-b557-4e5e-942e-1371dbf86602.png":
      resultIgm = "0/2023/03/7e413865-f78d-4dff-be2c-8e5ff1cd3f46.jpg";
      break;

    case  "0/2023/04/fef2f7ab-0a91-4bf3-aaf3-9336b2aadbc9.png":
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

const judgeAuthority = (method: string) => {
  let authFlag = false;
  const myAuth: any = localStorage.getItem("authority");
  const sys_authority: any = JSON.parse(myAuth);
  for (let index = 0; index < sys_authority.length; index += 1) {

    if (sys_authority[index].description === method) {
      authFlag = true;
      break;
    }
  }

  return authFlag;
};


export {judgeAuthority};

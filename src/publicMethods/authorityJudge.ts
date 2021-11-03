const judgeAuthority = (method: string) => {

  let authFlag = false;
  const myAuth: any = localStorage.getItem("authority");
  const sys_authority: any = JSON.parse(myAuth);

  // console.log("myAuth", myAuth);
  for (let index = 0; index < sys_authority.length; index += 1) {

    if (sys_authority[index].description === method) {
      authFlag = true;
      break;
    }
  }

  return authFlag;
};


const judgeAuthorityByName = (method: string) => {
  debugger;
  let authFlag = false;
  const myAuth: any = localStorage.getItem("authority");
  const sys_authority: any = JSON.parse(myAuth);

  for (let index = 0; index < sys_authority.length; index += 1) {

    if (sys_authority[index].name === method) {
      authFlag = true;
      break;
    }
  }

  return authFlag;
};

export {judgeAuthority, judgeAuthorityByName};

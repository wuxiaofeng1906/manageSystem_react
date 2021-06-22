const getUsersId = (allUsersArray: any, userArray: any) => {
  const idArrays = [];
  for (let index = 0; index < userArray.length; index += 1) {
    for (let mdex = 0; mdex < allUsersArray.length; mdex += 1) {
      if (userArray[index] === allUsersArray[mdex].userName) {
        idArrays.push(allUsersArray[mdex].id);
        break;
      }

    }
  }
  return idArrays;
};


export {getUsersId};

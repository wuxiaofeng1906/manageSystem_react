import axios from 'axios';

const sys_accessToken = localStorage.getItem('accessId');
axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;

// const userLogins: any = localStorage.getItem('userLogins');
// const usersInfo = JSON.parse(userLogins);





export {

}

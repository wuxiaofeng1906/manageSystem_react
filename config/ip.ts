const getCurrentProxy = () => {
  debugger;

  const url = window.location.host;

  if (url === "http://dms.q7link.com:8000/") {
    return "http://10.0.144.51:5000/";

  } else {

    return 'http://10.0.144.53:5000/';
  }

};
export {getCurrentProxy}

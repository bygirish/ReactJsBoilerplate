// return the user data from the session storage
export const getUser = () => {
  const userStr = sessionStorage.getItem('email');
  return userStr;
}


// set the token and user from the session storage
export const setUserSession = (token, email) => {
  sessionStorage.setItem('requestname', token);
  sessionStorage.setItem('email', email);
}

export const setUserType = (usertype) => {
  sessionStorage.setItem('usertype', usertype);
}

export const setToken = (token) => {
  sessionStorage.setItem('usertoken', token);
}

export const getToken = (token) => {
  const userStr = sessionStorage.getItem('usertoken');
  return userStr;
}

export const setUserDetailsSession = (token, UID , status , ttoken) => {
  sessionStorage.setItem('requestname', token);
  sessionStorage.setItem('UID', UID);
  sessionStorage.setItem('status', status);
  sessionStorage.setItem('ttoken', ttoken);
}
export const setUserDetailsTypeSession = (token, type , status , ttoken) => {
  sessionStorage.setItem('requestname', token);
  sessionStorage.setItem('type', type);
  sessionStorage.setItem('status', status);
  sessionStorage.setItem('ttoken', ttoken);
}

export const getUserDetails = () => {
  const userStr = sessionStorage.getItem('UID');
  return userStr;
}
export const getUserTypeDetails = () => {
  const userStr = sessionStorage.getItem('type');
  return userStr;
}

export const getUserType = () => {
  const userStr = sessionStorage.getItem('usertype');
  return userStr;
}


// remove the token and user from the session storage
export const removeUserSession = () => {
  sessionStorage.removeItem('requestname');
  sessionStorage.removeItem('email');
  sessionStorage.removeItem('type');
  sessionStorage.removeItem('ttoken');
}



import Cookies from "js-cookie";
import Router from "next/router";

// Set cookie
export const setCookie = (key, value) => {
  if (process.browser) {
    Cookies.set(key, value, {
      expires: 1,
    });
  }
};
// Remove from Cookies
export const removeCookie = (key) => {
  if (process.browser) {
    Cookies.remove(key);
  }
};
// Get cookies from cookies in the browser
// will be later used to make request to server with auth token
export const getCookieFromBrowser = (key) => {
  return Cookies.get(key);
};
export const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }

  let token = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith(`${key}=`));
  if (!token) {
    return undefined;
  }
  let tokenValue = token.split("=")[1];
  return tokenValue;
};
// getCookie
export const getCookie = (key, req) => {
  // if (process.browser) {
  //   return Cookies.get(key);
  // }
  return process.browser
    ? getCookieFromBrowser(key)
    : getCookieFromServer(key, req);
};

// Set Token in localstorage
export const setLocalStorage = (key, value) => {
  if (process.browser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};
// Remove token from localstorage
export const removeLocalStorage = (key) => {
  if (process.browser) {
    localStorage.removeItem(key);
  }
};

// Authenticate user by passing into cookies and localstorage
export const authenticate = (response, next) => {
  setCookie("token", response.data.token);
  setLocalStorage("user", response.data.user);
  next();
};

// Access user from localStorage
export const isAuth = () => {
  if (process.browser) {
    const cookieCheck = getCookie("token");
    if (cookieCheck) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return false;
      }
    }
  }
};

export const logout = () => {
  removeCookie("token");
  removeLocalStorage("user");
  Router.push("/login");
};

export const updateUser = (response, next) => {
  if (process.browser) {
    if (localStorage.getItem("user")) {
      let auth = localStorage.getItem("user");
      auth = response;
      localStorage.setItem("user", JSON.stringify(auth));

      next();
    }
  }
};

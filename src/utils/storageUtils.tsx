import Cookies from 'js-cookie';
import jwt_decode, { JwtPayload } from 'jwt-decode';

interface AdminType {
  user_id: string;
  name: string;
  role: string;
}

export const decodedJWT = () => {
  return Cookies.get('access_token') !== undefined
    ? jwt_decode<JwtPayload & AdminType>(Cookies.get('access_token'))
    : null;
};

export const getAccessTknExpiry = () => {
  const jwt = decodedJWT();
  return jwt.exp;
};

export const getAdminInfo = (): AdminType => {
  const jwt = decodedJWT();
  return {
    user_id: jwt.user_id,
    name: jwt.name,
    role: jwt.role,
  };
};

export const setExp = (exp: number) => {
  window.localStorage.setItem('exp', String(exp));
};

export const getSessionExp = (): number =>
  parseInt(window.localStorage.getItem('exp'));

export const clearStorage = () => {
  window.localStorage.clear();
};

export const addStorageItem = (key: string, value: string) => {
  window.localStorage.setItem(key, value);
};

export const removeStorageItem = (key: string) => {
  window.localStorage.removeItem(key);
};

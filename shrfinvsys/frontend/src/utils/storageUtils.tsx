import Cookies from 'js-cookie';
import jwt_decode, { JwtPayload } from 'jwt-decode';

interface AdminType {
  id: string;
  name: string;
  role: string;
}

export const decodedJWT = () =>
  Cookies.get('access_token') !== undefined
    ? jwt_decode<JwtPayload & AdminType>(Cookies.get('access_token'))
    : null;

export const getAdminInfo = (): AdminType => {
  const jwt = decodedJWT();
  return {
    id: jwt.id,
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

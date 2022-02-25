interface AdminType {
  id: string;
  name: string;
  role: string;
  exp: number;
}
export const getUsrInfo = (): AdminType =>
  window.localStorage.getItem('usr')
    ? JSON.parse(window.localStorage.getItem('usr'))
    : null;

export const setUsr = (info: AdminType) => {
  window.localStorage.setItem('usr', JSON.stringify(info));
};

export const getSessionExp = (): number =>
  window.localStorage.getItem('usr') &&
  JSON.parse(window.localStorage.getItem('usr'))?.exp;

export const clearStorage = () => {
  window.localStorage.clear();
};

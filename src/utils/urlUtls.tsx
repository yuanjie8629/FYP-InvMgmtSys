export const parseURL = (url: URLSearchParams) => Object.fromEntries(url);

export const addSearchParams = (
  currParams: URLSearchParams,
  newParams: any
) => {
  return { ...parseURL(currParams), ...newParams };
};

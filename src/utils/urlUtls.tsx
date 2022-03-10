export const parseURL = (url: URLSearchParams) => Object.fromEntries(url);

export const addSearchParams = (
  currParams: URLSearchParams,
  newParams: { [key: string]: any }
) => {
  return { ...parseURL(currParams), ...newParams };
};

export const removeSearchParams = (
  currParams: URLSearchParams,
  removeKey: string
) => {
  currParams.delete(removeKey);
  return parseURL(currParams);
};

export const addFilter = (currFilter, newKey: string, newValue) => {
  if (!(newValue === undefined || newValue === null || newValue === ''))
    return { ...currFilter, [newKey]: newValue };
  else {
    delete currFilter[newKey];
    return currFilter;
  }
};

export const getSortOrder = (column: string) => {
  let url = new URLSearchParams(window.location.search);
  return url.get('order') === column
    ? 'ascend'
    : url.get('order') === `-${column}`
    ? 'descend'
    : undefined;
};

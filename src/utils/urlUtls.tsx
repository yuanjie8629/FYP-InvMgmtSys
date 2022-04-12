export const parseURL = (url: URLSearchParams) => Object.fromEntries(url);

export const addSearchParams = (
  currParams: URLSearchParams,
  newParams: { [key: string]: any }
) => {
  return { ...parseURL(currParams), ...newParams };
};

export const removeSearchParams = (
  currParams: URLSearchParams,
  removeKey: string,
  removeMatch: boolean = false
) => {
  if (removeMatch) {
    currParams.forEach((_value, key) => {
      if (key.includes(removeKey)) {
        currParams.delete(key);
      }
    });
  } else {
    currParams.delete(removeKey);
  }
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
  return url.get('ordering') === column
    ? 'ascend'
    : url.get('ordering') === `-${column}`
    ? 'descend'
    : undefined;
};

export const getSortOrderWithKey = (key: string, column: string) => {
  let url = new URLSearchParams(window.location.search);
  return url.get(`${key}_ordering`) === column
    ? 'ascend'
    : url.get(`${key}_ordering`) === `-${column}`
    ? 'descend'
    : undefined;
};

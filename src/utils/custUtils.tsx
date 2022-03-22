export const getCustId = (id) => {
  let newId = id.split('-');
  return newId[newId.length - 1];
};

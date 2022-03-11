export const splitIntoChunks = (arr, chunkSize) => {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
};

export const sortByOrder = (obj: any, des: boolean = false) => {
  let sorted = obj.sort((a: string, b: string) => a.localeCompare(b));
  return des === true ? sorted.reverse() : sorted;
};

export const removeInvalidData = (values) => {
  Object.keys(values).forEach(
    (key) =>
      (values[key] === undefined ||
        values[key] === null ||
        values[key] === '') &&
      delete values[key]
  );
  return values;
};

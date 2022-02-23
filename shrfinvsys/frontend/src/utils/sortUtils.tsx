export const sortByOrder = (obj: any, des: boolean = false) => {
  let sorted = obj.sort((a: string, b: string) => a.localeCompare(b));
  return des === true ? sorted.reverse() : sorted;
};

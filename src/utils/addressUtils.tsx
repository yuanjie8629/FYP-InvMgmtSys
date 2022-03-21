export const getStates = (list) =>
  Array.from(new Set(list.map((list) => list.state)));

export const getCities = (list, state) =>
  Array.from(
    new Set(
      list.filter((data) => data.state === state).map((data) => data.city)
    )
  );

export const getPostcodes = (list, city) =>
  Array.from(
    new Set(
      list.filter((data) => data.city === city).map((data) => data.postcode)
    )
  );

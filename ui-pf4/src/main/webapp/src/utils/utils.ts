export const getMapKeys = (map: Map<any, any>) => {
  const keys: any[] = [];
  map.forEach((value: any, key: any) => keys.push(key));
  return keys;
};

export const getMapValues = (map: Map<any, any>) => {
  const values: any[] = [];
  map.forEach((value: any) => values.push(value));
  return values;
};

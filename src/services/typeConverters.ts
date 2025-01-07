export const dataTypeConverter = (dataType: string, value: boolean | number | string) => {
  let res;
  if (dataType === 'number') {
    res = Number(value);
  }

  if (dataType === 'boolean') {
    res = value === 'on';
  }

  return res;
};

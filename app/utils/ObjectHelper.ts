export const isOfType = (type: string, val: any): boolean => {
  return !!(
    val.constructor && val.constructor.name.toLowerCase() === type.toLowerCase()
  );
};

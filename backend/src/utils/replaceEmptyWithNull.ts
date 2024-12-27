export function replaceEmptyWithNull<T>(
  obj: Record<string, any>,
): Record<string, any> {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === '') {
      obj[key] = null;
    }
  });
  return obj;
}

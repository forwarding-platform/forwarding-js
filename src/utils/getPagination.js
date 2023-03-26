export const getPagination = (page, size = 10) => {
  const limit = size ? +size : 10;
  const from = page ? page * limit : 0;
  const to = page ? from + size : size;

  return { from, to };
};

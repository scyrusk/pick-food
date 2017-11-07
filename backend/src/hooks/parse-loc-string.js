module.exports = function () {
  return context => {
    return Object.assign({}, context, {
      data: {
        title: context.data.title,
        loc: (typeof context.data.loc === 'string' ? context.data.loc.split(",").map(val => parseFloat(val)): context.data.loc)
      }
    });
  };
};
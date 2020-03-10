import storage from 'node-persist';

export default ({ cacheDirectory }) => {
  storage.initSync({
    dir: cacheDirectory,
  });

  const data = storage.getItemSync('data') || {};

  return {
    getItem(item) {
      return data[item];
    },
    setItem(item, value) {
      data[item] = value;
      storage.setItem('data', data);
    },
    delItem(item) {
      delete data[item];
      storage.setItem('data', data);
    },
    getItems(items = {}) {
      const res = {};

      Object.keys(items).forEach((key) => {
        res[key] = data[key];
      });

      return res;
    },
    setItems(items) {
      Object.keys(items).forEach((key) => {
        data[key] = items[key];
      });

      storage.setItem('data', data);
    },
    delItems(items) {
      Object.keys(items).forEach((key) => {
        delete data[key];
      });

      storage.setItem('data', data);
    },
  };
};

let storage = {};

module.exports = {
  setItem: (key, value) => {
    storage[key] = value;
    return Promise.resolve();
  },
  getItem: (key) => Promise.resolve(storage.hasOwnProperty(key) ? storage[key] : null),
  removeItem: (key) => {
    delete storage[key];
    return Promise.resolve();
  },
  clear: () => {
    storage = {};
    return Promise.resolve();
  },
  getAllKeys: () => Promise.resolve(Object.keys(storage)),
  __INTERNAL_MOCK_STORAGE__: storage,
};

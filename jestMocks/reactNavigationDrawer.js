const React = require('react');

module.exports = {
  createDrawerNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: () => null,
  }),
  DrawerContentScrollView: ({ children }) => children,
  DrawerItemList: () => null,
};

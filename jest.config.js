module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|@react-navigation|react-native-vector-icons|react-native-tab-view|@react-navigation/material-top-tabs)/)"
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  moduleNameMapper: {
    '^@react-navigation/native$': '<rootDir>/jestMocks/reactNavigationNative.js',
    '^@react-navigation/drawer$': '<rootDir>/jestMocks/reactNavigationDrawer.js'
    ,
    '^@react-native-async-storage/async-storage$': '<rootDir>/jestMocks/asyncStorageMock.js'
  }
};

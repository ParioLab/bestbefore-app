module.exports = {
  testMatch: ["<rootDir>/e2e/?(*.)+(spec|test|e2e).[tj]s?(x)"],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native|react-clone-referenced-element|@react-navigation|@expo|expo(nent)?|@unimodules|unimodules|sentry-expo|native-base|@sentry/.*))"
  ],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
};
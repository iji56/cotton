module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv'],
    [
      'module-resolver',
      {
        alias: {
          '@': './src',
        },
      },
    ],
    ['react-native-reanimated/plugin'],
  ],
};
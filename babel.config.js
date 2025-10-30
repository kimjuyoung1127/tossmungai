module.exports = {
  presets: ['babel-preset-granite'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@': './',
        },
      },
    ],
    'module:react-native-dotenv',
  ],
};

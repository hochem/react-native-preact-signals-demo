module.exports = function(api) {
  api.cache(false);
  return {
    plugins: ['react-native-reanimated/plugin'],
    presets: ['babel-preset-expo'],
  };
};

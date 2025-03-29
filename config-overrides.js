const webpack = require('webpack');

module.exports = function override(config) {
  const fallback = {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "path": require.resolve("path-browserify"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "url": require.resolve("url"),
    "util": require.resolve("util"),
    "zlib": require.resolve("browserify-zlib"),
    "buffer": require.resolve("buffer"),
    "fs": false
  };

  config.resolve.fallback = {
    ...config.resolve.fallback,
    ...fallback
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"]
    })
  ];

  return config;
}; 
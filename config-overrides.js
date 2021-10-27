module.exports = function override(config, env) {
  config.output.filename = "static/js/[name].js";
  config.output.chunkFilename = "static/js/[name].chunk.js";

  config.plugins[4].filename = "static/css/main.css";

  config.optimization.runtimeChunk = false;
  config.optimization.splitChunks = {
    cacheGroups: {
      default: false
    }
  };

  console.log(config);
  return config;
};


const fs = require('fs');
const path = require('path');

module.exports = function loadPlugins() {
  const plugins = [];
  const pluginPath = path.join(__dirname, '..', 'plugins');
  fs.readdirSync(pluginPath).forEach(file => {
    if (file.endsWith('.js')) {
      const plugin = require(path.join(pluginPath, file));
      plugins.push(plugin);
    }
  });
  return plugins;
};

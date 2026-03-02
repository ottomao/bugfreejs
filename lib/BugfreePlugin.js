const fs = require('fs');
const path = require('path');

const PLUGIN_NAME = 'BugfreePlugin';
const FAITH_TYPES = ['default', 'alpaca', 'god'];

class BugfreePlugin {
  /**
   * @param {object} [options]
   * @param {'default'|'alpaca'|'god'} [options.faith='default'] - Comment style
   * @param {boolean} [options.enable=true] - Whether to enable the plugin
   */
  constructor(options = {}) {
    this.faith = FAITH_TYPES.includes(options.faith) ? options.faith : 'default';
    this.enable = options.enable !== false;
  }

  apply(compiler) {
    if (!this.enable) return;

    const commentContent = fs.readFileSync(
      path.join(__dirname, '..', 'commentFile', 'comment_' + this.faith + '_utf8.txt'),
      { encoding: 'utf8' }
    );

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: PLUGIN_NAME,
          // Use SUMMARIZE stage (1000) to run after minification/optimization
          stage: compiler.webpack
            ? compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
            : 1000,
        },
        (assets) => {
          var RawSource;
          if (compiler.webpack && compiler.webpack.sources) {
            RawSource = compiler.webpack.sources.RawSource;
          } else {
            RawSource = require('webpack').sources.RawSource;
          }

          var names = Object.keys(assets);
          for (var i = 0; i < names.length; i++) {
            var name = names[i];

            var prefix, wrapStart = '', wrapEnd = '';

            if (/\.js(\?.*)?$/.test(name)) {
              prefix = '// ';
            } else if (/\.css(\?.*)?$/.test(name)) {
              prefix = ' * ';
              wrapStart = '/*\n';
              wrapEnd = ' */\n';
            } else {
              continue;
            }

            var lines = commentContent.split('\n');
            var banner = wrapStart
              + lines.map(function (line) { return prefix + line; }).join('\n')
              + '\n' + wrapEnd;

            var asset = compilation.getAsset(name);
            compilation.updateAsset(
              name,
              new RawSource(banner + asset.source.source())
            );
          }
        }
      );
    });
  }
}

module.exports = BugfreePlugin;

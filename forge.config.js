const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true,
    name: 'shutdownme',
    icon: path.resolve(__dirname, 'assets/icons/icon')
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'Kirill "Rimjact" Tolokolnikov',
        description: 'Easy way to shutdown by timer.',
      },
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        background: 'assets/icons/icon.png',
        format: 'ULFO',
        authors: 'Kirill "Rimjact" Tolokolnikov',
        description: 'Easy way to shutdown by timer.',
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};

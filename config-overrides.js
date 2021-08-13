const {alias} = require('react-app-rewire-alias')

module.exports = function override(config) {
  alias({
    '@components': 'app/old/src/components',
    '@pages': 'app/old/src/pages',
    '@assetss' : 'app/old/src/assets',
    '@utils': 'app/old/src/utils',
    '@src' : 'app/old/src',
    '@services' : 'app/old/src/services',

    // components: 'app/old/src/components',
    // assetss : 'app/old/src/assets',
    // utils: 'app/old/src/utils',
    // src : 'app/old/src',
    // services : 'app/old/src/services'
  })(config)

  return config
}
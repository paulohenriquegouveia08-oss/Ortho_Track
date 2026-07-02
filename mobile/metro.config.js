const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['react-native', 'default', 'require'];
config.resolver.resolverMainFields = ['react-native', 'main', 'browser'];

module.exports = config;

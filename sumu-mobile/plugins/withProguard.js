const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = (config) => {
  return withAppBuildGradle(config, (config) => {
    const gradle = config.modResults.contents;
    
    // Enable R8/ProGuard for release builds
    if (!gradle.includes('proguardFiles')) {
      config.modResults.contents = gradle.replace(
        /buildTypes\s*\{/,
        `buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }`
      );
    }
    return config;
  });
};

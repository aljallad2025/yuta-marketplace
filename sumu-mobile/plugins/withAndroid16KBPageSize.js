const { withAppBuildGradle, withAndroidManifest } = require('@expo/config-plugins');

// Fix 1: 16KB page size - exclude libjsc.so and set useLegacyPackaging false
const with16KBPageSize = (config) => {
  return withAppBuildGradle(config, (config) => {
    const gradle = config.modResults.contents;

    // Add packagingOptions to exclude jsc .so files and set useLegacyPackaging false
    const packagingBlock = `
    packagingOptions {
        jniLibs {
            useLegacyPackaging false
        }
        exclude '**/libjsc.so'
        exclude '**/libjscexecutor.so'
    }`;

    // Insert after android { block if not already present
    if (!gradle.includes('libjsc.so')) {
      config.modResults.contents = gradle.replace(
        /android\s*\{/,
        `android {${packagingBlock}`
      );
    }

    return config;
  });
};

// Fix 2: Add AD_ID permission to manifest
const withAdIdPermission = (config) => {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const mainApplication = manifest.manifest;

    if (!mainApplication['uses-permission']) {
      mainApplication['uses-permission'] = [];
    }

    const hasAdId = mainApplication['uses-permission'].some(
      (p) => p.$?.['android:name'] === 'com.google.android.gms.permission.AD_ID'
    );

    if (!hasAdId) {
      mainApplication['uses-permission'].push({
        $: { 'android:name': 'com.google.android.gms.permission.AD_ID' },
      });
    }

    return config;
  });
};

module.exports = (config) => {
  config = with16KBPageSize(config);
  config = withAdIdPermission(config);
  return config;
};

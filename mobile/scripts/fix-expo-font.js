// Force expo-font to be compiled from source instead of using pre-built AAR
const fs = require('fs');
const path = require('path');

const fontDir = path.join(__dirname, '..', 'node_modules', 'expo-font');
const configPath = path.join(fontDir, 'expo-module.config.json');
const mavenRepo = path.join(fontDir, 'local-maven-repo');

if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (config.android && config.android.publication) {
    delete config.android.publication;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('[fix-expo-font] Removed publication config');
  }
}

if (fs.existsSync(mavenRepo)) {
  fs.rmSync(mavenRepo, { recursive: true, force: true });
  console.log('[fix-expo-font] Removed local-maven-repo');
}

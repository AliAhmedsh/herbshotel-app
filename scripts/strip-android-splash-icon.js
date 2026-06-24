const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, '../android/app/src/main/res/values/styles.xml');

if (!fs.existsSync(stylesPath)) {
  process.exit(0);
}

const contents = fs
  .readFileSync(stylesPath, 'utf8')
  .replace(/\s*<item name="windowSplashScreenAnimatedIcon">[^<]*<\/item>/g, '')
  .replace(/\s*<item name="android:windowSplashScreenBehavior">[^<]*<\/item>/g, '');

fs.writeFileSync(stylesPath, contents);
console.log('Stripped Android native splash icon from styles.xml');

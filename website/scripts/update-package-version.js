const fs = require('fs');
const path = require('path');
const https = require('https');

function getLatestVersion() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'registry.npmjs.org',
      path: '/ocr-llm/latest',
      method: 'GET',
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        const npmData = JSON.parse(data);
        resolve(npmData.version);
      });
    });

    req.on('error', error => {
      reject(error);
    });

    req.end();
  });
}

const uiPackageJsonPath = path.join(__dirname, '../package.json');
const uiPackageJson = JSON.parse(fs.readFileSync(uiPackageJsonPath, 'utf8'));

getLatestVersion()
  .then(latestVersion => {
    uiPackageJson.dependencies['ocr-llm'] = latestVersion;

    fs.writeFileSync(
      uiPackageJsonPath,
      JSON.stringify(uiPackageJson, null, 2) + '\n',
    );

    console.log(`Updated ocr-llm version to ${latestVersion}`);
  })
  .catch(error => {
    console.error('Error fetching latest version:', error);
    process.exit(1);
  });

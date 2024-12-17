const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
const envFilePath = path.resolve(__dirname,'.env');
fs.writeFileSync(envFilePath, `REACT_APP_VERSION=${commitHash}\n`);
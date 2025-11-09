const fs = require('fs');
const path = require('path'); 

const targetPath = './src/environments';
const prodFile = path.join(targetPath, 'environment.prod.ts');
const baseFile = path.join(targetPath, 'environment.ts'); // New path for the base file

// Ensure the directory exists (create it recursively if it doesn't)
if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
}

// 1. Configuration for the production file (using Vercel Environment Variables)
const prodConfig = `
export const environment = {
  production: true,
  web3formsUrl: '${process.env.WEB3FORMS_URL}',
  web3formsKey: '${process.env.WEB3FORMS_KEY}',
  hcaptchaSiteKey: '${process.env.HCAPTCHA_SITE_KEY}'
};
`;

// 2. Configuration for the base file (placeholder to satisfy the compiler's initial resolution check)
const baseConfig = `
// This file is a placeholder created dynamically during the build process
export const environment = {
  production: false,
  web3formsUrl: 'DEV_URL_PLACEHOLDER',
  web3formsKey: 'DEV_KEY_PLACEHOLDER',
  hcaptchaSiteKey: 'DEV_KEY_PLACEHOLDER'
};
`;

// Write both files
fs.writeFileSync(prodFile, prodConfig);
console.log('✅ Production environment variables injected into environment.prod.ts');

fs.writeFileSync(baseFile, baseConfig);
console.log('✅ Base environment file injected into environment.ts');
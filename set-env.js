const fs = require('fs');
const path = require('path'); 

const targetPath = './src/environments';
const prodFile = path.join(targetPath, 'environment.prod.ts');
const baseFile = path.join(targetPath, 'environment.ts');

if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
}

const prodConfig = `
export const environment = {
  production: true,
  web3formsUrl: '${process.env.WEB3FORMS_URL}',
  web3formsKey: '${process.env.WEB3FORMS_KEY}',
  hcaptchaSiteKey: '${process.env.HCAPTCHA_SITE_KEY}'
};
`;

const baseConfig = `
export const environment = {
  production: false,
  web3formsUrl: 'DEV_URL_PLACEHOLDER',
  web3formsKey: 'DEV_KEY_PLACEHOLDER',
  hcaptchaSiteKey: 'DEV_KEY_PLACEHOLDER'
};
`;

fs.writeFileSync(prodFile, prodConfig);
console.log('✅ Production environment variables injected into environment.prod.ts');

fs.writeFileSync(baseFile, baseConfig);
console.log('✅ Base environment file injected into environment.ts');
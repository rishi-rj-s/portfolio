const fs = require('fs');
const path = require('path'); 

const targetPath = './src/environments';
const targetFile = path.join(targetPath, 'environment.prod.ts');

if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
}

const envConfig = `
export const environment = {
  production: true,
  web3formsUrl: '${process.env.WEB3FORMS_URL}',
  web3formsKey: '${process.env.WEB3FORMS_KEY}',
  hcaptchaSiteKey: '${process.env.HCAPTCHA_SITE_KEY}'
};
`;

fs.writeFileSync(targetFile, envConfig);
console.log('✅ Environment variables injected into environment.prod.ts');
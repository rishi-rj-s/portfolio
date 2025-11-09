const fs = require('fs');

// Generate the environment.prod.ts dynamically using Vercel env vars
const envConfig = `
export const environment = {
  production: true,
  web3formsUrl: '${process.env.WEB3FORMS_URL}',
  web3formsKey: '${process.env.WEB3FORMS_KEY}'
};
`;

fs.writeFileSync('./src/environments/environment.prod.ts', envConfig);
console.log('✅ Environment variables injected into environment.prod.ts');

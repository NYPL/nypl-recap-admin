export default {
  appTitle: 'NYPL | ReCAP Admin',
  appName: 'NYPL ReCAP Admin',
  favIconPath: '//d2znry4lg8s0tq.cloudfront.net/images/favicon.ico',
  port: 3001,
  webpackDevServerPort: 3000,
  api: {
    development: 'https://dev-platformdocs.nypl.org/v0.1',
    production: '',
  },
  loginUrl: 'https://isso.nypl.org/auth/login',
  sqs: {
    region: process.env.AWS_REGION || 'us-east-1',
    api: process.env.AWS_SQS_API_URL || 'https://sqs.us-east-1.amazonaws.com/224280085904/scsb-item-update-app'
  },
  publicKey:
		'-----BEGIN PUBLIC KEY-----\n' +
		'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtmIMVmUnbwr/65MYmLGJ\n' +
		'm4aDXd0AmYI/Ww2yRye4LR2fmB6qrgdyiidmR1qV86kS287MzfYBYoTEYYjDQI0f\n' +
		'VLlH0es8ubifn0cM4hnwDnNJds3JYohen2OM+08qEsOCSIlsTJ2YDHNmUAMIiIRs\n' +
		'ay1efUPq98iAUAZkDr/M6ytwh+Sa9xmaeXVjJxUu0E8sCrqFuuZ7qm8A0ljlncLv\n' +
		'UCbulaUg9lKM8SPfaWu2O4Xr1YupmyIlYkWDzbqIZbpu8cv0nnNOonEOVckjwhMz\n' +
		'M7lSsQ05AXR0VAsZzafkpcC/yFp2Dfa2ZsKJNv/TDmYGDQ6wHgtU51ZEVq48jBz9\n' +
		'cQIDAQAB\n' +
		'-----END PUBLIC KEY-----',
};

export default {
  appTitle: 'NYPL | ReCAP Admin',
  appName: 'NYPL ReCAP Admin',
  favIconPath: '//d2znry4lg8s0tq.cloudfront.net/images/favicon.ico',
  applicationPort: 3001,
  webpackDevServerPort: 3000,
  platformApi: {
    development: 'https://dev-platformdocs.nypl.org/v0.1',
    production: '',
  },
  oauth: {
    authorizationUrl: process.env.OAUTH_AUTH_URL || 'https://isso.nypl.org/oauth/authorize',
    tokenUrl: process.env.OAUTH_TOKEN_URL || 'https://isso.nypl.org/oauth/token',
    loginUrl: process.env.OAUTH_LOGIN_URL || 'https://isso.nypl.org/auth/login',
    clientId: process.env.CLIENT_ID || 'platform_admin',
    clientSecret: process.env.CLIENT_SECRET,
    callbackUrl: process.env.NODE_ENV === 'production' ? process.env.OAUTH_CALLBACK_URL : 'http://local.nypl.org/callback',
  },
  sqs: {
    region: process.env.AWS_REGION || 'us-east-1',
    api: process.env.AWS_SQS_API_URL || 'https://sqs.us-east-1.amazonaws.com/224280085904/scsb-item-update-app'
  },
  publicKey:
    '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA44ilHg/PxcJYsISHMRyo\n' +
    'xsmez178qZpkJVXg7rOMVTLZuf05an7Pl+lX4nw/rqcvGQDXyrimciLgLkWu00xh\n' +
    'm6h6klTeJSNq2DgseF8OMw2olfuBKq1NBQ/vC8U0l5NJu34oSN4/iipgpovqAHHB\n' +
    'GV4zDt0EWSXE5xpnBWi+w1NMAX/muB2QRfRxkkhueDkAmwKvz5MXJPay7FB/WRjf\n' +
    '+7r2EN78x5iQKyCw0tpEZ5hpBX831SEnVULCnpFOcJWMPLdg0Ff6tBmgDxKQBVFI\n' +
    'Q9RrzMLTqxKnVVn2+hVpk4F/8tMsGCdd4s/AJqEQBy5lsq7ji1B63XYqi5fc1SnJ\n' +
    'EQIDAQAB\n' +
    '-----END PUBLIC KEY-----'
};

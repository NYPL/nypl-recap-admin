// Read local .env file. The environment variables will be assigned with process.env in the beginning
import dotEnv from 'dotenv';
dotEnv.config();

export default {
  appTitle: 'NYPL | ReCAP Admin',
  appName: 'NYPL ReCAP Admin',
  favIconPath: '//d2znry4lg8s0tq.cloudfront.net/images/favicon.ico',
  applicationPort: 3001,
  webpackDevServerPort: 3000,
  oauth: {
    authorizationUrl: process.env.OAUTH_AUTH_URL || 'https://isso.nypl.org/oauth/authorize',
    tokenUrl: process.env.OAUTH_TOKEN_URL || 'https://isso.nypl.org/oauth/token',
    loginUrl: process.env.OAUTH_LOGIN_URL || 'https://isso.nypl.org/auth/login',
    clientId: process.env.CLIENT_ID || 'platform_admin',
    clientSecret: process.env.CLIENT_SECRET,
    callbackUrl: process.env.NODE_ENV === 'production' ? process.env.OAUTH_CALLBACK_URL : 'http://local.nypl.org:3001/callback',
  },
  nyplMicroService: {
    tokenUrlForNyplApiClient: process.env.TOKEN_URL_FOR_NYPL_API_CLIENT,
    platformBaseUrl: process.env.APP_ENV === 'production' ? process.env.PLATFORM_BASE_URL : process.env.DEV_PLATFORM_BASE_URL,
    refileRequestId: process.env.REFILE_REQUEST_ID || 'refile_request_service',
    refileRequestSecret: process.env.REFILE_REQUEST_SECRET,
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

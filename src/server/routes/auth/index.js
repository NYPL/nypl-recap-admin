import jwt from 'jsonwebtoken';
import config from '../../../../config/appConfig';

export function initializeTokenAuth(req, res, next) {
  const nyplIdentityCookieString = req.cookies.nyplIdentityPatron;
  const nyplIdentityCookieObject = nyplIdentityCookieString ?
    JSON.parse(nyplIdentityCookieString) : {};

  const appRedirectUrl = `${config.loginUrl}?redirect_uri=http://local.nypl.org:3001/dashboard`;

  if (nyplIdentityCookieObject && nyplIdentityCookieObject.access_token) {
    jwt.verify(nyplIdentityCookieObject.access_token, config.publicKey, (error, decoded) => {
      if (error) {
				// Token has expired, need to refresh token
        req.tokenResponse = {
          isTokenValid: false,
          errorCode: error.message,
        };
				res.redirect(appRedirectUrl);
      }
      // Token has been verified, initialize user session
      req.tokenResponse = {
        isTokenValid: true,
        accessToken: nyplIdentityCookieObject.access_token,
        decodedPatron: decoded,
        errorCode: null,
      };
      // Continue next function call
      next();
    });
  } else {
    // Token is undefined from the cookie
    req.tokenResponse = {
      isTokenValid: false,
      errorCode: 'token undefined',
    };

    // Continue next function call
    res.redirect(appRedirectUrl);
  }
}

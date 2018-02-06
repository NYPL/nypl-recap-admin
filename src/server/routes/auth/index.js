import jwt from 'jsonwebtoken';
import config from '../../../../config/appConfig';
const AWS = require('aws-sdk');

const refreshAuthorizedUsersIntervalMs = 600000;

let authorized_users = undefined;
//   Create and run a function which will periodically download and process the authorized.json file
export function repeatRetrieveAuthorizedUsers() {
  new AWS.S3().getObject(
    {Bucket: 'nypl-platform-admin', Key: 'authorization.json'}, 
    (s3_err, data) => { 
      try { 
        if (s3_err) throw s3_err;

        authorized_users = JSON.parse(data.Body.toString())
        console.log('Retrieved authorization data.');

      } catch(err) {
        // Log the error, but hopefully we have an older value of authorized_users 
        console.log('Problem retrieving authorization list from S3: ', err.message);

      } finally {
        // Even if we've had an error, optimistically expect things will resolve at some point
        setTimeout(repeatRetrieveAuthorizedUsers, refreshAuthorizedUsersIntervalMs);
      }
    }
  )
}

function isEmailAuthorized(email) {
  if (!Array.isArray(authorized_users)) throw 'authorized_users is not an array (probably not initialized correctly).'
  return authorized_users.indexOf(email) !== -1;
}

export function verifyUserFromToken(accessToken) {

  let email, name, user_id;
  try {
    ({email, name, user_id} = jwt.verify(accessToken, config.publicKey));
  } catch (e) {
    console.log('Problem decoding token: ' + e.message)
    return false;
  }

  if (!email || !isEmailAuthorized(email)) return false;

  return {email, name, user_id};
}

function isUserAuthorized(req, res, next) {
  if (req.user && isEmailAuthorized(req.user.email) && isUserSessionValid(req.user)) {
    return next();
  }
	
  return res.redirect('/login');
}

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

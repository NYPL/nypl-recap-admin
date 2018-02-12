import jwt from 'jsonwebtoken';
import config from '../../../../config/appConfig';
import aws from 'aws-sdk';

const refreshAuthorizedUsersIntervalMs = 600000;

let authorizedUsers;
//   Create and run a function which will periodically download and process the authorized.json file
export function repeatRetrieveAuthorizedUsers() {
  new aws.S3().getObject(
    { Bucket: 'nypl-platform-admin', Key: 'authorization.json' },
    (s3Err, data) => {
      try {
        if (s3Err) throw s3Err;

        authorizedUsers = JSON.parse(data.Body.toString());
        console.log('Retrieved authorization data.');
      } catch (err) {
        // Log the error, but hopefully we have an older value of authorizedUsers
        console.log('Problem retrieving authorization list from S3: ', err.message);
      } finally {
        // Even if we've had an error, optimistically expect things will resolve at some point
        setTimeout(repeatRetrieveAuthorizedUsers, refreshAuthorizedUsersIntervalMs);
      }
    },
  );
}

export function isUserAuthorized(user) {
  if (!Array.isArray(authorizedUsers)) throw 'authorizedUsers is not an array (probably not initialized correctly).';
  return authorizedUsers.indexOf(user.email) !== -1;
}

export function verifySessionFromToken(accessToken) {
  try {
    // using var so the scope is through the whole function, not local to this try block
    var { email, name, exp, user_id: userId } = jwt.verify(accessToken, config.publicKey);
  } catch (e) {
    console.log(`Problem decoding token: ${e.message}`);
    return false;
  }

  if (!email) return false;

  return { user: { email, name, userId }, expiry: exp };
}

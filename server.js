import path from 'path';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import bodyParser from 'body-parser';
import colors from 'colors';
import passport from 'passport';
import { OAuth2Strategy } from 'passport-oauth';
import { ensureLoggedIn } from 'connect-ensure-login';
import uuidv4 from 'uuid/v4';
// App Route Handling
import { updateMetadata } from './src/server/routes/api';
import aws from 'aws-sdk';
// App Route Handling
import { handleSqsDataProcessing } from './src/server/routes/api';
import { renderAdminView } from './src/server/routes/render';
import { isUserAuthorized, repeatRetrieveAuthorizedUsers, verifySessionFromToken } from './src/server/routes/auth';
// App Config File
import appConfig from './config/appConfig';
// Global Configuration Variables
const rootPath = __dirname;
const distPath = path.resolve(rootPath, 'dist');
const viewsPath = path.resolve(rootPath, 'src/server/views');
const isProduction = process.env.NODE_ENV === 'production';
const { applicationPort, sqs, oauth, publicKey } = appConfig;
// AWS SQS Configuration
aws.config.update({ region: sqs.region });
const sqsClient = new aws.SQS({ apiVersion: '2012-11-05' });

/* Express Server Configurations
 * -----------------------------
*/
const app = express();
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Disables the Server response from displaying Express as the server engine
app.disable('x-powered-by');
app.set('view engine', 'ejs');
app.set('views', viewsPath);
app.set('port', process.env.PORT || applicationPort);
// Set the CookieParser middleware
app.use(cookieParser());
// Set Global publicKey
app.set('nyplPublicKey', publicKey);
app.use(session({ secret: process.env.SESSION_SECRET || uuidv4() }));
// Sets the server path to /dist
app.use(express.static(distPath));
// Use passport middleware for authentication
app.use(passport.initialize());
// use passport sessions
app.use(passport.session());
// Set up list of authorized users
repeatRetrieveAuthorizedUsers();

// Setup OAuth2 authentication
// Protect all routes, except the auth provider and callback
app.use((req, res, next) => {
  if (req.originalUrl.match(/(?:\/auth\/provider|callback)(?:\?.*)?$/)) {
    console.info('not checking logged in status for request url:', req.originalUrl);
    return next();
  }
  console.info('checking logged in status for request url:', req.originalUrl);
  return ensureLoggedIn('/auth/provider')(req, res, next);
});

passport.use('provider', new OAuth2Strategy(
  {
    authorizationURL: oauth.authorizationUrl,
    tokenURL: oauth.tokenUrl,
    clientID: oauth.clientId,
    clientSecret: oauth.clientSecret,
    callbackURL: oauth.callbackUrl,
    state: true,
    passReqToCallback: true,
  },
  (req, accessToken, refreshToken, profile, done) => {
    const { user, expiry } = verifySessionFromToken(accessToken);

    if (user) {
      console.log('User decoded in callback:', user);
      app.set('user', user);

      // Date will accept epoch time in ms
      req.session.cookie.expires = new Date(expiry * 1000);
    } else {
      // verifyUserFromToken will return false if it couldn't decode a valid user
      console.log('Could not decode user from token');
    }

    done(null, user);
  },
));

// Serializer and deserializer for app user
passport.serializeUser((user, done) => {
  console.log('Serializing', user);
  done(null, user.userId);
});
passport.deserializeUser((userId, done) => {
  console.log('Deserializing', userId);
  done(null, { userId });
});

// Redirect the user to the OAuth 2.0 provider for authentication.  When
// complete, the provider will redirect the user back to the application at
//     /auth/provider/callback
app.get('/auth/provider', passport.authenticate('provider', { scope: ['openid', 'login:staff'] }));

// The OAuth 2.0 provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
app.get(
  '/callback',
  passport.authenticate('provider', { failureRedirect: '/auth/provider' }),
  (req, res) => res.redirect(req.session.returnTo),
);

// Check whether user is authorized
app.use((req, res, next) => {
  const user = app.get('user');

  if (user && !isUserAuthorized(user)) {
    return res.status(403).send('Sorry, this email is not authorized to use the Platform Admin app');
  }

  return next();
});

// GET Route handles application view layer
app.get('*', renderAdminView);
// GET Route to obtain refile errors
app.get('/refile-errors', )
// POST Routes handle SQS data
app.post('/update-metadata', handleSqsDataProcessing(sqsClient, 'update'));
app.post('/transfer-metadata', handleSqsDataProcessing(sqsClient, 'transfer'));

const server = app.listen(app.get('port'), (error) => {
  if (error) {
    console.log(colors.red(error));
  }

  console.log(colors.yellow.underline(appConfig.appName));
  console.log(
    colors.green('Express server is listening at'),
    colors.cyan('localhost:' + app.get('port'))
  );
});

// This function is called when you want the server to die gracefully
// i.e. wait for existing connections
const gracefulShutdown = () => {
  console.log('Received kill signal, shutting down gracefully.');
  server.close(() => {
    console.log('Closed out remaining connections.');
    process.exit(0);
  });
  // if after
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit();
  }, 1000);
};
// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown);
// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown);

/* Development Environment Configuration
 * -------------------------------------
 * - Using Webpack Dev Server
*/
if (!isProduction) {
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');
  const webpackConfig = require('./webpack.config.js');

  new WebpackDevServer(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    stats: false,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3001',
      'Access-Control-Allow-Headers': 'X-Requested-With',
    },
  }).listen(appConfig.webpackDevServerPort, 'localhost', (error) => {
    if (error) {
      console.log(colors.red(error));
    }
    console.log(
			colors.magenta('Webpack Dev Server listening at'),
			colors.cyan(`localhost:${appConfig.webpackDevServerPort}`)
		);
  });
}

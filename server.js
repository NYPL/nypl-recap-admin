import path from 'path';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import colors from 'colors';
import passport from 'passport';
import { OAuth2Strategy } from 'passport-oauth';
import { ensureLoggedIn } from 'connect-ensure-login';
import jwt_decode from 'jwt-decode';
// App Route Handling
import { initializeTokenAuth } from './src/server/routes/auth';
import { getPatronData } from './src/server/routes/api';
import { renderAdminView } from './src/server/routes/render';
// App Config File
import appConfig from './config/appConfig.js';
// Global Configuration Variables
const rootPath = __dirname;
const distPath = path.resolve(rootPath, 'dist');
const viewsPath = path.resolve(rootPath, 'src/server/views');
const isProduction = process.env.NODE_ENV === 'production';

/* Express Server Configurations
 * -----------------------------
*/
const app = express();
app.use(compress());
// Disables the Server response from displaying Express as the server engine
app.disable('x-powered-by');
app.set('view engine', 'ejs');
app.set('views', viewsPath);
app.set('port', process.env.PORT || appConfig.port);
// Set the CookieParser middleware
app.use(cookieParser());
// Set Global publicKey
app.set('nyplPublicKey', appConfig.publicKey);
app.use(session({ secret: 'gregoneillbringstheparty' }));
// Sets the server path to /dist
app.use(express.static(distPath));
// Use passport middleware for authentication
app.use(passport.initialize());
// use passport sessions
app.use(passport.session());

// Setup OAuth2 authentication
// Protect all routes, except the auth provider
app.use(function (req, res, next) {
  if (req.originalUrl.match(/(?:\/auth\/provider|callback)(?:\?.*)?$/)) {
    console.info('not checking logged in status for request url:', req.originalUrl);
    return next();
  }
  console.info('checking logged in status for request url:', req.originalUrl);
  return ensureLoggedIn('/auth/provider')(req, res, next);
});

passport.use('provider', new OAuth2Strategy(
  {
    authorizationURL: 'https://isso.nypl.org/oauth/authorize',
    tokenURL: 'https://isso.nypl.org/oauth/token',
    clientID: 'platform_admin',
    clientSecret: 'cc7ea675154a927f013739a6dc598985e5a08cfc',
    callbackURL: 'http://local.nypl.org/callback',
    state: true
  },
  function(accessToken, refreshToken, profile, done) {
    
    const {email, name, user_id} = jwt_decode(accessToken);
    
    if (!email || !emailAuthorized(email)) { return done(null, false) }

    const user = {email, name, user_id};
    console.log('User decoded in callback:', user);
    
    done(null, user);
  }
));

// Serializer and deserializer for app user
passport.serializeUser(function(user, done) {
  console.log('Serializing', user);
  done(null, user.user_id);
});
passport.deserializeUser(function(user_id, done) {
  console.log('Deserializing', user_id);
  done(null, {user_id});
});

// Redirect the user to the OAuth 2.0 provider for authentication.  When
// complete, the provider will redirect the user back to the application at
//     /auth/provider/callback
app.get('/auth/provider', passport.authenticate('provider', {scope: ['openid', 'login:staff']}));

// The OAuth 2.0 provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
app.get(
  '/callback',
  passport.authenticate('provider', { failureRedirect: '/auth/provider'}),
  (req, res) => res.redirect(req.session.returnTo) 
);


// Establishes all application routes handled by react-router
app.get('*', renderAdminView);
//app.get('*', initializeTokenAuth, getPatronData, renderAdminView);

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

function emailAuthorized(email) {
  
  const authorized_users = s3.getObject(
    {Bucket: 'platform_admin', Key: 'authorization.json'}, 
    (err, data) => if (err) console.log(err, err.stack);
  )
}


import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import bodyParser from 'body-parser';
import colors from 'colors';
// App Route Handling
import { initializeTokenAuth } from './src/server/routes/auth';
import { updateMetadata, transferMetadata } from './src/server/routes/api';
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Disables the Server response from displaying Express as the server engine
app.disable('x-powered-by');
app.set('view engine', 'ejs');
app.set('views', viewsPath);
app.set('port', process.env.PORT || appConfig.port);
// Set the CookieParser middleware
app.use(cookieParser());
// Sets the server path to /dist
app.use(express.static(distPath));
// Establishes all application routes handled by react-router
app.get('*', renderAdminView);
//app.get('*', initializeTokenAuth, getPatronData, renderAdminView);

// Handle sending message to SQS for UpdateMetadata Form
app.post('/update-metadata', updateMetadata);
app.post('/transfer-metadata', transferMetadata);

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

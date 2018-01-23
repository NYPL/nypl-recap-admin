const path = require('path');
const webpack = require('webpack');
const CleanBuild = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// References the applications root path
const rootPath = path.resolve(__dirname);

// PRODUCTION ENVIRONMENT CONFIG
if (process.env.NODE_ENV === 'production') {
  const loaders = [
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
      },
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
      },
    },
  ];

  module.exports = {
    devtool: 'source-map',
    entry: {
      app: [
        'babel-polyfill',
        path.resolve(rootPath, 'src/client/client.jsx'),
      ],
    },
    output: {
      path: path.resolve(rootPath, 'dist'),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
        },
        {
          test: /\.scss$/,
          include: path.resolve(rootPath, 'src'),
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: loaders,
          }),
        },
      ],
    },
    plugins: [
      // Cleans the Dist folder after every build.
      // Alternately, we can run rm -rf dist/ as
      // part of the package.json scripts.
      new CleanBuild(['dist']),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
      new ExtractTextPlugin('styles.css'),
    ],
  };
} else {
  // DEVELOPMENT ENVIRONMENT CONFIG
  module.exports = {
    devtool: 'eval',
    entry: {
      app: [
        'babel-polyfill',
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        path.resolve(rootPath, 'src/client/client.jsx'),
      ],
    },
    output: {
      publicPath: 'http://localhost:3000/',
      path: path.resolve(rootPath, 'dist'),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.scss'],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          use: 'babel-loader',
        },
        {
          test: /\.scss?$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader',
          ],
          include: path.resolve(rootPath, 'src'),
        },
      ],
    },
    plugins: [
      new CleanBuild(['dist']),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
  };
}

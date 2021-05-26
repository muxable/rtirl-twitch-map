
const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')

// defines where the bundle file will live
const bundlePath = path.resolve(__dirname, "dist/")

module.exports = (_env, argv) => {
  let entryPoints = {
    VideoComponent: {
      path: "./src/map.js",
      template: "./public/video_component.html",
      outputHtml: "video_component.html",
      build: true
    },
    Config: {
      path: "./src/config.js",
      template: "./public/config.html",
      outputHtml: "config.html",
      build: true
    },
  }

  let entry = {}

  // edit webpack plugins here!
  let plugins = [
  ]

  for (name in entryPoints) {
    if (entryPoints[name].build) {
      entry[name] = entryPoints[name].path
      if (argv.mode === 'production') {
        plugins.push(new HtmlWebpackPlugin({
          inject: true,
          chunks: [name],
          template: entryPoints[name].template,
          filename: entryPoints[name].outputHtml
        }))
      }
    }
  }

  let config = {
    entry,
    optimization: {
      minimize: false, // neccessary to pass Twitch's review process
      mergeDuplicateChunks: true,
      splitChunks: {
        chunks: 'all',
      },
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader: "file-loader",
          options: {
            name: "img/[name].[ext]",
            esModule: false
          }
        }
      ]
    },
    resolve: { extensions: ['*', '.js'] },
    output: {
      filename: "[name].bundle.js",
      path: bundlePath,
      clean: true
    },
    plugins
  }
  if (argv.mode === 'development') {
    config.devServer = {
      contentBase: path.join(__dirname, 'public'),
      host: 'localhost',
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      port: 8080
    }
  }

  return config;
}

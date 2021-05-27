const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const bundlePath = path.resolve(__dirname, 'dist/')

module.exports = (_env, argv) => {
  const entryPoints = {
    video: {
      path: './src/panel/map.js',
      template: './src/panel/index.html',
      outputHtml: 'video_component.html',
      build: true
    },
    config: {
      path: './src/config/config.js',
      template: './src/config/index.html',
      outputHtml: 'config.html',
      build: true
    }
  }

  const entry = {}

  const plugins = [
  ]

  for (const entryPoint in entryPoints) {
    if (entryPoints[entryPoint].build) {
      entry[entryPoint] = entryPoints[entryPoint].path
      if (argv.mode === 'production') {
        plugins.push(new HtmlWebpackPlugin({
          inject: true,
          chunks: [entryPoint],
          template: entryPoints[entryPoint].template,
          filename: entryPoints[entryPoint].outputHtml
        }))
      }
    }
  }

  const config = {
    entry,
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
        terserOptions: {
          parse: {},
          compress: {},
          mangle: false,
          module: false
        }
      })],
      mergeDuplicateChunks: true,
      splitChunks: {
        chunks: 'all'
      }
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]',
            esModule: false
          }
        }
      ]
    },
    resolve: { extensions: ['*', '.js'] },
    output: {
      filename: '[name].bundle.js',
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

  return config
}

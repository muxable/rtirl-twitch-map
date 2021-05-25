const HtmlWebpackPlugin = require('html-webpack-plugin')

let entryPoints = {
  VideoComponent: {
    path: "./src/map.js",
    template: "./public/video_component.html",
    outputHtml: "video_component.html",
    build: true
  },
  Config: {
    path: "./src/Config.js",
    template: "./public/config.html",
    outputHtml: "config.html",
    build: false
  }
}

let entry = {}
let output = []
for (name in entryPoints) {
  if (entryPoints[name].build) {
    entry[name] = entryPoints[name].path
    output.push(new HtmlWebpackPlugin({
      inject: true,
      chunks: name,
      filename: entryPoints[name].outputHtml
    }))
  }
}
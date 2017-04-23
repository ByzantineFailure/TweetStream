module.exports = {
  entry: './web/main.js',
  output: {
    path: './build',
    filename: 'index.js'
  },
  devtool: "cheap-module-source-map",
  devServer: {
    inline: true,
    port: 7777,
    host: "0.0.0.0"
  },
  module: {
    loaders: [
    /*
      {
        test: /\.(html)$/,
        exclude: /node_modules/,
        loader: "file-loader"
      },
      */
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
}


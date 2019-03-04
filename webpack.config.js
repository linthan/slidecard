const path = require("path");
const { WebPlugin } = require("web-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  output: {
    publicPath: "",
    filename: "[name].js"
  },
  resolve: {
    // 加快搜索速度
    modules: [path.resolve(__dirname, "node_modules")],
    // es tree-shaking
    mainFields: ["jsnext:main", "browser", "main"]
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        // 提取出css
        loaders: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "sass-loader"]
        }),
        include: path.resolve(__dirname, "src")
      },
      {
        test: /\.css$/,
        // 提取出css
        loaders: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader"]
        })
      },
      {
        test: /\.(eot|woff|ttf|svg|pdf)$/,
        loader: "base64-inline-loader"
      },
      {
        test: /\.(png|jpg?g|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "[name]-[hash:5].min.[ext]",
              limit: 20000, // size <= 20KB
              publicPath: "static/",
              outputPath: "static/"
            }
          }
        ]
      }
    ]
  },
  entry: {
    main: "./src/main.js"
  },
  plugins: [
    new WebPlugin({
      template: "./src/index.html",
      filename: "index.html"
    }),
    new ExtractTextPlugin({
      filename: "[name].css",
      allChunks: true
    })
  ],
  devtool: "source-map"
};

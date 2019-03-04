const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const srcDir = path.resolve(__dirname, "src");
module.exports = {
  output: {
    publicPath: "",
    filename: "[name].js"
  },
  externals: {
    jquery: "jQuery"
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
    main: "./src/main.js",
    app: path.resolve(srcDir, "app.js")
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "html-withimg-loader!" + path.resolve(srcDir, "index.html"),
      filename: "index.html"
    }),
    new ExtractTextPlugin({
      filename: "[name].css",
      allChunks: true
    })
  ],
  devtool: "source-map"
};

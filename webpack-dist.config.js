const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const findChrome = require("chrome-finder");
const UglifyJsPlugin = require("webpack/lib/optimize/UglifyJsPlugin");
const DefinePlugin = require("webpack/lib/DefinePlugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const EndWebpackPlugin = require("end-webpack-plugin");
const ghpages = require("gh-pages");
const HtmlWebpackPlugin = require("html-webpack-plugin");

function publishGhPages() {
  return new Promise((resolve, reject) => {
    ghpages.publish(outputPath, { dotfiles: true }, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

const outputPath = path.resolve(__dirname, ".public");
const srcDir = path.resolve(__dirname, "src");
module.exports = {
  output: {
    path: outputPath,
    publicPath: "/slidecard",
    filename: "[name]_[chunkhash:8].js"
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
          // 压缩css
          use: ["css-loader?minimize", "postcss-loader", "sass-loader"]
        }),
        include: path.resolve(__dirname, "src")
      },
      {
        test: /\.css$/,
        // 提取出css
        loaders: ExtractTextPlugin.extract({
          fallback: "style-loader",
          // 压缩css
          use: ["css-loader?minimize", "postcss-loader"]
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
              name: "[name]-[hash:5].[ext]",
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
    new DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new UglifyJsPlugin({
      // 最紧凑的输出
      beautify: false,
      // 删除所有的注释
      comments: false,
      compress: {
        // 在UglifyJs删除没有用到的代码时不输出警告
        warnings: false,
        // 删除所有的 `console` 语句，可以兼容ie浏览器
        drop_console: true,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true
      }
    }),
    //解决html里面图片不能处理的问题
    new HtmlWebpackPlugin({
      template: "html-withimg-loader!" + path.resolve(srcDir, "index.html"),
      filename: "index.html"
    }),
    new ExtractTextPlugin({
      filename: "[name]_[contenthash:8].css",
      allChunks: true
    }),
    new EndWebpackPlugin(async () => {
      await publishGhPages();
    })
  ]
};

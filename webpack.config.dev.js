const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const dotenv = require("dotenv");
const { styles } = require("@ckeditor/ckeditor5-dev-utils");

module.exports = () => {
  const env = dotenv.config({ path: "./.env.dev" }).parsed;

  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    devtool: "source-map",
    entry: {
      vendor: {
        import: path.resolve(__dirname, "./src/vendor.ts"),
      },
      index: {
        dependOn: "vendor",
        import: path.resolve(__dirname, "./src/index.tsx"),
      },
    },
    output: {
      publicPath: "/",
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[contenthash].bundle.js",
      clean: true,
      assetModuleFilename: "assets/loader-files/[hash][ext][query]",
    },
    module: {
      rules: [
        {
          test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
          use: ["raw-loader"],
        },
        {
          test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
          use: [
            {
              loader: "style-loader",
              options: {
                injectType: "singletonStyleTag",
                attributes: {
                  "data-cke": true,
                },
              },
            },
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: styles.getPostCssConfig({
                  themeImporter: {
                    themePath: require.resolve("@ckeditor/ckeditor5-theme-lark"),
                  },
                  minify: true,
                }),
              },
            },
          ],
        },
        {
          test: /\.(js|jsx)$/,
          include: [path.resolve(__dirname, "src")],
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.(sa|sc|c)ss$/,
          exclude: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
          exclude: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
          type: "asset",
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src", "index.html"),
      }),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
      }),
      new CopyPlugin({
        patterns: [
          { from: "src/assets/img", to: "assets/img" },
          { from: "src/assets/svg", to: "assets/svg" },
          { from: "public", to: path.join(__dirname, "dist") },
        ],
      }),
      new webpack.DefinePlugin(envKeys),
      new webpack.ProvidePlugin({ React: "react" }),
    ],
    devServer: {
      static: { directory: path.join(__dirname, "dist") },
      historyApiFallback: true,
      compress: true,
    },
  };
};

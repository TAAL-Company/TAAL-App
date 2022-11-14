const HtmlWebPackPlugin = require("html-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const WorkboxPlugin = require("workbox-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const path = require("path");
module.exports = {
  context: __dirname,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    publicPath: "/",
  },
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jp?g|gif|pdf)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.(jp(e*)g|svg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "images/[hash]-[name].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
    }),
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
    }),
    new CopyPlugin({
      patterns: [{ from: "./src/locales", to: "locales" }],
    }),
    new WebpackPwaManifest({
      name: "Taal Path",
      short_name: "TaalPath",
      description: "Taal Path Web App test",
      background_color: "#ffffff",
      theme_color: "#EEEEEE",
      crossorigin: "use-credentials", //can be null, use-credentials or anonymous
      display: "standalone",
      scope: "/",
      start_url: "/",
      icons: [
        {
          src: "./src/images/maskable.png",
          type: "image/png",
          sizes: "568x568",
          purpose: "any maskable",
        },
        {
          src: "./src/images/icon.png",
          type: "image/png",
          sizes: "256x256",
        },
        {
          src: "./src/images/icon@2x.png",
          type: "image/png",
          sizes: "512x512",
        },
        {
          src: "./src/images/icon@3x.png",
          type: "image/png",
          sizes: "768x768",
        },
      ],
    }),
  ],
};

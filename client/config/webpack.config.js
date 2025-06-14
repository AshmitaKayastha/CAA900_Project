"use strict";

const fs = require("fs");
const isWsl = require("is-wsl");
const path = require("path");
const webpack = require("webpack");
const resolve = require("resolve");
const PnpWebpackPlugin = require("pnp-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const safePostCssParser = require("postcss-safe-parser");
const ManifestPlugin = require("webpack-manifest-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const WatchMissingNodeModulesPlugin = require("react-dev-utils/WatchMissingNodeModulesPlugin");
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
const ESLintPlugin = require("eslint-webpack-plugin");
const paths = require("./paths");
const modules = require("./modules");
const getClientEnvironment = require("./env");
const ModuleNotFoundPlugin = require("react-dev-utils/ModuleNotFoundPlugin");
const ForkTsCheckerWebpackPlugin = require("react-dev-utils/ForkTsCheckerWebpackPlugin");
const typescriptFormatter = require("react-dev-utils/typescriptFormatter");
const postcssNormalize = require("postcss-normalize");

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";
const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== "false";
const useTypeScript = fs.existsSync(paths.appTsConfig);

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";

  const publicPath = isEnvProduction ? paths.servedPath : isEnvDevelopment && "/";
  const shouldUseRelativeAssetPaths = publicPath === "./";
  const publicUrl = isEnvProduction ? publicPath.slice(0, -1) : isEnvDevelopment && "";
  const env = getClientEnvironment(publicUrl);

  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isEnvDevelopment && require.resolve("style-loader"),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        options: Object.assign(
          {},
          shouldUseRelativeAssetPaths ? { publicPath: "../../" } : undefined
        )
      },
      {
        loader: require.resolve("css-loader"),
        options: cssOptions
      },
      {
        loader: require.resolve("postcss-loader"),
        options: {
          ident: "postcss",
          plugins: () => [
            require("postcss-flexbugs-fixes"),
            require("postcss-preset-env")({
              autoprefixer: { flexbox: "no-2009" },
              stage: 3
            }),
            postcssNormalize()
          ],
          sourceMap: isEnvProduction && shouldUseSourceMap
        }
      }
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push({
        loader: require.resolve(preProcessor),
        options: { sourceMap: isEnvProduction && shouldUseSourceMap }
      });
    }
    return loaders;
  };

  return {
    mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
    bail: isEnvProduction,
    devtool: isEnvProduction ? (shouldUseSourceMap ? "source-map" : false) : "cheap-module-source-map",
    entry: [
      isEnvDevelopment && require.resolve("react-dev-utils/webpackHotDevClient"),
      paths.appIndexJs
    ].filter(Boolean),
    output: {
      path: isEnvProduction ? paths.appBuild : undefined,
      pathinfo: isEnvDevelopment,
      filename: isEnvProduction ? "static/js/[name].[contenthash:8].js" : "static/js/bundle.js",
      chunkFilename: isEnvProduction ? "static/js/[name].[contenthash:8].chunk.js" : "static/js/[name].chunk.js",
      futureEmitAssets: true,
      publicPath: publicPath,
      devtoolModuleFilenameTemplate: info =>
        path.resolve(info.absoluteResourcePath).replace(/\\/g, "/")
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: { ecma: 8 },
            compress: { ecma: 5, warnings: false, comparisons: false, inline: 2 },
            mangle: { safari10: true },
            output: { ecma: 5, comments: false, ascii_only: true }
          },
          parallel: !isWsl,
          cache: true,
          sourceMap: shouldUseSourceMap
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: shouldUseSourceMap ? { inline: false, annotation: true } : false
          }
        })
      ],
      splitChunks: { chunks: "all", name: false },
      runtimeChunk: true
    },
    resolve: {
      modules: ["node_modules", paths.appNodeModules].concat(modules.additionalModulePaths || []),
      extensions: paths.moduleFileExtensions.map(ext => `.${ext}`).filter(ext => useTypeScript || !ext.includes("ts")),
      alias: { "react-native": "react-native-web" },
      plugins: [PnpWebpackPlugin]
    },
    resolveLoader: {
      plugins: [PnpWebpackPlugin.moduleLoader(module)]
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve("url-loader"),
              options: { limit: 10000, name: "static/media/[name].[hash:8].[ext]" }
            },
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: paths.appSrc,
              loader: require.resolve("babel-loader"),
              options: {
                customize: require.resolve("babel-preset-react-app/webpack-overrides"),
                plugins: [
                  [
                    require.resolve("babel-plugin-named-asset-import"),
                    { loaderMap: { svg: { ReactComponent: "@svgr/webpack?-svgo,+ref![path]" } } }
                  ]
                ],
                cacheDirectory: true,
                cacheCompression: isEnvProduction,
                compact: isEnvProduction
              }
            },
            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: getStyleLoaders({ importLoaders: 1, sourceMap: isEnvProduction && shouldUseSourceMap }),
              sideEffects: true
            },
            {
              test: cssModuleRegex,
              use: getStyleLoaders({ importLoaders: 1, sourceMap: isEnvProduction && shouldUseSourceMap, modules: true, getLocalIdent: getCSSModuleLocalIdent })
            },
            {
              test: sassRegex,
              exclude: sassModuleRegex,
              use: getStyleLoaders({ importLoaders: 2, sourceMap: isEnvProduction && shouldUseSourceMap }, "sass-loader"),
              sideEffects: true
            },
            {
              test: sassModuleRegex,
              use: getStyleLoaders({ importLoaders: 2, sourceMap: isEnvProduction && shouldUseSourceMap, modules: true, getLocalIdent: getCSSModuleLocalIdent }, "sass-loader")
            },
            {
              loader: require.resolve("file-loader"),
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: { name: "static/media/[name].[hash:8].[ext]" }
            }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({ inject: true, template: paths.appHtml }),
      isEnvProduction && shouldInlineRuntimeChunk && new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
      new ModuleNotFoundPlugin(paths.appPath),
      new webpack.DefinePlugin(env.stringified),
      isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
      isEnvDevelopment && new WatchMissingNodeModulesPlugin(paths.appNodeModules),
      isEnvProduction && new MiniCssExtractPlugin({ filename: "static/css/[name].[contenthash:8].css", chunkFilename: "static/css/[name].[contenthash:8].chunk.css" }),
      new ManifestPlugin({ fileName: "asset-manifest.json", publicPath }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      isEnvProduction && new WorkboxWebpackPlugin.GenerateSW({
        clientsClaim: true,
        exclude: [/\.map$/, /asset-manifest\.json$/],
        importWorkboxFrom: "cdn",
        navigateFallback: publicUrl + "/index.html",
        navigateFallbackBlacklist: [new RegExp("^/_"), new RegExp("/[^/]+\\.[^/]+$")]
      }),
      useTypeScript && new ForkTsCheckerWebpackPlugin({
        typescript: resolve.sync("typescript", { basedir: paths.appNodeModules }),
        async: isEnvDevelopment,
        useTypescriptIncrementalApi: true,
        checkSyntacticErrors: true,
        tsconfig: paths.appTsConfig,
        reportFiles: [
  "**",
  "!**/__tests__/**",
  "!**/?(*.)(spec|test).*",
  "!**/src/setupProxy.*",
  "!**/src/setupTests.*"
],
watch: paths.appSrc,
silent: true,
formatter: isEnvProduction ? typescriptFormatter : undefined

      }),
      isEnvDevelopment && new ESLintPlugin({
        extensions: ["js", "mjs", "jsx", "ts", "tsx"],
        eslintPath: require.resolve("eslint"),
        context: paths.appSrc,
        cache: true,
        failOnError: false,
        emitWarning: true
      })
    ].filter(Boolean),
    node: {
      module: "empty",
      dgram: "empty",
      dns: "mock",
      fs: "empty",
      http2: "empty",
      net: "empty",
      tls: "empty",
      child_process: "empty"
    },
    performance: false
  };
};

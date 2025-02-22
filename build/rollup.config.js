// rollup.config.js
import fs from "fs";
import path from "path";
import vue from "rollup-plugin-vue";
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import babel from "rollup-plugin-babel";
import minimist from "minimist";
import webWorkerLoader from "rollup-plugin-web-worker-loader";
import strip from "@rollup/plugin-strip";
import cleaner from "rollup-plugin-cleaner";

// Get browserslist config and remove ie from es build targets
const esbrowserslist = fs
  .readFileSync("./.browserslistrc")
  .toString()
  .split("\n")
  .filter(entry => entry && entry.substring(0, 2) !== "ie");

const argv = minimist(process.argv.slice(2));

const projectRoot = path.resolve(__dirname, "..");

const baseConfig = {
  input: "src/index.js",
  plugins: {
    preVue: [
      replace({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      alias({
        resolve: [".js", ".jsx", ".ts", ".tsx", ".vue"],
        entries: {
          "@": path.resolve(projectRoot, "src")
        }
      })
    ],
    vue: {
      css: true,
      template: {
        isProduction: true
      }
    },
    babel: {
      exclude: "node_modules/**",
      extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"]
    }
  }
};

// ESM/UMD/IIFE shared settings: externals
// Refer to https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
const external = [
  // list external dependencies, exactly the way it is written in the import statement.
  // eg. 'jquery'
  "vue"
];

// UMD/IIFE shared settings: output.globals
// Refer to https://rollupjs.org/guide/en#output-globals for details
const globals = {
  // Provide global variable names to replace your external imports
  // eg. jquery: '$'
  vue: "Vue"
};

// Customize configs for individual targets
const buildFormats = [];
if (!argv.format || argv.format === "es") {
  const esConfig = {
    ...baseConfig,
    external,
    output: {
      dir: "dist/",
      format: "esm",
      exports: "named"
    },
    plugins: [
      ...baseConfig.plugins.preVue,
      vue(baseConfig.plugins.vue),
      babel({
        ...baseConfig.plugins.babel,
        presets: [
          [
            "@babel/preset-env",
            {
              targets: esbrowserslist
            }
          ]
        ]
      }),
      commonjs(),
      cleaner({
        targets: ["./dist/"]
      }),
      strip(),
      webWorkerLoader({
        forceInline: true,
        pattern: /worker-loader!(.+)/
      })
    ]
  };
  buildFormats.push(esConfig);
}

if (!argv.format || argv.format === "cjs") {
  const umdConfig = {
    inlineDynamicImports: true,
    ...baseConfig,
    external,
    output: {
      compact: true,
      file: "dist/kalendar-vue.umd.js",
      format: "cjs",
      name: "KalendarVue",
      exports: "named",
      globals
    },
    plugins: [
      ...baseConfig.plugins.preVue,
      vue({
        ...baseConfig.plugins.vue,
        template: {
          ...baseConfig.plugins.vue.template
        }
      }),
      babel(baseConfig.plugins.babel),
      commonjs(),
      strip(),
      webWorkerLoader({
        forceInline: true,
        pattern: /worker-loader!(.+)/
      })
    ]
  };
  buildFormats.push(umdConfig);
}

// Export config
export default buildFormats;

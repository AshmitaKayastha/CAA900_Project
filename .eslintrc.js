module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    },
    babelOptions: {
      presets: ["@babel/preset-env", "@babel/preset-react"]
    }
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  plugins: ["react", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  rules: {
    // customize rules as you like
    "react/prop-types": "off",
    "no-unused-vars": "warn",
    "no-console": "off"
  }
};

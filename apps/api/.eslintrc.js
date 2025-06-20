module.exports = {
  root: true,
  extends: ["eslint:recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  globals: {
    Express: "readonly",
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "no-unused-vars": "off",
    "no-undef": "warn", // Downgrade to warning
  },
};

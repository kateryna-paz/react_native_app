module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react-native/all",
    "prettier",
  ],
  plugins: ["react", "react-native", "react-hooks", "prettier", "import"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: "module",
  },
  env: {
    "react-native/react-native": true,
    jest: true,
    node: true,
    es6: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "react-native/no-unused-styles": "error",
    "react-native/no-inline-styles": "off",
    "react-native/no-color-literals": "error",
    "react-native/no-raw-text": [
      "error",
      {
        skip: ["Button"],
      },
    ],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react-native/sort-styles": "off",
    "react/display-name": "warn",

    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
  },
};

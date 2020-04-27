module.exports = {
    'extends': ['airbnb', 'prettier'],
    'plugins': ['prettier'],
    'rules': {
      "prettier/prettier": "error",
      "spaced-comment": "off",
      "no-console": "warn", //whether I want to allow console.log in my code
      "consistent-return": "off", //whether a function must return or not
      "func-names": "off",
      "object-shorthand": "off",
      "no-process-exit": "off",
      "no-param-reassign": "off",
      "no-return-await": "off",
      "no-underscore-dangle": "off",
      "class-methods-use-this": "off",
      "prefer-destructuring": ["warn", { "object": true, "array": false }],
      "no-unused-vars": ["error", { "argsIgnorePattern": "req|res|next|val" }], //detect if there is any unused variables
      "linebreak-style": ["error", "unix"],
      "global-require": "warn"
    }
};
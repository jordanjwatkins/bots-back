module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb-base',
  ],

  env: {
    browser: true,
    es6: true,
    node: true,
  },

  parser: 'babel-eslint',

  parserOptions: {
    sourceType: 'module',
  },

  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config.dev.js',
      },
    },

    "import/parser": "babel-eslint",
  },

  rules: {
    'class-methods-use-this': ['off'],
    'consistent-return': ['off'],

    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        'uglifyjs-webpack-plugin',
        'webpack.config.*.js',
        'postcss.config.js',
      ],
    }],

    'max-len': ['error', { code: 120 }],

    'no-multiple-empty-lines': ['error'],
    'no-mixed-operators': ['off'],
    'no-param-reassign': ['off', { props: false }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-return-assign': ['off'],
    'no-use-before-define': ['error', { functions: false }],
    'object-curly-newline': ['error', { consistent: true }],

    'padding-line-between-statements': [
      'error',

      // newline-before-return
      { blankLine: 'always', prev: '*', next: 'return' },

      // newline-after-var
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*'},
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var']},
    ],

    'prefer-destructuring':  ['error', {
      'VariableDeclarator': {
        'array': true,
        'object': true
      },
      'AssignmentExpression': {
        'array': false,
        'object': true
      }
    }, {
      'enforceForRenamedProperties': false
    }],

    'semi': ['error', 'never'],
  },
};

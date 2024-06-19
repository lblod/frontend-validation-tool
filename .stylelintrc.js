'use strict';

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],
  rules: {
    'selector-class-pattern': null,
    'no-descending-specificity': null,
    'import-notation': null,
    'at-rule-empty-line-before': null,
  },
};

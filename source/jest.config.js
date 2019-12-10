module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        "**/app/**/*.js",
        '**/tests/**/*-spec.js'
    ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  testMatch: [
      "**/tests/**/*-spec.js"
  ],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.(js|jsx)?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
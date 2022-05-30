module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  transform: {
    "^.+\\.vue$": "vue-jest",
  },
  verbose: false,
  //verbose: true,
  "testEnvironment": "jest-environment-jsdom-sixteen",
};

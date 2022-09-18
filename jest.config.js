module.exports = {
    preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
    transform: {
        '^.+\\.vue$': '@vue/vue3-jest',
    },
    verbose: false,
    setupFiles: ['./tests/unit/setup.ts'],
};

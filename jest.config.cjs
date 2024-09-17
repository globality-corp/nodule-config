const { createDefaultEsmPreset } = require('ts-jest')

const defaultEsmPreset = createDefaultEsmPreset()

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest/presets/js-with-ts-esm',
    testEnvironment: 'node',
    verbose: true,
    roots: ['<rootDir>/src'],
    ...defaultEsmPreset,
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    }
};

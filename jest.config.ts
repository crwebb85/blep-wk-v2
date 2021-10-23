import { compilerOptions } from './tsconfig.json';
import { pathsToModuleNameMapper } from 'ts-jest/utils';

module.exports = {
  //testEnvironment: 'node',
  testEnvironment: 'jest-dynalite/environment',
  roots: ['<rootDir>/tst/unit'],
  testMatch: ['**/*.unit.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  setupFilesAfterEnv: ['jest-dynalite/setupTables', 'jest-dynalite/clearAfterEach'],
};

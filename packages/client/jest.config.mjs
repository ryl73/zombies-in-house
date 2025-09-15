import dotenv from 'dotenv'
dotenv.config()

export default {
  preset: 'ts-jest/presets/default-esm', // ESM preset for ts-jest
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      { useESM: true }, // Tell ts-jest to treat files as ESM
    ],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transformIgnorePatterns: [
    'node_modules/(?!(YOUR_ESM_DEPENDENCY|another-esm-lib)/)',
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  globals: {
    __SERVER_PORT__: process.env.SERVER_PORT,
    __INTERNAL_SERVER_URL__:
      process.env.INTERNAL_SERVER_URL || 'http://server:3001',
    __EXTERNAL_SERVER_URL__:
      process.env.EXTERNAL_SERVER_URL || 'http://localhost:3001',
  },
}

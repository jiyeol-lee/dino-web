module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/components/**/*.{ts,tsx}',
    '<rootDir>/src/hooks/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**'
  ],
  moduleNameMapper: {
    /* Handle CSS imports (with CSS modules)
    https://jestjs.io/docs/webpack#mocking-css-modules */
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/src/__mocks__/styleMock.js',

    /* Handle image imports
    https://jestjs.io/docs/webpack#handling-static-assets */
    '^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$':
      '<rootDir>/src/__mocks__/fileMock.js',

    /* Handle typescript custom absolute imports */
    '@/mock-data/(.*)': '<rootDir>/src/__mocks__/data/$1',
    '@/layout/(.*)': '<rootDir>/src/layout/$1',
    '@/types/(.*)': '<rootDir>/src/types/$1',
    '@/types': '<rootDir>/src/types/app.ts',
    '@/http-services/(.*)': '<rootDir>/src/http-services/$1',
    '@/url-services/(.*)': '<rootDir>/src/url-services/$1',
    '@/constants/(.*)': '<rootDir>/src/constants/$1',
    '@/components/(.*)': '<rootDir>/src/components/$1',
    '@/pages/(.*)': '<rootDir>/src/pages/$1',
    '@/hooks/(.*)': '<rootDir>/src/hooks/$1',
    '@/utils/(.*)': '<rootDir>/src/utils/$1',
    '@/models/(.*)': '<rootDir>/src/models/$1',
    '@/redux-store': '<rootDir>/src/redux/store',
    '@/redux-types/(.*)': '<rootDir>/src/redux/types/$1',
    '@/redux-types': '<rootDir>/src/redux/types',
    '@/redux-actions': '<rootDir>/src/redux/actions',
    '@/redux-selectors': '<rootDir>/src/redux/selectors'
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  testEnvironment: 'jsdom',
  transform: {
    /* Use babel-jest to transpile tests with the next/babel preset
    https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object */
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  setupFiles: [
    '<rootDir>/src/__mocks__/react-i18next.js',
    '<rootDir>/src/__mocks__/next.js',
    '<rootDir>/src/__mocks__/next-auth.js',
    '<rootDir>/src/__mocks__/mongoose.js',
    '<rootDir>/src/__mocks__/uuid.js',
    '<rootDir>/src/__mocks__/file-http-service.js',
    '<rootDir>/src/__mocks__/useHttpApp.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
}

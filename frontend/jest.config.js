/** @type {import('ts-jest').JestConfigWithTsJest} */
const nextJest = require("next/jest");
const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "@src/(.*)": "<rootDir>/src/$1",
    "@tests/(.*)": "<rootDir>/tests/$1",
  },
  collectCoverage: true,
  collectCoverageFrom: ["src/**", "!src/Api.ts", "!src/BackendApi.ts", "!src/pages/_app.tsx", "!src/middleware.ts", "!src/components/Layout/Layout.tsx"],
  coverageThreshold: {
    global: {
      lines: 85,
    },
  },
};

module.exports = createJestConfig(customJestConfig);

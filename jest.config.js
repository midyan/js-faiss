/* eslint-disable */

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testPathIgnorePatterns: ["build"],
  collectCoverageFrom: ["./src/**/*.ts", "!./src/index.js", "!./**/*.d.ts"],
  setupFiles: ["dotenv/config"],
  testTimeout: 3000,
};

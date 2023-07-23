/* eslint-disable */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testPathIgnorePatterns: ["build", "old_src"],
  collectCoverageFrom: ["./src/**/*.ts", "!./src/index.js", "!./**/*.d.ts"],
  setupFiles: ["dotenv/config"],
  testTimeout: 3000,
};

export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@artcom/mqtt-topping$": "<rootDir>/test/mocks/mqtt-topping.ts"
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@artcom/async-task-hook)/)"
  ],
  testMatch: ["**/test/**/*.test.+(ts|tsx)"],
};
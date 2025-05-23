module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "^@/(.*)\\.(jpg|jpeg|png|gif|svg)(\\?url)?$":
      "<rootDir>/__mocks__/fileMock.cjs",
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  globals: {
    "ts-jest": {
      diagnostics: false,
      isolatedModules: true,
      tsconfig: {
        allowJs: true,
      },
    },
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
};

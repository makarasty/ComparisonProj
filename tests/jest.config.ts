import type { Config } from "jest";

const config: Config = {
	rootDir: ".",
	testMatch: ["<rootDir>/src/**/*.test.ts", "<rootDir>/src/**/*.spec.ts"],
	transform: {
		"^.+\\.tsx?$": [
			"ts-jest",
			{
				tsconfig: "tsconfig.json",
			},
		],
	},
	testEnvironment: "node",
	clearMocks: true,
	setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
	moduleNameMapper: {
		"^@server/(.*)$": "<rootDir>/../server/src/$1",
	},
};

export default config;

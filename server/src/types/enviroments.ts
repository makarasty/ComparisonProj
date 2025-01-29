declare global {
	namespace NodeJS {
		interface ProcessEnv {
			MONGO_URI: string;
			PORT: string;
			EBAY_CLIENT_ID: string;
			EBAY_CLIENT_SECRET: string;
		}
	}
}

export {};

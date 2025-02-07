import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [
		react(),
	],
	build: {
		minify: "terser",
		sourcemap: false,
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ["react", "react-dom"],
				},
			},
		},
		target: "esnext",
		cssCodeSplit: true,
		reportCompressedSize: false,
	},
	optimizeDeps: {
		include: ["react", "react-dom"],
		esbuildOptions: {
			target: "esnext",
		},
	},
	esbuild: {
		logOverride: { "this-is-undefined-in-esm": "silent" },
	},
});

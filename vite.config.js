// vite.config.js
import {defineConfig} from 'vite';

export default defineConfig(() => {
	return {
		root: './example',
		server: {
			port: 3000,
			hmr: {
				protocol: 'ws', // WebSocket protocol for HMR
				host: 'localhost',
			},
			// hmr: false,
		},
		build: {
			outDir: '../dist',
		},
	}
});
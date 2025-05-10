// vite.config.js
import {defineConfig} from 'vite';

export default defineConfig(() => {
	return {
		root: './example',
		server: {
			port: 3000,
			hmr: {
				// protocol: 'ws', // WebSocket protocol for HMR
				// host: 'localhost',
				overlay: true,
			},
			// hmr: false,
		},
		build: {
			outDir: '../dist',
		},
		plugins: [
			{
				name: 'force-reload-on-component-change',
				handleHotUpdate({ file, server }) {
					if (file.endsWith('cocktail.js') || file.endsWith('todo.js')) {
						console.log('[Vite Plugin] Forcing full reload:', file);
						server.ws.send({ type: 'full-reload' });
					}
				}
			}
		]
	}
});

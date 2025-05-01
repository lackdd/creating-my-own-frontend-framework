// vite.config.js
export default {
	root: 'example', // Make sure to serve from the project root
	server: {
		port: 3000, // Or choose any available port
	},
	build: {
		outDir: '../dist', // Output the build in the /dist folder from the root
	},
}
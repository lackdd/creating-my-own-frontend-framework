// example/main.js (entry)
import { createApp } from 'dotjs/src';
import { router } from './router';
import { App } from './App';
import {GlobalState} from 'dotjs/src/global-state'; // <-- imported, not defined inline
import './components/cocktail.js'

let appInstance = null;

export const globalState = new GlobalState({
	savedItems: [1, 2, 3, 4]
})


function mountApp(AppComponent) {
	appInstance = createApp(AppComponent, {}, { router });
	appInstance.mount(document.body);
}

mountApp(App);


// for vite HMR
if (import.meta.hot) {
	import.meta.hot.accept('./App', (newModule) => {
		console.log('[HMR] Reloading App component...');
		if (appInstance) {
			appInstance.unmount();
		}
		document.body.innerHTML = '';
		mountApp(newModule.App);
	});

	import.meta.hot.accept('./components/cocktail.js', (newModule) => {
		console.log('[HMR] Reloading Cocktail component...');
		// If you're using a router, you may need to manually update the route definition.
		router.updateRouteComponent('/cocktail', newModule.Cocktail); // You'd need to implement this
		if (appInstance) {
			appInstance.unmount();
		}
		document.body.innerHTML = '';
		mountApp(App);
	});

	import.meta.hot.accept('./components/todo.js', (newModule) => {
		console.log('[HMR] Reloading TODO component...');
		// If you're using a router, you may need to manually update the route definition.
		router.updateRouteComponent('/todo', newModule.Cocktail); // You'd need to implement this
		if (appInstance) {
			appInstance.unmount();
		}
		document.body.innerHTML = '';
		mountApp(App);
	});
}


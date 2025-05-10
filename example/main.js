// example/main.js (entry)
import { createApp } from 'dotjs/src';
import { router } from './router.js';
import { App } from './App.js';
import './components/cocktail.js'
import './components/todo.js'

let appInstance = null;

function mountApp(AppComponent) {
	appInstance = createApp(AppComponent, {}, { router });
	appInstance.mount(document.body);
}

mountApp(App);
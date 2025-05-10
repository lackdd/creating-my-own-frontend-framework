import {HashRouter} from 'dotjs/src';
import {TODOapp} from './components/todo.js'
import {Cocktail} from './components/cocktail.js'

const routes = [
	{
		path: '/',
		component: TODOapp,
	},
	{
		path: '/cocktail',
		component: Cocktail,
	}
];

export const router = new HashRouter(routes)

import {HashRouter} from 'dotjs/src';
import {TODOapp} from './components/todo'
import {Cocktail} from './components/cocktail'

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
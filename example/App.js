import {createApp, defineComponent, h, HashRouter, hFragment, RouterOutlet} from 'dotjs/src';
import { router } from './router'

const App = defineComponent({
	render() {
		return hFragment([
			h('header', {}, ["header"]),
			h('main', {style: {width: '30%'}}, [h(RouterOutlet)]),
			h('footer', {}, ["footer"]),
		]);
	}
});

createApp(App, { }, {router}).mount(document.body);
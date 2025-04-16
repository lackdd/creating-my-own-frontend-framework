// define node types
import {withoutNulls} from './utils/arrays.js';

export const DOM_TYPES = {
	TEXT: 'text',
	ELEMENT: 'element',
	FRAGMENT: 'fragment',
}

// function to create element virtual nodes
export function h(tag, props = {}, children = []) {
	return {
		tag,
		props,
		children: mapTextNodes(withoutNulls(children)),
		type: DOM_TYPES.ELEMENT,
	}
}

// transform strings into text virtual nodes
function mapTextNodes(children) {
	return children.map((child) =>
	typeof child === 'string' ? hString(child) : child);
}

// create text virtual node
export function hString(str) {
	return {type: DOM_TYPES.TEXT, value: str};
}

// create fragment virtual nodes
export function hFragment(vNodes) {
	return {
		type: DOM_TYPES.FRAGMENT,
		children: mapTextNodes(withoutNulls(vNodes)),
	}
}



// define node types
import {withoutNulls} from './utils/arrays.js';

export const DOM_TYPES = {
	TEXT: 'text',
	ELEMENT: 'element',
	FRAGMENT: 'fragment',
	COMPONENT: 'component',
	SLOT: 'slot',
}

// function to create element virtual nodes
export function h(tag, props = {}, children = []) {
	const type = typeof tag === 'string' ? DOM_TYPES.ELEMENT : DOM_TYPES.COMPONENT;

	return {
		tag,
		props,
		type,
		children: mapTextNodes(withoutNulls(children)),
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

let hSlotCalled = false
export function didCreateSlot() {
	return hSlotCalled
}

export function resetDidCreateSlot() {
	hSlotCalled = false
}

export function hSlot(children = []) {
	hSlotCalled = true
	return { type: DOM_TYPES.SLOT, children }
}

export function extractChildren(vdom) {
	if (vdom.children == null) {
		return []
	}

	const children = []

	for (const child of vdom.children) {
		if (child.type === DOM_TYPES.FRAGMENT) {
			children.push(...extractChildren(child))
		} else {
			children.push(child)
		}
	}

	return children
}


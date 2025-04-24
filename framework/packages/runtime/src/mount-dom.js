import { DOM_TYPES} from './h.js';
import { setAttributes } from './attributes.js'
import { addEventListeners } from './events.js'

export function mountDom(vdom, parentEl, index) {
	// console.log("Mounting DOM!");
	switch (vdom.type) {
		case DOM_TYPES.TEXT: {
			// console.log(`Mounting DOM of type: ${vdom.type}`);
			createTextNode(vdom, parentEl, index)
			break
		}

		case DOM_TYPES.ELEMENT: {
			// console.log(`Mounting DOM of type: ${vdom.type}`);
			createElementNode(vdom, parentEl, index)
			break
		}

		case DOM_TYPES.FRAGMENT: {
			// console.log(`Mounting DOM of type: ${vdom.type}`);
			createFragmentNode(vdom, parentEl, index)
			break
		}

		default: {
			throw new Error(`Can't mount DOM of type: ${vdom.type}`)
		}
	}
}

// create text node
function createTextNode(vdom, parentEl, index) {
	const { value } = vdom;

	const textNode = document.createTextNode(value);
	vdom.el = textNode;

	insert(textNode, parentEl, index)
}

// create element node
function createElementNode(vdom, parentEl, index) {
	const { tag, props, children } = vdom;

	const element = document.createElement(tag);
	addProps(element, props, vdom);
	vdom.el = element;

	// create nodes for each child
	children.forEach((child) => mountDom(child, element));

	insert(element, parentEl, index)
}

function addProps(el, props, vdom) {
	const { on: events, ...attrs } = props;

	vdom.listeners = addEventListeners(events, el);
	setAttributes(el, attrs);
}

// create fragment node
function createFragmentNode(vdom, parentEl, index) {
	const { children } = vdom;
	vdom.el = parentEl;

	// create nodes for each child
	children.forEach((child, i) => {
		mountDom(child, parentEl, index ? index + i : null)})
}

function insert(el, parentEl, index) {
	// append if index is null or undefined
	if (index == null) {
		parentEl.append(el);
		return
	}

	// throw error if index is negative
	if (index < 0) {
		throw new Error(`Index must be a positive integer, got ${index}`)
	}

	const children = parentEl.childNodes;

	// if index is beyong last child, simply append element
	if (index >= children.length) {
		parentEl.append(el);
	} else { // otherwise append element at given index
		parentEl.insertBefore(el, children[index]);
	}


}

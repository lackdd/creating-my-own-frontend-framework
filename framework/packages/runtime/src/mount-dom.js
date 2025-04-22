import { DOM_TYPES} from './h.js';
import { setAttributes } from './attributes.js'
import { addEventListeners } from './events.js'

export function mountDom(vdom, parentEl) {
	// console.log("Mounting DOM!");
	switch (vdom.type) {
		case DOM_TYPES.TEXT: {
			// console.log(`Mounting DOM of type: ${vdom.type}`);
			createTextNode(vdom, parentEl)
			break
		}

		case DOM_TYPES.ELEMENT: {
			// console.log(`Mounting DOM of type: ${vdom.type}`);
			createElementNode(vdom, parentEl)
			break
		}

		case DOM_TYPES.FRAGMENT: {
			// console.log(`Mounting DOM of type: ${vdom.type}`);
			createFragmentNode(vdom, parentEl)
			break
		}

		default: {
			throw new Error(`Can't mount DOM of type: ${vdom.type}`)
		}
	}
}

// create text node
function createTextNode(vdom, parentEl) {
	const { value } = vdom;

	const textNode = document.createTextNode(value);
	vdom.el = textNode;

	parentEl.append(textNode);
}

// create element node
function createElementNode(vdom, parentEl) {
	const { tag, props, children } = vdom;

	const element = document.createElement(tag);
	addProps(element, props, vdom);
	vdom.el = element;

	// create nodes for each child
	children.forEach((child) => mountDom(child, element));
	parentEl.append(element);
}

function addProps(el, props, vdom) {
	const { on: events, ...attrs } = props;

	vdom.listeners = addEventListeners(events, el);
	setAttributes(el, attrs);
}

// create fragment node
function createFragmentNode(vdom, parentEl) {
	const { children } = vdom;
	vdom.el = parentEl;

	// create nodes for each child
	children.forEach((child) => {mountDom(child, parentEl)})
}

import { DOM_TYPES} from './h.js';
import { setAttributes } from './attributes.js'
import { addEventListeners } from './events.js'
import { extractPropsAndEvents } from './utils/props.js'

export function mountDom(vdom, parentEl, index, hostComponent = null) {
	// console.log("Mounting DOM!");
	switch (vdom.type) {
		case DOM_TYPES.TEXT: {
			// console.log(`Mounting DOM of type: ${vdom.type}`);
			createTextNode(vdom, parentEl, index)
			break
		}

		case DOM_TYPES.ELEMENT: {
			// console.log(`Mounting DOM of type: ${vdom.type}`);
			createElementNode(vdom, parentEl, index, hostComponent)
			break
		}

		case DOM_TYPES.FRAGMENT: {
			// console.log(`Mounting DOM of type: ${vdom.type}`);
			createFragmentNode(vdom, parentEl, index, hostComponent)
			break
		}

		case DOM_TYPES.COMPONENT: {
			// console.log(`Mounting DOM of type: ${vdom.type}`);
			createComponentNode(vdom, parentEl, index, hostComponent)
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
function createElementNode(vdom, parentEl, index, hostComponent) {
	const { tag, props, children } = vdom;

	const element = document.createElement(tag);
	addProps(element, props, vdom, hostComponent);
	vdom.el = element;

	// create nodes for each child
	children.forEach((child) => mountDom(child, element, null, hostComponent));

	insert(element, parentEl, index)
}

function addProps(el, props, vdom, hostComponent) {
	const { on: events, ...attrs } = props;

	vdom.listeners = addEventListeners(events, el, hostComponent);
	setAttributes(el, attrs);
}

// create fragment node
function createFragmentNode(vdom, parentEl, index, hostComponent) {
	const { children } = vdom;
	vdom.el = parentEl;

	// create nodes for each child
	children.forEach((child, i) => {
		mountDom(child, parentEl, index ? index + i : null, hostComponent)})
}

function createComponentNode(vdom, parentEl, index, hostComponent) {
	const Component = vdom.tag;
	const { props, events } = extractPropsAndEvents(vdom)
	const component = new Component(props, events, hostComponent)

	component.mount(parentEl, index);
	vdom.component = component;
	vdom.el = component.firstElement;
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

	// if index is beyond last child, simply append element
	if (index >= children.length) {
		parentEl.append(el);
	} else { // otherwise append element at given index
		parentEl.insertBefore(el, children[index]);
	}


}

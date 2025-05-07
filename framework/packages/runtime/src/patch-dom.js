import { destroyDom } from './destroy-dom.js'
import { mountDom } from './mount-dom.js'
import { areNodesEqual } from './nodes-equal.js'
import {DOM_TYPES, extractChildren, isComponent} from './h.js';
import {objectsDiff} from './utils/objects.js';
import {removeAttribute, removeStyle, setAttribute, setStyle} from './attributes.js';
import {ARRAY_DIFF_OP, arraysDiff, arraysDiffSequence} from './utils/arrays.js';
import {isNotBlankOrEmptyString} from './utils/strings.js';
import {addEventListener} from './events.js';
import { extractPropsAndEvents } from './utils/props.js'

export function patchDom(oldVdom, newVdom, parentEl, hostComponent = null) {
	if (!areNodesEqual(oldVdom, newVdom)) {
		const index = findIndexInParent(parentEl, oldVdom.el);
		destroyDom(oldVdom);
		mountDom(newVdom, parentEl, index, hostComponent);

		return newVdom;
	}

	newVdom.el = oldVdom.el;

	switch (newVdom.type) {
		case DOM_TYPES.TEXT: {
			patchText(oldVdom, newVdom);
			return newVdom
		}
		case DOM_TYPES.ELEMENT: {
			patchElement(oldVdom, newVdom, hostComponent);
			break
		}
		case DOM_TYPES.COMPONENT: {
			patchComponent(oldVdom, newVdom);
			break
		}
	}

	patchChildren(oldVdom, newVdom, hostComponent);

	return newVdom

}

function findIndexInParent(parentEl, el) {
	const index = Array.from(parentEl.childNodes).indexOf(el);
	if (index < 0) {
		return null
	}
	return index
}

function patchText(oldVdom, newVdom) {
	const el = oldVdom.el;
	const {value: oldText} = oldVdom;
	const {value: newText} = newVdom;

	if (oldText !== newText) {
		el.nodeValue = newText;
	}
}

function patchElement(oldVdom, newVdom, hostComponent) {
	const el = oldVdom.el;

	const {
		class: oldClass,
		style: oldStyle,
		on: oldEvents,
		...oldAttrs
	} = oldVdom.props;

	const {
		class: newClass,
		style: newStyle,
		on: newEvents,
		...newAttrs
	} = newVdom.props;

	const { listeners: oldListeners } = oldVdom;

	patchAttrs(el, oldAttrs, newAttrs);
	patchClasses(el, oldClass, newClass);
	patchStyles(el, oldStyle, newStyle);

	newVdom.listeners = patchEvents(el, oldListeners, oldEvents, newEvents, hostComponent);
}

function patchComponent(oldVdom, newVdom) {
	const { component } = oldVdom;
	const { children } = newVdom
	const { props } = extractPropsAndEvents(newVdom)

	component.setExternalContent(children)
	component.updateProps(props);

	newVdom.component = component;
	newVdom.el = component.firstElement;
}


function patchAttrs(el, oldAttrs, newAttrs) {
	const { added, removed, updated } = objectsDiff(oldAttrs, newAttrs);

	for (const attr of removed) {
		removeAttribute(el, attr);
	}

	for (const attr of added.concat(updated)) {
		setAttribute(el, attr, newAttrs[attr]);
	}
}

function patchClasses(el, oldClass, newClass) {
	const oldClasses = toClassList(oldClass);
	const newClasses = toClassList(newClass);

	const { added, removed } = arraysDiff(oldClasses, newClasses);

	if (removed.length > 0) {
		el.classList.remove(...removed);
	}
	if (added.length > 0) {
		el.classList.add(...added);
	}
}

function toClassList(classes = '') {
	return Array.isArray(classes)
		? classes.filter(isNotBlankOrEmptyString)
		: classes.split(/(\s+)/)
			.filter(isNotBlankOrEmptyString)
}

function patchStyles(el, oldStyle = {}, newStyle = {}) {
	const { added, removed, updated } = objectsDiff(oldStyle, newStyle);

	for (const style of removed) {
		removeStyle(el, style);
	}
	for (const style of added.concat(updated)) {
		setStyle(el, style, newStyle[style]);
	}
}

function patchEvents(el, oldListeners = {}, oldEvents = {}, newEvents = {}, hostComponent) {
	const { removed, added, updated } = objectsDiff(oldEvents, newEvents);

	for (const eventName of removed.concat(updated)) {
		el.removeEventListener(eventName, oldListeners[eventName]);
	}

	const addedListeners = {};

	for (const eventName of added.concat(updated)) {
		const listener = addEventListener(eventName, newEvents[eventName], el, hostComponent);
		addedListeners[eventName] = listener;
	}
	return addedListeners
}

function patchChildren(oldVdom, newVdom, hostComponent) {
	const oldChildren = extractChildren(oldVdom);
	const newChildren = extractChildren(newVdom);
	const parentEl = oldVdom.el;

	const diffSeq = arraysDiffSequence(
		oldChildren,
		newChildren,
		areNodesEqual
	)

	for (const operation of diffSeq) {
		const { originalIndex, index, item } = operation;
		// const offset = hostComponent?.offset ?? 0

		switch (operation.op) {
			case ARRAY_DIFF_OP.ADD: {
				mountDom(item, parentEl, index);
				break
			}
			case ARRAY_DIFF_OP.REMOVE: {
				destroyDom(item);
				break
			}
			case ARRAY_DIFF_OP.MOVE: {
				const oldChild = oldChildren[originalIndex];
				const newChild = newChildren[index];
				const elAtTargetIndex = parentEl.childNodes[index];

				const elementsToMove = isComponent(oldChildren)
					? oldChild.component.elements
					: [oldChild.el]

				elementsToMove.forEach((element) => {
					parentEl.insertBefore(element, elAtTargetIndex);
					patchDom(oldChild, newChild, parentEl, hostComponent);
				})

				break
			}
			case ARRAY_DIFF_OP.NOOP: {
				patchDom(oldChildren[originalIndex], newChildren[index], parentEl, hostComponent);
				break
			}
		}
	}
}

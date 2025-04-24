// remove null and undefined values from array of children
export function withoutNulls(arr) {
	return arr.filter((item) => item != null);
}

// todo manage the indices as well because the order of classes matters
export function arraysDiff(oldArray, newArray) {
	return {
		added: newArray.filter(
			(newItem) => !oldArray.includes(newItem)
		),
		removed: oldArray.filter(
			(oldItem) => !newArray.includes(oldItem)
		),
	}
}

export const ARRAY_DIFF_OP = {
	ADD: 'add',
	REMOVE: 'remove',
	MOVE: 'move',
	NOOP: 'noop',
}

class ArrayWithOriginalIndices {
	#array = []
	#originalIndices = []
	#equalsFn

	constructor(array, equalsFn) {
		this.#array = [...array]
		this.#originalIndices = array.map((_, i) => i)
		this.#equalsFn = equalsFn
	}

	get length() {
		return this.#array.length
	}

	isRemoval(index, newArray) {
		if (index >= this.length) {
			return false
		}

		const item = this.#array[index]
		const indexInNewArray = newArray.findIndex((newItem) =>
			this.#equalsFn(item, newItem)
		)

		return indexInNewArray === -1
	}

	removeItem(index) {
		const operation = {
			op: ARRAY_DIFF_OP.REMOVE,
			index,
			item: this.#array[index],
		}

		this.#array.splice(index, 1)
		this.#originalIndices.splice(index, 1)

		return operation
	}

	isNoop(index, newArray) {
		if (index >= this.length) {
			return false
		}

		const item = this.#array[index]
		const newItem = newArray[index]

		return this.#equalsFn(item, newItem)
	}

	originalIndexAt(index) {
		return this.#originalIndices[index]
	}

	noopItem(index) {
		return {
			op: ARRAY_DIFF_OP.NOOP,
			originalIndex: this.originalIndexAt(index),
			index,
			item: this.#array[index],
		}
	}

	isAddition(item, fromIdx) {
		return this.findIndexFrom(item, fromIdx) === -1
	}

	findIndexFrom(item, fromIndex) {
		for (let i = fromIndex; i < this.length; i++) {
			if (this.#equalsFn(item, this.#array[i])) {
				return i
			}
		}

		return -1
	}

	addItem(item, index) {
		const operation = {
			op: ARRAY_DIFF_OP.ADD,
			index,
			item,
		}

		this.#array.splice(index, 0, item)
		this.#originalIndices.splice(index, 0, -1)

		return operation
	}

	moveItem(item, toIndex) {
		const fromIndex = this.findIndexFrom(item, toIndex)

		const operation = {
			op: ARRAY_DIFF_OP.MOVE,
			originalIndex: this.originalIndexAt(fromIndex),
			from: fromIndex,
			index: toIndex,
			item: this.#array[fromIndex],
		}

		const [_item] = this.#array.splice(fromIndex, 1)
		this.#array.splice(toIndex, 0, _item)

		const [originalIndex] =
			this.#originalIndices.splice(fromIndex, 1)
		this.#originalIndices.splice(toIndex, 0, originalIndex)

		return operation
	}

	removeItemsAfter(index) {
		const operations = []

		while (this.length > index) {
			operations.push(this.removeItem(index))
		}

		return operations
	}
}

export function arraysDiffSequence(
	oldArray,
	newArray,
	equalsFn = (a, b) => a === b
) {
	const sequence = []
	const array = new ArrayWithOriginalIndices(oldArray, equalsFn)

	for (let index = 0; index < newArray.length; index++) {
		if (array.isRemoval(index, newArray)) {
			sequence.push(array.removeItem(index))
			index--
			continue
		}

		if (array.isNoop(index, newArray)) {
			sequence.push(array.noopItem(index))
			continue
		}

		const item = newArray[index]

		if (array.isAddition(item, index)) {
			sequence.push(array.addItem(item, index))
			continue
		}

		sequence.push(array.moveItem(item, index))
	}

	sequence.push(...array.removeItemsAfter(newArray.length))

	return sequence
}

export function applyArrayDiffSequence(array, sequence) {
	/*const equalsFn = (a, b) => a === b;*/

	/*const objectArray = new ArrayWithOriginalIndices(array, equalsFn);*/

	/*console.log("Array:", array);
	console.log("objectArray:", objectArray);*/

	console.log("Array before", array);



	sequence.forEach(operation => {
		switch (operation.op) {
			case "add":
				console.log("case add");
				array.splice(operation.index, 0, operation.item);
				console.log("array after add:", array);
				break;
			case "remove":
				console.log("case remove");
				array.splice(operation.index, 1);
				console.log("array after remove:", array);
				break;
			case "move":
				console.log("case move");
				const [_item] = array.splice(operation.from, 1)
				array.splice(operation.index, 0, _item)
				console.log("array after move:", array);
				break;
			default: // noop
				console.log("case noop");
				console.log("array after noop:", array);
		}
	})

	// const newArray = array.map(item => {
	// 	console.log("operation:", operation );
	// 	switch (operation.op) {
	// 		case "add":
	// 			// objectArray.addItem(operation.item, operation.index);
	// 			console.log("case add");
	// 			array.splice(operation.index, 0, operation.index);
	// 			break;
	// 		case "remove":
	// 			// objectArray.removeItem(operation.index);
	// 			console.log("case remove");
	// 			array.splice(operation.index, 1);
	// 			break;
	// 		case "move":
	// 			// objectArray.moveItem(operation.item, operation.index);
	// 			console.log("case move");
	// 			const [_item] = array.splice(operation.originalIndex, 1)
	// 			array.splice(operation.originalIndex, 0, _item)
	// 			break;
	// 		// case "noop":
	// 		// 	// objectArray.noopItem(operation.index);
	// 		//
	// 		// 	break;
	// 		default: // noop
	// 			console.log("case noop");
	// 	}
	// })

	console.log("Array after", array);

	return array;
}



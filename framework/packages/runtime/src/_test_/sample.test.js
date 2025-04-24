import { describe, it, expect } from 'vitest';
import {objectsDiff} from '../objects';
import {applyArrayDiffSequence, arraysDiffSequence} from '../utils/arrays';


describe('ObjectsDiff', () => {
	it('default test', () => {

		const oldObj = {
			type: 'number',
			disabled: false,
			max: 999,
		};

		const newObj = {
			type: 'number',
			disabled: true,
			min: 0,
		};

		expect(
			objectsDiff(oldObj, newObj))
			.toStrictEqual(
				{
					added: ['min',],
					removed: ['max',],
					updated: ['disabled',],
				})
	})

	it('should have no diff', () => {
		const oldObj = {foo: 'bar',};
		const newObj = {foo: 'bar',};

		const { added, removed, updated } = objectsDiff(oldObj, newObj);

		expect(added).toEqual([]);
		expect(removed).toEqual([]);
		expect(updated).toEqual([]);
	})

	it('should add key', () => {
		const oldObj = {};
		const newObj = { foo: 'bar' };

		const { added, removed, updated } = objectsDiff(oldObj, newObj);

		expect(added).toEqual(['foo']);
		expect(removed).toEqual([]);
		expect(updated).toEqual([]);
	})

	it('should remove key', () => {
		const oldObj = {foo: 'bar',};
		const newObj = {};

		const { added, removed, updated } = objectsDiff(oldObj, newObj);

		expect(added).toEqual([]);
		expect(removed).toEqual(['foo']);
		expect(updated).toEqual([]);
	})

	it('should update value', () => {
		const arr = [1, 2, 3]
		const oldObj = {foo: 'bar', arr};
		const newObj = {foo: 'rab', arr};

		const { added, removed, updated } = objectsDiff(oldObj, newObj);

		expect(added).toEqual([]);
		expect(removed).toEqual([]);
		expect(updated).toEqual(['foo']);
	})

})

describe('applyArrayDiffSequence', () => {
	it('should return correct new array', () => {
		const oldArray = ['A', 'A', 'B', 'C']
		const newArray = ['C', 'K', 'A', 'B']

		const sequence = arraysDiffSequence(oldArray, newArray);

		const newnewArray = applyArrayDiffSequence(oldArray, sequence);

		expect(newArray).toEqual(newnewArray);
	});
})


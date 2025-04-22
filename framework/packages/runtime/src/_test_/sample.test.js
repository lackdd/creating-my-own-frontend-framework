import { expect, test } from 'vitest';
import {h} from '../h';
import {objectsDiff} from '../objects';

test('sample test', () => {
	expect(1).toBe(1)
})

test('objectsDiff test: default', () => {

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

test('objectsDiff test: no diff', () => {
	const oldObj = {foo: 'bar',};
	const newObj = {foo: 'bar',};
	const { added, removed, updated } = objectsDiff(oldObj, newObj);

	expect(added).toEqual([]);
	expect(removed).toEqual([]);
	expect(updated).toEqual([]);
})

test('objectsDiff test: add key', () => {
	const oldObj = {}
	const newObj = { foo: 'bar' }
	const { added, removed, updated } = objectsDiff(oldObj, newObj);

	expect(added).toEqual(['foo'])
	expect(removed).toEqual([])
	expect(updated).toEqual([])
})

test('objectsDiff test: remove key', () => {
	const oldObj = {foo: 'bar',};
	const newObj = {};
	const { added, removed, updated } = objectsDiff(oldObj, newObj);

	expect(added).toEqual([]);
	expect(removed).toEqual(['foo']);
	expect(updated).toEqual([]);
})

test('objectsDiff test: update value', () => {
	const arr = [1, 2, 3]
	const oldObj = {foo: 'bar', arr};
	const newObj = {foo: 'rab', arr};
	const { added, removed, updated } = objectsDiff(oldObj, newObj);

	expect(added).toEqual([]);
	expect(removed).toEqual([]);
	expect(updated).toEqual(['foo']);
})


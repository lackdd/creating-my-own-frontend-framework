// remove null and undefined values from array of children
export function withoutNulls(arr) {
	return arr.filter((item) => item != null);
}

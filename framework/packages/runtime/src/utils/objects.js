export function objectsDiff(oldObj, newObj) {
    const oldKeys = Object.keys(oldObj);
    const newKeys = Object.keys(newObj);

    return {
        // todo can make more efficient if you don't iterate over the newKeys list twice
        added: newKeys.filter((key) => !(key in oldObj)),
        removed: oldKeys.filter((key) => !(key in newObj)),
        updated: newKeys.filter((key) => key in oldObj && oldObj[key] !== newObj[key])
    }
}

export function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop)
}
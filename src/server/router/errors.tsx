export function getErrorList() {
    const path = `../../../.cache/errors.json`;
    delete require.cache[require.resolve(path)]
    return require(path).errors;
}
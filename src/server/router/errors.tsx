export function getErrorList() {
    const path = `../../../.cache/errors.json`;
    try {
        delete require.cache[require.resolve(path)]
        return require(path).errors;
    } catch(error) {
        return null;
    }
}
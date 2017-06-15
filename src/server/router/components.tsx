export function getComponentList() {
    const path = `../../../.cache/components.json`;
    delete require.cache[require.resolve(path)]
    return require(path).reactComponents;
}

export function getComponent(id) {
    return getComponentList()[id];
}

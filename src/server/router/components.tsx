export function getComponentList() {
    const path = `../../../.cache/components.json`;
    delete require.cache[require.resolve(path)]
    return require(path).reactComponents.filter(c => !c.isPrivate);
}

export function getComponent(id) {
    return getComponentList()[id];
}

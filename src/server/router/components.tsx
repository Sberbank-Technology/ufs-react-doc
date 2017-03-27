export function getComponentList() {
    return require(`../../../.cache/components.json`).reactComponents;
}

export function getComponent(id) {
    return getComponentList()[id];
}

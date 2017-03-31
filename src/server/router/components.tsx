export function getComponentList() {
    return require(`../../../lib/.cache/components.json`).reactComponents;
}

export function getComponent(id) {
    return getComponentList()[id];
}

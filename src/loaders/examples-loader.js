const path = require('path');
const fs = require('fs');
const lodash = require('lodash');


function stringifyExample(example) {
    example = lodash.trim(example);
    return `{
        component: require(${JSON.stringify(example)}),
        source: require(${JSON.stringify('!!raw-loader!' + example)})
    }`
}

function stringifyComponent(component) {
    const { srcPath, className } = component;
    const key = [srcPath, className].join(':');
    return `
        ${JSON.stringify(key)}: [
            ${component.examples
                .map(stringifyExample)
                .join(',')}
        ]
    `
}

module.exports = function() { };
module.exports.pitch = function() {

    const jsonPath = path.resolve(__dirname, '../../.cache/components.json');
    const components = require(jsonPath).reactComponents;

    const srcPath = this.options.examples.srcPath;
    const commonDir = path.parse(path.join(process.cwd(), srcPath)).dir;
    this.addContextDependency(commonDir);

    const js = `{ ${components.map(stringifyComponent).join(', ')} }`;
    return `module.exports = ${js};`;
}

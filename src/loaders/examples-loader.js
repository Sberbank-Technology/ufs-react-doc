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
    if (require.cache[require.resolve(jsonPath)]) {
        delete require.cache[require.resolve(jsonPath)]
    }
    const components = require(jsonPath).reactComponents;

    const hasExamples = components.filter((component) => {
        const examples = component.examples;
        if (examples == undefined) {
            return false;
        } else {
            return examples.length > 0
        }
    }).length > 0;

    if (!hasExamples) {
        return `module.exports = {};`;
    }
    
    const srcPath = this.options.examples.srcPath;
    const commonDir = path.parse(path.join(process.cwd(), srcPath)).dir;
    this.addContextDependency(commonDir);

    const js = `{
        projectRoot: require(${JSON.stringify(path.join(process.cwd(), srcPath))}),
        ${components.map(stringifyComponent).join(', ')}
    }`;
    return `module.exports = ${js};`;
}

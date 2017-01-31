"use strict";

var fs = require('fs');
var hbs = require('handlebars');
var _ = require('lodash');

var mkpath = require('mkpath');
var path = require('path');
var typedoc = require('typedoc');

/**
 * Restore module structure with props descriptions using typedoc.json
 *
 * @param {Object} options
 * @param {string} options.targetPath Output path for generated tsx with props description
 * @param {string} options.sourcesPath Original source path
 * @param {string} options.templatePath handlebars template path
 * @param {Object} options.json Contents of typedoc.json
 */
module.exports = function (options) {
    mkpath.sync(options.targetPath);
    let targetPath = fs.realpathSync(options.targetPath) + path.sep,
        sourcesPath = fs.realpathSync(options.sourcesPath) + path.sep,
        json = options.json,
        template = hbs.compile(fs.readFileSync(options.templatePath).toString()),
        index = extractTypesIndex(json);

    json.children.forEach((module) => {
        // For each tsx file

        // Skip empty module
        if (!module.children) {
            return;
        }

        let hasDefault = false;

        let exports = module.children.map((component) => {
            let props = extractComponentProps(component, index),
                name = component.name,
                data = props && props.children ? normalizeProps(props.children, index) : {};

            if (name === "default") {
                hasDefault = true;
            }

            return {
                name: name,
                data: JSON.stringify(data)
            };
        });

        // Add default export
        if (!hasDefault) {
            exports.push({
                name: "default",
                data: JSON.stringify({})
            });
        }

        // Get target path
        let pathName = path.normalize(module.originalName).replace(sourcesPath, targetPath);

        // Create path
        mkpath.sync(path.resolve(pathName, '..'));

        // Generate tsx using handlebars template
        fs.writeFileSync(pathName, template({ exports: exports }));
    });

    let srcIndex = fs.readFileSync(sourcesPath + 'index.tsx').toString();

    srcIndex = srcIndex.replace(
        /import\s(\w+)\sfrom/gm,
        'import { $1 } from'
    );

    srcIndex = srcIndex.replace(
        /import\s(\w+\s*,\s*)([\s{,]+)/gm,
        'import { $1'
    );

    // Copy index file
    fs.writeFileSync(targetPath + 'props.tsx', srcIndex);
};

/**
 * Recursively create id type map for descriptions
 *
 * @param item
 * @returns {Object}
 */
function extractTypesIndex(item) {
    let index = {};

    item.children && item.children.forEach((item) => {
        index[item.id] = item;

        _.extend(index, extractTypesIndex(item));
    });

    return index;
}

/**
 * Extract Props description for component
 * returns null if its not component.
 * returns null if component doesn't have props.
 *
 * @param candidate
 * @returns {Object}
 */
function extractComponentProps(candidate, index) {
    if (!candidate) {
        return null;
    }

    if (candidate.kindString !== "Class") {
        return null;
    }

    let extendedTypes = candidate.extendedTypes && candidate.extendedTypes[0];

    if (!extendedTypes) {
        return null;
    }

    if (
        extendedTypes.name === "Component" ||
        extendedTypes.name === "Input"
    ) {
        let props = extendedTypes.typeArguments[0];

        if (props.name === 'any') {
            return null;
        }

        props = props.constraint || props;

        return index[props.id];
    }

    return extractComponentProps(index[extendedTypes.id], index);
}

function normalizeProps(props, index) {
    return props.filter(
        (prop) => !prop.inheritedFrom || prop.inheritedFrom.id
    ).map(
        (prop) => {
            let propType = prop.type;
            if (propType.type === "reference" && propType.id) {
                prop.type = {
                    type: "reflection",
                    declaration: index[propType.id]
                };
            }
            return prop;
        }
        );
}

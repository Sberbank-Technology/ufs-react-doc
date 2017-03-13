export const getType = node => {
    switch (node.type) {
        case 'Identifier':
            return node.name;
        case 'StringTypeAnnotation':
            return 'string';
        case 'NumberTypeAnnotation':
            return 'number';
        case 'BooleanTypeAnnotation':
            return 'boolean';
        case 'ObjectTypeAnnotation':
            return 'Object';
        case 'StringLiteralTypeAnnotation':
            return `"${node.value}"`;
        case 'NumericLiteralTypeAnnotation':
            return node.value;
        case 'FunctionTypeAnnotation':
            return 'Function';
        case 'VoidTypeAnnotation':
            return 'void';
        case 'NullLiteralTypeAnnotation':
            return 'null';
        case 'AnyTypeAnnotation':
            return 'any';
        case 'TupleTypeAnnotation':
            return '[ ' + node.types.map(getType).join(', ') + ' ]'
        case 'NullableTypeAnnotation':
            return '?' + getType(node.typeAnnotation);
        case 'ArrayTypeAnnotation':
            return getType(node.elementType) + '[]';
        case 'GenericTypeAnnotation':
            if (node.id.name === 'Array') {
                let n;
                for (n of node.typeParameters.params) { }
                return getType(n) + '[]';
            }
            return 'Object';
        case 'UnionTypeAnnotation':
            return node.types.map(getType).join(' | ');
        default:
            throw `Unknown type annotation: ${node.type}`;
    }
}

import { resolve } from 'path';
import { existsSync } from 'fs';

export default function(name: string) {
    const inSelfNodeModules = resolve(__dirname, '../../node_modules', name);
    const inParentNodeModules = resolve(__dirname, '../../../', name);
    if (existsSync(inSelfNodeModules)) {
        return inSelfNodeModules;
    } else if (existsSync(inParentNodeModules)) {
        return inParentNodeModules;
    }
    throw `No file ${name} was found neither in ${inSelfNodeModules} nor in ${inParentNodeModules}`;
}

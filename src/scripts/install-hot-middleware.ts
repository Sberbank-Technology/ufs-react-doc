import * as path from 'path';
import * as fs from 'fs';
import * as spawn from 'cross-spawn';

export default function() {
    try {
        const pjSrc = fs.readFileSync(path.join(process.cwd(), 'package.json'));
        const parsed = JSON.parse(pjSrc.toString());
        const deps = 'dependencies';
        const devDeps = 'devDependencies';
        const name = 'webpack-hot-middleware';
        if ((parsed && parsed[deps] && parsed[deps][name]) ||
            (parsed && parsed[devDeps] && parsed[devDeps][name])) {

            return;
        }
    } catch (e) {
    }

    console.log('Installing webpack-hot-middleware to child project...');
    spawn.sync('npm', ['install', 'webpack-hot-middleware', '--save-dev']);
}

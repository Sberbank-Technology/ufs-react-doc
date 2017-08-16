import fetchRemoteLibs from '../scripts/fetch-remote-libs';
import buildBundles from '../scripts/build-bundles';
import generateComponentsJSON from '../utils/generate-components-json';
import start from '../server/';


export default class GenerateJSON {
    private shouldGenerateJSON: boolean = false;

    fullReload = (_, cb) => {
        if (this.shouldGenerateJSON) {
            this.shouldGenerateJSON = false;

            Promise.all<any>(fetchRemoteLibs())
                .then(() => generateComponentsJSON(false))
                .then(cb);
        } else {
            cb();
        }
    }

    partReload = (_, cb) => {
        cb();
    }

    beforeCompileCb = process.argv.indexOf('--full-reload') > 0 ? this.fullReload : this.partReload;

    apply(compiler) {
        compiler.plugin('invalid', filename => {
            if (/\.d.ts$/.test(filename.trim()) === false) {
                this.shouldGenerateJSON = true;
            }
        });

        compiler.plugin('before-compile', this.beforeCompileCb);
    }
};

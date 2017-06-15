import fetchRemoteLibs from '../scripts/fetch-remote-libs';
import buildBundles from '../scripts/build-bundles';
import generateComponentsJSON from '../utils/generate-components-json';
import start from '../server/';

export default class GenerateJSON {

    private shouldGenerateJSON: boolean = false;

    apply(compiler) {
        compiler.plugin('invalid', () => {
            this.shouldGenerateJSON = true;
        });

        compiler.plugin('before-compile', (params, callback) => {
            if (this.shouldGenerateJSON) {
                this.shouldGenerateJSON = false;
                Promise.all<any>(fetchRemoteLibs())
                    .then(() => generateComponentsJSON(false))
                    .then(callback);
            } else {
                callback();
            }
        });
    }
};

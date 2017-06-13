import fetchRemoteLibs from './fetch-remote-libs';
import installHotMiddleware from './install-hot-middleware';
import buildBundles from './build-bundles';
import generateComponentsJSON from './generate-components-json';
import start from '../server/';

export default function() {
    Promise.all<any>(fetchRemoteLibs())
        .then(() => installHotMiddleware())
        .then(() => generateComponentsJSON(false))
        .then(() => buildBundles(true))
        .then(start)
    ;
}

import * as typedoc from 'typedoc';
import * as path from 'path';

const app = new typedoc.Application();

app.generateJson([
    '../../ufs-ui-develop/src/common',
    '../../ufs-ui-develop/src/components'
], './temp');


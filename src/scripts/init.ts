import * as inquirer from 'inquirer';
import * as fs from 'fs';
import * as path from 'path';
import { CONFIG_FILENAME } from '../utils/config';

const Questions: inquirer.Questions = [
    {
        type: 'list',
        name: 'projectType',
        message: 'Choose project type',
        default: 'javascript',
        choices: [
            'javascript',
            'typescript'
        ]
    },
    {
        type: 'input',
        name: 'srcPath',
        message: 'Specify path to the index file relative to current dir',
        default: answers => answers['projectType'] === 'javascript' ?
            'src/index.js' :
            'src/index.ts'
    },
    {
        type: 'input',
        name: 'npmRegistry',
        message: 'Set npm registry path',
        default: 'https://registry.npmjs.org/'
    }
];

export default function() {
    if (fs.existsSync(path.join(process.cwd(), CONFIG_FILENAME))) {
        console.error(`Config file "${CONFIG_FILENAME}" already exists`);
        process.exit(1);
    }
    inquirer.prompt(Questions).then(answers => {
        fs.writeFileSync(
            CONFIG_FILENAME,
            `module.exports = ${JSON.stringify(answers, undefined, 4)}`
        );
        console.info(`Config file "${CONFIG_FILENAME}" successfully created!`);
    });
}

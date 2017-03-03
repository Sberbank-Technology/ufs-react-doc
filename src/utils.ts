import * as fs from 'fs';
import * as Bluebird from 'bluebird';
import * as path from 'path';

export function pathExists(checkPath: string): boolean {
    return fs.existsSync(path.join(__dirname, checkPath));
}

export function getEnvVariable(varname: string): string | null {
    const envVarKey = Object.keys(process.env).find(envVar => envVar.toLowerCase() === varname.toLowerCase());
    return envVarKey ? process.env[envVarKey] : null;
}

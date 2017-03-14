import * as fs from 'fs';
import * as Bluebird from 'bluebird';
import * as path from 'path';
import * as marked from 'marked';

export function pathExists(checkPath: string): boolean {
    const pathParts = checkPath.split('/');
    let base = __dirname;

    for (let pathPart of pathParts) {
        base = path.join(__dirname, pathPart);
        if (!fs.existsSync(base)) {
            return false;
        }
    }

    return true;
}

export function getEnvVariable(varname: string): string | null {
    const envVarKey = Object.keys(process.env).find(envVar => envVar.toLowerCase() === varname.toLowerCase());
    return envVarKey ? process.env[envVarKey] : null;
}

export function markdownToHtml(input: string): string {
    const renderer = new marked.Renderer();
    renderer.paragraph = (text: string) =>
        `<p style="margin: 0; padding: 0">${text}</p>`;
    return marked(input, { renderer });
}

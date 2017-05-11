import * as marked from 'marked';


export function getEnvVariable(varname: string): string | null {
    const envVarKey = Object.keys(process.env)
        .find(envVar => envVar.toLowerCase() === varname.toLowerCase());
    return envVarKey ? process.env[envVarKey] : null;
}

export function markdownToHtml(input: string): string {
    const renderer = new marked.Renderer();

    renderer.paragraph = (text: string) => (
        `<p style="margin: 0; padding: 0">${text}</p>`
    );

    return marked(input, { renderer });
}

export function clearMarkdown(md: string) {
    const res = md
        .replace(/___([а-яa-z0-9\s\^\%\$:\?,]+)___/igm, '$1')
        .replace(/__([а-яa-z0-9\s\^\%\$:\?,]+)__/igm, '$1')
        .replace(/_([а-яa-z0-9\s\^\%\$:\?,]+)_/igm, '$1')

        .replace(/\*\*\*([а-яa-z0-9\s\^\%\$:\?,]+)\*\*\*/igm, '$1')
        .replace(/\*\*([а-яa-z0-9\s\^\%\$:\?,]+)\*\*/igm, '$1')
        .replace(/\*([а-яa-z0-9\s\^\%\$:\?,]+)\*/igm, '$1')

        .replace(/---([а-яa-z0-9\s\^\%\$:\?,]+)---/igm, '$1')

        .replace(/~~~([а-яa-z0-9\s\^\%\$:\?,]+)~~~/igm, '$1')
        .replace(/~~([а-яa-z0-9\s\^\%\$:\?,]+)~~/igm, '$1')
        .replace(/!?\[([а-яa-z0-9\s\^\%\$:\?,]+)\]\(.*:\/\/.*\)/igm, '$1')

      return res;
}
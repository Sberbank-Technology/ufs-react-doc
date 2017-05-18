export default function getEnvVariable(varname: string): string | null {
    const envVarKey = Object.keys(process.env)
        .find(envVar => envVar.toLowerCase() === varname.toLowerCase());
    return envVarKey ? process.env[envVarKey] : null;
}


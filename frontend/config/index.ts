import packageJson from "../package.json";

const getEnvVariable = (
  envVar: string | undefined,
  defaultValue?: string,
): string => {
  if (!envVar) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable not defined`);
  }
  return envVar;
};

export const config = {
  appName: getEnvVariable(process.env.NEXT_PUBLIC_APP_NAME, "DefaultAppName"),
  version: packageJson.version,
  author: packageJson.author,
};

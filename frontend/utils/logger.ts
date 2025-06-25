/* eslint-disable @typescript-eslint/no-unsafe-function-type */
const isDev = process.env.NODE_ENV === "development";

const noop = () => {};

const createDebug = (): Console => {
  const realConsole = console;
  const proxy = {} as Partial<Console>;

  for (const key of Object.keys(realConsole) as (keyof Console)[]) {
    const original = realConsole[key];

    if (typeof original === "function") {
      proxy[key] = isDev
        ? (original as Function).bind(realConsole)
        : (noop as unknown);
    }
  }

  return proxy as Console;
};

export const logger = createDebug();

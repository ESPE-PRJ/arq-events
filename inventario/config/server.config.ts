/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { registerAs } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

const tag = 'server';

const packageJsonPath = path.resolve(__dirname, '../../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

export enum ServerEnvironmentEnum {
  SERVER_NAME = `${tag}.name`,
  SERVER_HOST = `${tag}.host`,
  SERVER_HEADER = `${tag}.header`,
  SERVER_PORT = `${tag}.port`,
  SERVER_VERSION = `${tag}.version`,
}

export default registerAs(tag, () => ({
  name: process.env.SERVER_NAME || 'Server',
  header: process.env.SERVER_NAME || 'Server',
  port: process.env.SERVER_PORT || 'Server',
  version: `${packageJson.version || '0'}`,
}));

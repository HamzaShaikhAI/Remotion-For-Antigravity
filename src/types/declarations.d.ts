// Ambient module declarations for external libraries without bundled types

declare module 'fs-extra' {
  import * as fs from 'fs';
  export * from 'fs';
  export function ensureDirSync(path: string): void;
  export function ensureDir(path: string): Promise<void>;
  export function copySync(src: string, dest: string, options?: any): void;
  export function copy(src: string, dest: string, options?: any): Promise<void>;
  export function removeSync(dir: string): void;
  export function remove(dir: string): Promise<void>;
  export function emptyDirSync(path: string): void;
  export function emptyDir(path: string): Promise<void>;
  export function outputFileSync(file: string, data: any, options?: any): void;
  export function outputFile(file: string, data: any, options?: any): Promise<void>;
  export function readJsonSync(file: string, options?: any): any;
  export function readJson(file: string, options?: any): Promise<any>;
  export function writeJsonSync(file: string, object: any, options?: any): void;
  export function writeJson(file: string, object: any, options?: any): Promise<void>;
}

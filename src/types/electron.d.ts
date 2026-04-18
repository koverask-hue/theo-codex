/**
 * Global type augmentation for the Electron preload bridge.
 *
 * `window.theo` is injected by electron/preload.ts via contextBridge.
 * In the browser (non-Electron) environment it will be undefined; use
 * `isElectron()` from @/lib/electron to guard access.
 */

interface TheoFSEntry {
  name: string;
  isDirectory: boolean;
  isFile: boolean;
}

interface TheoAPI {
  fs: {
    read(filePath: string): Promise<{ content: string }>;
    write(filePath: string, content: string): Promise<{ ok: boolean }>;
    readdir(dirPath: string): Promise<{ entries: TheoFSEntry[] }>;
    exists(filePath: string): Promise<{ exists: boolean }>;
    delete(filePath: string): Promise<{ ok: boolean }>;
    showOpenDialog(options: {
      title?: string;
      defaultPath?: string;
      buttonLabel?: string;
      filters?: Array<{ name: string; extensions: string[] }>;
      properties?: Array<
        | "openFile"
        | "openDirectory"
        | "multiSelections"
        | "createDirectory"
      >;
    }): Promise<{ canceled: boolean; filePaths: string[] }>;
  };
  terminal: {
    exec(
      command: string,
      cwd?: string
    ): Promise<{ stdout: string; stderr: string; exitCode: number }>;
    spawn(
      command: string,
      args: string[],
      cwd?: string
    ): Promise<{ pid: number | undefined }>;
    onStdout(callback: (data: string) => void): () => void;
    onStderr(callback: (data: string) => void): () => void;
    onClose(
      callback: (result: { exitCode: number | null }) => void
    ): () => void;
  };
  git: {
    exec(
      args: string[],
      repoPath: string
    ): Promise<{ stdout: string; stderr: string }>;
    status(repoPath: string): Promise<{ output: string }>;
    diff(repoPath: string): Promise<{ diff: string }>;
  };
  app: {
    getPath(name: string): Promise<string>;
    getVersion(): Promise<string>;
  };
}

declare global {
  interface Window {
    theo?: TheoAPI;
  }
}

export {};

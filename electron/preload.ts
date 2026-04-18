/**
 * Electron preload script.
 *
 * Runs in the renderer process before the page loads.
 * Uses contextBridge to safely expose a typed API to the renderer without
 * enabling full Node.js access (contextIsolation: true, nodeIntegration: false).
 *
 * The exposed `window.theo` object maps directly to the IPC channels defined in
 * electron/main.ts, giving the Next.js UI access to filesystem, terminal and git
 * without needing any Node.js globals.
 */
import { contextBridge, ipcRenderer } from "electron";

const theo = {
  // ── Filesystem ────────────────────────────────────────────────────────────
  fs: {
    read: (filePath: string) =>
      ipcRenderer.invoke("fs:read", filePath) as Promise<{ content: string }>,

    write: (filePath: string, content: string) =>
      ipcRenderer.invoke("fs:write", filePath, content) as Promise<{
        ok: boolean;
      }>,

    readdir: (dirPath: string) =>
      ipcRenderer.invoke("fs:readdir", dirPath) as Promise<{
        entries: Array<{
          name: string;
          isDirectory: boolean;
          isFile: boolean;
        }>;
      }>,

    exists: (filePath: string) =>
      ipcRenderer.invoke("fs:exists", filePath) as Promise<{
        exists: boolean;
      }>,

    delete: (filePath: string) =>
      ipcRenderer.invoke("fs:delete", filePath) as Promise<{ ok: boolean }>,

    showOpenDialog: (options: Electron.OpenDialogOptions) =>
      ipcRenderer.invoke(
        "fs:showOpenDialog",
        options
      ) as Promise<Electron.OpenDialogReturnValue>,
  },

  // ── Terminal ──────────────────────────────────────────────────────────────
  terminal: {
    exec: (command: string, cwd?: string) =>
      ipcRenderer.invoke("terminal:exec", command, cwd) as Promise<{
        stdout: string;
        stderr: string;
        exitCode: number;
      }>,

    spawn: (command: string, args: string[], cwd?: string) =>
      ipcRenderer.invoke("terminal:spawn", command, args, cwd) as Promise<{
        pid: number | undefined;
      }>,

    onStdout: (callback: (data: string) => void) => {
      const handler = (_: Electron.IpcRendererEvent, data: string) =>
        callback(data);
      ipcRenderer.on("terminal:stdout", handler);
      return () => ipcRenderer.off("terminal:stdout", handler);
    },

    onStderr: (callback: (data: string) => void) => {
      const handler = (_: Electron.IpcRendererEvent, data: string) =>
        callback(data);
      ipcRenderer.on("terminal:stderr", handler);
      return () => ipcRenderer.off("terminal:stderr", handler);
    },

    onClose: (callback: (result: { exitCode: number | null }) => void) => {
      const handler = (
        _: Electron.IpcRendererEvent,
        result: { exitCode: number | null }
      ) => callback(result);
      ipcRenderer.on("terminal:close", handler);
      return () => ipcRenderer.off("terminal:close", handler);
    },
  },

  // ── Git ───────────────────────────────────────────────────────────────────
  git: {
    exec: (args: string[], repoPath: string) =>
      ipcRenderer.invoke("git:exec", args, repoPath) as Promise<{
        stdout: string;
        stderr: string;
      }>,

    status: (repoPath: string) =>
      ipcRenderer.invoke("git:status", repoPath) as Promise<{
        output: string;
      }>,

    diff: (repoPath: string) =>
      ipcRenderer.invoke("git:diff", repoPath) as Promise<{ diff: string }>,
  },

  // ── App utilities ─────────────────────────────────────────────────────────
  app: {
    getPath: (name: string) =>
      ipcRenderer.invoke("app:getPath", name) as Promise<string>,

    getVersion: () =>
      ipcRenderer.invoke("app:getVersion") as Promise<string>,
  },
} as const;

contextBridge.exposeInMainWorld("theo", theo);

// Export type for use in Next.js renderer code (src/types/electron.d.ts).
export type TheoAPI = typeof theo;

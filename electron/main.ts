import {
  app,
  BrowserWindow,
  ipcMain,
  shell,
  dialog,
  IpcMainInvokeEvent,
} from "electron";
import * as path from "path";
import * as fs from "fs/promises";
import { exec, spawn } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);


const isDev = process.env.NODE_ENV === "development";

// ─── Window ──────────────────────────────────────────────────────────────────

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    backgroundColor: "#0a0a0a",
    show: false,
  });

  if (isDev) {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(path.join(__dirname, "../out/index.html"));
  }

  win.once("ready-to-show", () => win.show());

  // Open external links in the system browser, not Electron.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  return win;
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// ─── IPC: Filesystem tool ────────────────────────────────────────────────────

ipcMain.handle(
  "fs:read",
  async (_event: IpcMainInvokeEvent, filePath: string) => {
    const content = await fs.readFile(filePath, "utf-8");
    return { content };
  }
);

ipcMain.handle(
  "fs:write",
  async (
    _event: IpcMainInvokeEvent,
    filePath: string,
    content: string
  ) => {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, "utf-8");
    return { ok: true };
  }
);

ipcMain.handle(
  "fs:readdir",
  async (_event: IpcMainInvokeEvent, dirPath: string) => {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return {
      entries: entries.map((e) => ({
        name: e.name,
        isDirectory: e.isDirectory(),
        isFile: e.isFile(),
      })),
    };
  }
);

ipcMain.handle(
  "fs:exists",
  async (_event: IpcMainInvokeEvent, filePath: string) => {
    try {
      await fs.access(filePath);
      return { exists: true };
    } catch {
      return { exists: false };
    }
  }
);

ipcMain.handle(
  "fs:delete",
  async (_event: IpcMainInvokeEvent, filePath: string) => {
    await fs.rm(filePath, { recursive: true, force: true });
    return { ok: true };
  }
);

ipcMain.handle(
  "fs:showOpenDialog",
  async (_event: IpcMainInvokeEvent, options: Electron.OpenDialogOptions) => {
    const result = await dialog.showOpenDialog(options);
    return result;
  }
);

// ─── IPC: Terminal tool ──────────────────────────────────────────────────────

ipcMain.handle(
  "terminal:exec",
  async (
    _event: IpcMainInvokeEvent,
    command: string,
    cwd?: string
  ) => {
    const { stdout, stderr } = await execAsync(command, {
      cwd: cwd ?? app.getPath("home"),
      timeout: 60_000,
    });
    return { stdout, stderr, exitCode: 0 };
  }
);

// Streaming terminal — sends output events back to the focused window.
ipcMain.handle(
  "terminal:spawn",
  (
    event: IpcMainInvokeEvent,
    command: string,
    args: string[],
    cwd?: string
  ) => {
    // shell: false prevents shell metacharacter injection from user-supplied args.
    const child = spawn(command, args, {
      cwd: cwd ?? app.getPath("home"),
      shell: false,
    });

    const sender = event.sender;

    child.stdout.on("data", (data: Buffer) =>
      sender.send("terminal:stdout", data.toString())
    );
    child.stderr.on("data", (data: Buffer) =>
      sender.send("terminal:stderr", data.toString())
    );
    child.on("close", (code) =>
      sender.send("terminal:close", { exitCode: code })
    );

    return { pid: child.pid };
  }
);

// ─── IPC: Git tool ───────────────────────────────────────────────────────────

ipcMain.handle(
  "git:exec",
  (
    _event: IpcMainInvokeEvent,
    args: string[],
    repoPath: string
  ): Promise<{ stdout: string; stderr: string }> => {
    return new Promise((resolve, reject) => {
      // Use spawn with the args array (never string interpolation) to avoid
      // shell injection when user-supplied args contain metacharacters.
      const child = spawn("git", args, { cwd: repoPath, shell: false });
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (d: Buffer) => { stdout += d.toString(); });
      child.stderr.on("data", (d: Buffer) => { stderr += d.toString(); });
      child.on("close", (code) => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`git ${args[0] ?? ""} exited with code ${code}\n${stderr}`));
        }
      });
      child.on("error", reject);
    });
  }
);

ipcMain.handle(
  "git:status",
  (_event: IpcMainInvokeEvent, repoPath: string): Promise<{ output: string }> => {
    return new Promise((resolve, reject) => {
      const child = spawn("git", ["status", "--porcelain"], {
        cwd: repoPath,
        shell: false,
      });
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (d: Buffer) => { stdout += d.toString(); });
      child.stderr.on("data", (d: Buffer) => { stderr += d.toString(); });
      child.on("close", (code) => {
        if (code === 0) {
          resolve({ output: stdout });
        } else {
          reject(new Error(`git status exited with code ${code}\n${stderr}`));
        }
      });
      child.on("error", reject);
    });
  }
);

ipcMain.handle(
  "git:diff",
  (_event: IpcMainInvokeEvent, repoPath: string): Promise<{ diff: string }> => {
    return new Promise((resolve, reject) => {
      const child = spawn("git", ["diff", "HEAD"], {
        cwd: repoPath,
        shell: false,
      });
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (d: Buffer) => { stdout += d.toString(); });
      child.stderr.on("data", (d: Buffer) => { stderr += d.toString(); });
      child.on("close", (code) => {
        if (code === 0) {
          resolve({ diff: stdout });
        } else {
          reject(new Error(`git diff exited with code ${code}\n${stderr}`));
        }
      });
      child.on("error", reject);
    });
  }
);

// ─── IPC: App utilities ──────────────────────────────────────────────────────

const VALID_APP_PATHS: ReadonlySet<string> = new Set([
  "home", "appData", "userData", "sessionData", "temp", "exe",
  "module", "desktop", "documents", "downloads", "music",
  "pictures", "videos", "recent", "logs", "crashDumps",
]);

ipcMain.handle("app:getPath", (_event: IpcMainInvokeEvent, name: string) => {
  if (!VALID_APP_PATHS.has(name)) {
    throw new Error(`Invalid app path name: "${name}"`);
  }
  return app.getPath(name as Parameters<typeof app.getPath>[0]);
});

ipcMain.handle("app:getVersion", () => app.getVersion());

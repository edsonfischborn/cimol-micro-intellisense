import * as vscode from 'vscode';

export class Workspace {
  static runWithProgress = (
    taskLabel: string,
    callback: () => Promise<void>,
  ) => {
    const progressConfig = {
      location: vscode.ProgressLocation.Window,
      title: taskLabel,
      cancellable: false,
    };

    vscode.window.withProgress(progressConfig, callback);
  };

  static readonly deleteFiles = async (paths: string[]) => {
    for (const path of paths) {
      try {
        const uri = vscode.Uri.file(path);
        await vscode.workspace.fs.delete(uri);
      } catch {}
    }
  };

  static getTextDocuments = () => {
    return vscode.workspace.textDocuments;
  };

  static showDocument = (document: vscode.TextDocument) => {
    vscode.window.showTextDocument(document, { preview: false });
  };

  static saveAll = async () => {
    await vscode.workspace.saveAll(true);
  };
}

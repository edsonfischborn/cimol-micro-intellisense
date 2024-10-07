import { basename, dirname, extname } from 'path';
import * as vscode from 'vscode';

import { FileProps } from '../types/FileProps';

export abstract class CurrentFileHandler {
  private readonly ext: string;
  private activeDocument: vscode.TextDocument | undefined;

  constructor(ext: string) {
    this.ext = `.${this.replaceDot(ext)}`;
  }

  private readonly replaceDot = (str: string) => {
    return str?.replace(/\./, '');
  };

  protected readonly getActiveDocument = () => {
    const editor = vscode.window.activeTextEditor;
    const currentDocument = editor?.document;

    if (currentDocument?.fileName?.endsWith(this.ext)) {
      this.activeDocument = currentDocument;
    }

    return this.activeDocument;
  };

  protected readonly getCurrentFile = (): FileProps | undefined => {
    const document = this.getActiveDocument();

    if (document) {
      const path = document.uri.fsPath;
      const ext = extname(path);
      const nameWithoutExt = basename(path, ext);
      const name = `${nameWithoutExt}${ext}`;

      return {
        path,
        name,
        nameWithoutExt,
        ext: this.replaceDot(ext),
        dir: dirname(path),
      };
    }

    return undefined;
  };

  protected getWorkspacePath = () => {
    const fileUri = this.activeDocument?.uri;
    const workspaceFolders = vscode.workspace.workspaceFolders || [];

    for (const folder of workspaceFolders) {
      if (fileUri?.fsPath.startsWith(folder.uri.fsPath)) {
        return folder.uri.fsPath;
      }
    }

    return vscode.env.appRoot;
  };
}

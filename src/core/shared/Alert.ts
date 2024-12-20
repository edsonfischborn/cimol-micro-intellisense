import * as vscode from 'vscode';

export class Alert {
  static info = (msg: string) => {
    return vscode.window.showInformationMessage(msg);
  };

  static warn = (msg: string) => {
    return vscode.window.showWarningMessage(msg);
  };

  static error = (msg: string) => {
    return vscode.window.showErrorMessage(msg);
  };
}

import * as vscode from "vscode";

type Level = "info" | "error";

export const alert = (msg: string, level: Level = "info") => {
  if (level === "error") {
    return vscode.window.showErrorMessage(msg);
  }

  return vscode.window.showInformationMessage(msg);
};

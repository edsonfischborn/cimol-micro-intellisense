import * as vscode from "vscode";
import { EXT_NAME } from "./constants";

let outputChannel: vscode.OutputChannel;

export const logger = (msg: string) => {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel(EXT_NAME);
    outputChannel.show();
  }

  outputChannel.append(`${msg}\n`);
};

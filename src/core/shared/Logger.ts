import * as vscode from 'vscode';

import { Constants } from '../Constants';

let outputChannel: vscode.OutputChannel;

const setupLogger = () => {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel(Constants.EXT_NAME);
  }
};

setupLogger();

export class Logger {
  static clear = () => {
    outputChannel.clear();
  };

  static log = (msg: string) => {
    outputChannel.append(`${msg}\n`);
  };

  static focus = () => {
    outputChannel.show();
  };
}

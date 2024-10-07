import { compile8051 } from '@commands/compile8051';
import { compilePc } from '@commands/compilePc';
import { execPc } from '@commands/execPc';
import { openKeybindings } from '@commands/openKeybindings';
import { openLink } from '@commands/openLink';
import { openSettings } from '@commands/openSettings';
import { Constants } from '@core/Constants';
import { GlobalWebViewProvider } from '@core/GlobalWebViewProvider';
import { SyncSettings } from '@core/SyncSettings';
import * as vscode from 'vscode';

import { Keybindings } from './Keybindings';
import { Logger } from './Logger';

export class Setup {
  static onActivate = (context: vscode.ExtensionContext) => {
    Logger.log(`Starting ${Constants.EXT_NAME}...`);

    this.createViews(context);
    this.registerCommands(context);
    SyncSettings.startSync();

    Logger.log(`Started ${Constants.EXT_NAME}!`);
  };

  private static registerCommands = (context: vscode.ExtensionContext) => {
    const compile8051Command = vscode.commands.registerCommand(
      'cimol.micro-intellisense.compiler.8051',
      compile8051.exec,
    );

    const compilePcCommand = vscode.commands.registerCommand(
      'cimol.micro-intellisense.compiler.pc',
      compilePc.exec,
    );

    const execPcCommand = vscode.commands.registerCommand(
      'cimol.micro-intellisense.compiler.runPc',
      execPc.exec,
    );

    context.subscriptions.push(
      compile8051Command,
      compilePcCommand,
      execPcCommand,
    );
  };

  private static createViews = (context: vscode.ExtensionContext) => {
    const generalView = new GlobalWebViewProvider(context, 'generalView');
    const compilerView = new GlobalWebViewProvider(context, 'compilerView');

    generalView.setWebViewListenners(openLink, openSettings, openKeybindings);
    compilerView.setWebViewListenners(compile8051, compilePc, execPc);

    context.subscriptions.push(generalView.register());
    context.subscriptions.push(compilerView.register());

    compilerView.onRender(() => {
      compilerView.postMessage({
        title: 'Supply commands keybindings',
        command: 'supplyKeybindings',
        payload: Keybindings.list(),
      });
    });
  };
}

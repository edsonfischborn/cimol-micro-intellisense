import { changeCompilerProfile } from '@commands/changeCompilerProfile';
import { compile8051 } from '@commands/compile8051';
import { compilePc } from '@commands/compilePc';
import { execPc } from '@commands/execPc';
import { openKeybindings } from '@commands/openKeybindings';
import { openLink } from '@commands/openLink';
import { openSettings } from '@commands/openSettings';
import { Constants } from '@core/Constants';
import { GlobalWebViewProvider } from '@core/GlobalWebViewProvider';
import { Settings } from '@core/settings';
import { SyncSettings } from '@core/SyncSettings';
import * as vscode from 'vscode';

import { Context } from './Context';
import { Keybindings } from './Keybindings';
import { Logger } from './Logger';

export class Setup {
  private static compilerView: GlobalWebViewProvider;
  private static generalView: GlobalWebViewProvider;

  static onActivate = async (context: vscode.ExtensionContext) => {
    Logger.log(`Starting ${Constants.EXT_NAME}...`);

    Context.setContext(context);
    this.registerCommands();
    this.createViews();
    SyncSettings.onSync(this.syncSettingsWithWebview);
    await SyncSettings.startSync();
    await Context.afterActivation();

    Logger.log(`Started ${Constants.EXT_NAME}!`);
  };

  private static registerCommands = () => {
    compile8051.registerInVsCode();
    compilePc.registerInVsCode();
    execPc.registerInVsCode();
    changeCompilerProfile.registerInVsCode();
  };

  private static syncSettingsWithWebview = async () => {
    const currentProfile = Settings.ext.getProfile();

    this.compilerView.postMessage({
      title: 'Supply current compiler profile',
      command: 'supplyCurrentProfile',
      payload: currentProfile,
    });

    this.compilerView.postMessage({
      title: 'Supply commands keybindings',
      command: 'supplyKeybindings',
      payload: Keybindings.list(),
    });
  };

  private static createViews = () => {
    this.generalView = new GlobalWebViewProvider('generalView');
    this.compilerView = new GlobalWebViewProvider('compilerView');

    this.generalView.setWebViewListenners(
      openLink,
      openSettings,
      openKeybindings,
    );

    this.compilerView.setWebViewListenners(
      compile8051,
      compilePc,
      execPc,
      changeCompilerProfile,
    );

    Context.registerSubscription(this.generalView.register());
    Context.registerSubscription(this.compilerView.register());

    this.compilerView.onRender(this.syncSettingsWithWebview);
  };
}

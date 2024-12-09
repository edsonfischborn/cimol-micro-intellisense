import * as vscode from 'vscode';

import { Constants } from './Constants';
import { Settings } from './settings';
import { Context } from './shared/Context';

export class SyncSettings {
  static startSync = async () => {
    if (Context.isFirstActivation()) {
      await this.onFirstActivation();
    }

    vscode.workspace.onDidChangeConfiguration(async (event) => {
      const listenners = [Constants.EXT_NAME, Constants.MS_CPP_EXT_ALIAS];
      const isSyncRequired = listenners.some((listenner) =>
        event.affectsConfiguration(listenner),
      );

      if (isSyncRequired) {
        await this.syncIncludePaths();
      }
    });
  };

  private static onFirstActivation = async () => {
    await Settings.msCppExt.resetToDefaults();
    await Settings.c.resetToDefaults();
    await Settings.ext.resetToDefaults();
    await Settings.editor.resetToDefaults();
    await this.syncIncludePaths();
  };

  private static syncIncludePaths = async () => {
    const extIncludePaths = Settings.ext.getIncludePaths();
    const includePaths = [...new Set([...extIncludePaths])];

    await Settings.ext.setIncludePaths(includePaths);
    await Settings.msCppExt.setIncludePaths(includePaths);
  };
}

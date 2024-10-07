import * as vscode from 'vscode';

import { Constants } from './Constants';
import { Settings } from './settings';

export class SyncSettings {
  static startSync = async () => {
    this.enforceConfig();

    vscode.workspace.onDidChangeConfiguration((event) => {
      const listenners = [Constants.EXT_NAME, Constants.CPP_EXT_ALIAS];
      const isSyncRequired = listenners.some((listenner) =>
        event.affectsConfiguration(listenner),
      );

      if (isSyncRequired) {
        this.enforceConfig();
      }
    });
  };

  private static enforceConfig = async () => {
    await Settings.cpp.setRequiredConfig();
    await Settings.c.setRequiredConfig();
    await Settings.ext.setRequiredConfig();
    await this.syncIncludePaths();
  };

  private static syncIncludePaths = async () => {
    const extIncludePaths = Settings.ext.getIncludePaths();
    const includePaths = [...new Set([...extIncludePaths])];

    await Settings.cpp.setIncludePaths(includePaths);
  };
}

import * as vscode from 'vscode';

import { Constants } from './Constants';
import { Settings } from './settings';
import { Context } from './shared/Context';

let flagSyncStated = false;
const syncListenners: (() => void)[] = [];

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

      if (!isSyncRequired || Context.isFirstActivation()) {
        return;
      }

      await this.syncIncludePaths();
    });
  };

  static onSync = (cb: () => void) => {
    syncListenners.push(cb);
  };

  private static afterSync = () => {
    for (const syncListenner of syncListenners) {
      syncListenner();
    }
  };

  private static onFirstActivation = async () => {
    await Settings.msCppExt.resetToDefaults();
    await Settings.c.resetToDefaults();
    await Settings.ext.resetToDefaults();
    await Settings.editor.resetToDefaults();
    await this.syncIncludePaths();
  };

  private static syncIncludePaths = async () => {
    if (flagSyncStated) {
      return;
    }

    const currentProfile = Settings.ext.getProfile();

    if (!currentProfile || currentProfile === 'C/PIC') {
      return;
    }

    flagSyncStated = true;

    const profilePathsMap = {
      'C/8051': {
        getPaths: Settings.ext.getSdccIncludePaths,
        setPaths: Settings.ext.setSdccPaths,
      },
      'C/PC': {
        getPaths: Settings.ext.getTccIncludePaths,
        setPaths: Settings.ext.setTccPaths,
      },
    };

    const pathsHandler = profilePathsMap[currentProfile];
    const paths = pathsHandler.getPaths();
    const filteredPaths = [...new Set([...paths])];
    await pathsHandler.setPaths(filteredPaths);
    await Settings.ext.setProfile(currentProfile);
    await Settings.msCppExt.setIncludePaths(filteredPaths);
    this.afterSync();
    flagSyncStated = false;
  };
}

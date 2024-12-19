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

      if (isSyncRequired) {
        await this.syncSettings();
      }
    });
  };

  static addSyncListenner = (cb: () => void) => {
    syncListenners.push(cb);
  };

  private static afterSync = () => {
    for (const syncListenner of syncListenners) {
      syncListenner();
    }
  };

  private static onFirstActivation = async () => {
    await Settings.msCpp.resetToDefaults();
    await Settings.c.resetToDefaults();
    await Settings.ext.resetToDefaults();
    await Settings.editor.resetToDefaults();
    await this.syncSettings();
  };

  private static syncSettings = async () => {
    const currentProfile = Settings.ext.getProfile();

    if (flagSyncStated || !currentProfile) {
      return;
    }

    flagSyncStated = true;
    const profilePathsMap = {
      [Constants.PROFILES.C_8051]: {
        getPaths: Settings.ext.getSdccIncludePaths,
        setPaths: Settings.ext.setSdccPaths,
      },
      [Constants.PROFILES.C_PC]: {
        getPaths: Settings.ext.getTccIncludePaths,
        setPaths: Settings.ext.setTccPaths,
      },
      [Constants.PROFILES.C_PIC]: {
        getPaths: Settings.ext.getCcsIncludePaths,
        setPaths: Settings.ext.setCcsPaths,
      },
    };
    const pathsHandler = profilePathsMap[currentProfile];
    const paths = pathsHandler.getPaths();
    const filteredPaths = [...new Set([...paths])];
    await pathsHandler.setPaths(filteredPaths);
    await Settings.ext.setProfile(currentProfile);
    await Settings.msCpp.setIncludePaths(filteredPaths);
    this.afterSync();
    flagSyncStated = false;
  };
}

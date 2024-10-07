import * as vscode from 'vscode';

import { Constants } from '../core/Constants';
import { CommandListenner } from '../core/types/CommandListenner';

class OpenSettings implements CommandListenner<null> {
  readonly command: string = 'openSettings';

  readonly exec = () => {
    const url = `@ext:${Constants.EXT_AUTHOR}.${Constants.EXT_NAME}`;

    vscode.commands.executeCommand('workbench.action.openSettings', url);
  };
}

export const openSettings = new OpenSettings();

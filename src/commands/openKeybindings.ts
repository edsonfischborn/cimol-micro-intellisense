import * as vscode from 'vscode';

import { Constants } from '../core/Constants';
import { CommandListenner } from '../core/types/CommandListenner';

class OpenKeybindings implements CommandListenner<null> {
  readonly command: string = 'openKeybindings';

  readonly exec = () => {
    const url = Constants.EXT_NAME;

    vscode.commands.executeCommand(
      'workbench.action.openGlobalKeybindings',
      url,
    );
  };
}

export const openKeybindings = new OpenKeybindings();

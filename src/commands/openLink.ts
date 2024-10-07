import * as vscode from 'vscode';

import { CommandListenner } from '../core/types/CommandListenner';

interface MessageProps {
  url: string;
}

class OpenLink implements CommandListenner<MessageProps> {
  readonly command: string = 'openLink';

  readonly exec = (payload: MessageProps) => {
    vscode.env.openExternal(vscode.Uri.parse(payload.url));
  };
}

export const openLink = new OpenLink();

import { Context } from '@core/shared/Context';
import { CommandListenner } from '@core/types/CommandListenner';
import * as vscode from 'vscode';

export abstract class AbstractCommandListenner<
  MessageProps,
> implements CommandListenner<MessageProps> {
  constructor(public readonly command: string) {}

  readonly registerInVsCode = () => {
    const sub = vscode.commands.registerCommand(this.command, this.exec);
    Context.registerSubscription(sub);
  };

  readonly exec = async (): Promise<void> => {
    throw new Error('Method not implemented.');
  };
}

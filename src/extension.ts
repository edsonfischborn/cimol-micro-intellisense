import { Setup } from '@core/shared/Setup';
import * as vscode from 'vscode';

export const activate = async (context: vscode.ExtensionContext) => {
  Setup.onActivate(context);
};

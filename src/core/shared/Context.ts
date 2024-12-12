import * as vscode from 'vscode';

let __context = {} as vscode.ExtensionContext;

export class Context {
  private static firstActivationKey = 'flag_isFirstActivation' + Date.now();

  static setContext = (ctx: vscode.ExtensionContext) => {
    __context = ctx;
  };

  static isFirstActivation = () => {
    return __context.globalState.get<boolean>(this.firstActivationKey, true);
  };

  static afterActivation = async () => {
    await __context.globalState.update(this.firstActivationKey, false);
  };

  static getExtUri = () => {
    return __context.extensionUri;
  };

  static registerSubscription = (disposable: vscode.Disposable) => {
    __context.subscriptions.push(disposable);
  };
}

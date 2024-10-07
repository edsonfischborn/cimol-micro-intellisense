import * as vscode from 'vscode';

import { Logger } from './shared/Logger';
import { CommandListenner } from './types/CommandListenner';

export class GlobalWebViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private _onRender: () => any;
  private webViewListenners: CommandListenner<any>[];
  private readonly rootSegments = ['dist', 'webviews'];

  constructor(
    private readonly extContext: vscode.ExtensionContext,
    private readonly viewId: string,
  ) {
    this._onRender = () => {};
    this.webViewListenners = [];
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.joinPath(...this.rootSegments)],
    };
    webviewView.webview.onDidReceiveMessage(this.listenCommand);
    webviewView.webview.html = this.render(webviewView.webview);
  }

  public readonly setWebViewListenners = (
    ...commandListenners: CommandListenner<any>[]
  ) => {
    this.webViewListenners = commandListenners;
  };

  public readonly postMessage = (
    payload: Omit<vscode.Command, 'arguments'> & { payload: any },
  ) => {
    const payloadWithMeta = {
      ...payload,
      viewId: this.viewId,
    };

    Logger.log(`\nsending to webview ${payload.command}...\n`);

    if (!this._view || !this._view?.visible) {
      Logger.log(`\nWARN webview ${this.viewId} not visible\n`);
    }

    this._view?.webview.postMessage(payloadWithMeta);
  };

  public readonly onRender = (cb: () => void) => {
    this._onRender = cb;
  };

  private readonly listenCommand = (payload: vscode.Command) => {
    if (payload.command === 'webviewReady') {
      this._onRender();
      return;
    }

    for (const listenner of this.webViewListenners) {
      if (listenner.command === payload.command) {
        Logger.log(`\nexecuting command ${payload?.command}...`);
        return listenner.exec(payload);
      }
    }

    Logger.log(`\ncommand ${payload?.command} not found\n`);
  };

  public readonly register = () => {
    return vscode.window.registerWebviewViewProvider(this.viewId, this);
  };

  private joinPath = (...segments: string[]) => {
    return vscode.Uri.joinPath(this.extContext.extensionUri, ...segments);
  };

  private getAsWebViewUri = (
    webView: vscode.Webview,
    ...segments: string[]
  ) => {
    return webView.asWebviewUri(this.joinPath(...segments));
  };

  private readonly getNonce = () => {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  };

  private readonly render = (webview: vscode.Webview) => {
    const nonce = this.getNonce();

    const rootScriptUri = this.getAsWebViewUri(
      webview,
      ...[...this.rootSegments, 'index.js'],
    );

    const rootCssUri = this.getAsWebViewUri(
      webview,
      ...[...this.rootSegments, 'index.css'],
    );

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
          <link rel="stylesheet" href=${rootCssUri}>
          <title>Webview</title>
          <script nonce="${nonce}">
            window.vscodeWebviewApi = window.vscodeWebviewApi || acquireVsCodeApi();

            window.process = {
              viewId: '${this.viewId}',
              vscodeWebviewApi: window.vscodeWebviewApi,
              env: {
                NODE_ENV: 'production'
              }
            };
          </script>
        </head>
        <body>
          <div id="root"></div>
          <script nonce="${nonce}" src="${rootScriptUri}"></script>
          <script nonce="${nonce}">
            document.addEventListener('DOMContentLoaded', () => {
              window.vscodeWebviewApi.postMessage({ command: 'webviewReady', viewId: '${this.viewId}' });
            });
          </script>
        </body>
      </html>
  `;
  };
}

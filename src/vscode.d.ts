declare function acquireVsCodeApi(): {
  postMessage: (message: any) => void;
  setState: (state: any) => void;
  getState: () => any;
};

declare type VscodeWebviewApi = ReturnType<typeof acquireVsCodeApi>;

declare global {
  interface Window {
    process: {
      viewId: string;
      vscodeWebviewApi: VscodeWebviewApi;
    };
  }
}

export {};

import { AbstractCommandListenner } from '@core/abstract/AbstractCommandListenner';
import { Settings } from '@core/settings';
import * as vscode from 'vscode';

class CompilerProfileChanger extends AbstractCommandListenner<null> {
  private readonly label: string = 'Select current compiler profile';

  constructor() {
    super('cimol-micro-intellisense.compiler.changeProfile');
  }

  private readonly profiles: vscode.QuickPickItem[] = [
    { label: 'C/8051' },
    //{ label: 'C/PIC' },
    { label: 'C/PC' },
  ];

  private onSelectProfile = (
    quickPick: vscode.QuickPick<vscode.QuickPickItem>,
  ) => {
    const selectedItems = quickPick.selectedItems;

    if (selectedItems.length > 0) {
      Settings.ext.setProfile(selectedItems[0].label);
    }

    quickPick.hide();
  };

  public exec = async () => {
    const quickPick = vscode.window.createQuickPick();
    const currentProfile = Settings.ext.getProfile();
    quickPick.items = this.profiles;

    if (currentProfile) {
      quickPick.activeItems = this.profiles.filter(
        (p) => p.label === currentProfile,
      );
    }

    quickPick.canSelectMany = false;
    quickPick.placeholder = this.label;
    quickPick.onDidAccept(() => this.onSelectProfile(quickPick));
    quickPick.onDidHide(() => quickPick.dispose());
    quickPick.show();
  };
}

export const changeCompilerProfile = new CompilerProfileChanger();

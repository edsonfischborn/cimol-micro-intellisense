import { existsSync, readFileSync } from 'fs';
import os from 'os';
import path from 'path';

interface Keybinding {
  key: string;
  command: string;
}

const defaultKeybindings: Record<string, string> = {
  'cimol-micro-intellisense.compiler.8051': 'ctrl+alt+f5',
  'cimol-micro-intellisense.compiler.pc': 'ctrl+alt+f6',
  'cimol-micro-intellisense.compiler.runPc': 'ctrl+alt+f7',
};

export class Keybindings {
  private static getKeybindingsFilePath() {
    const platform = os.platform();

    if (platform !== 'win32') {
      return;
    }

    const osPath = process.env.APPDATA || '';
    return path.join(osPath, 'Code', 'User', 'keybindings.json');
  }

  static keyBindingsToMap(keybindings: Keybinding[]) {
    const keyBindingToMap = (
      acc: Record<string, string>,
      keybinding: Keybinding,
    ) => {
      const { command = '', key = '' } = keybinding || {};
      acc[command] = key;
      return acc;
    };

    const keybindingsMap = keybindings.reduce(
      keyBindingToMap,
      {} as Record<string, string>,
    );

    return keybindingsMap || {};
  }

  static fillDefaultKeyBindings(keybindingsMap: Record<string, string>) {
    for (const command in defaultKeybindings) {
      if (!keybindingsMap[command] && !keybindingsMap[`-${command}`]) {
        keybindingsMap[command] = defaultKeybindings[command];
      }
    }

    return keybindingsMap;
  }

  static list(): Record<string, string> {
    const filePath = this.getKeybindingsFilePath();

    if (!filePath || !existsSync(filePath)) {
      return {};
    }

    try {
      const file = readFileSync(filePath, 'utf-8');
      const removeCommentsRgxp = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm;
      const fileWithOutComments = file.replace(removeCommentsRgxp, '$1');
      const keybindingsArr = JSON.parse(fileWithOutComments);

      return this.fillDefaultKeyBindings(this.keyBindingsToMap(keybindingsArr));
    } catch (ex) {
      return {};
    }
  }
}

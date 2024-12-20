import { SettingsHandler } from '../abstract/SettingsHandler';

export class EditorSettings extends SettingsHandler {
  public resetToDefaults = async () => {
    await this.updateConfig('editor.formatOnSave', true);
    await this.updateConfig('editor.tabSize', 2);
  };
}

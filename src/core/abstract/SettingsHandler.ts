import * as vscode from 'vscode';
export abstract class SettingsHandler {
  constructor(
    private readonly settingsAliasKey: string | undefined = undefined,
  ) {}

  public resetToDefaults = async (): Promise<void> => {
    throw new Error('Method is not implemented');
  };

  protected updateConfig = async (sectionToUpdate: string, value: any) => {
    const config = vscode.workspace.getConfiguration(this.settingsAliasKey);
    const configTarget = vscode.ConfigurationTarget.Global;
    await config.update(sectionToUpdate, value, configTarget);
  };

  protected inspectConfig = <T>(
    sectionToInspect: string,
    defaultValue: T,
  ): T => {
    const config = vscode.workspace.getConfiguration(this.settingsAliasKey);
    const inspected = config.inspect<T>(sectionToInspect);

    if (inspected?.globalValue === undefined) {
      return defaultValue;
    }

    return inspected?.globalValue;
  };
}

import * as vscode from 'vscode';

export abstract class SettingsHandler {
  constructor(
    private readonly settingsAliasKey: string | undefined = undefined,
  ) {}

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
    return inspected?.globalValue || defaultValue;
  };
}

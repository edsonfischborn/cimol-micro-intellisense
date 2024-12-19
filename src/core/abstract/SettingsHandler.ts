import { Alert } from '@core/shared/Alert';
import { Workspace } from '@core/shared/Workspace';
import * as vscode from 'vscode';
export abstract class SettingsHandler {
  constructor(
    private readonly settingsAliasKey: string | undefined = undefined,
  ) {}

  protected static readonly settingsFileName = 'settings.json';

  public resetToDefaults = async (): Promise<void> => {
    throw new Error('Method is not implemented');
  };

  private isSettingsOpen = () => {
    const { settingsFileName } = SettingsHandler;
    return Workspace.getTextDocuments().find(
      (doc) => doc.fileName.endsWith(settingsFileName) && doc.isDirty,
    );
  };

  protected updateConfig = async (sectionToUpdate: string, value: any) => {
    if (this.isSettingsOpen()) {
      Alert.warn(`Please save the ${SettingsHandler.settingsFileName} file.`);
    }

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

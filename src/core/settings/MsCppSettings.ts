import { SettingsHandler } from '../abstract/SettingsHandler';
import { Constants } from '../Constants';

export class MsCppSettings extends SettingsHandler {
  private pathsKey = 'default.includePath';

  private defaultPaths: string[] = [];

  constructor() {
    super(Constants.MS_CPP_EXT_ALIAS);
  }

  public resetToDefaults = async () => {
    const configMap = {
      'default.defines': ['_DEBUG', 'UNICODE', '_UNICODE'],
      'default.intelliSenseMode': 'gcc-x64',
      'default.cStandard': 'c89',
      'default.cppStandard': 'c++98',
      'default.compilerPath': '',
      errorSquiggles: 'disabled',
    };

    for (const [key, value] of Object.entries(configMap)) {
      await this.updateConfig(key, value);
    }

    await this.updateConfig(this.pathsKey, this.defaultPaths);
  };

  public setIncludePaths = (paths: string[]) => {
    const uniquePaths = [...new Set([...paths, '${workspaceFolder}'])];
    return this.updateConfig(this.pathsKey, uniquePaths);
  };
}

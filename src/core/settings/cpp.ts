import { SettingsHandler } from '../abstract/SettingsHandler';
import { Constants } from '../Constants';

export class CppSettings extends SettingsHandler {
  private pathsKey = 'default.includePath';

  constructor() {
    super(Constants.CPP_EXT_ALIAS);
  }

  public setRequiredConfig = async () => {
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
  };

  public setIncludePaths = (paths: string[]) => {
    return this.updateConfig(this.pathsKey, paths);
  };
}

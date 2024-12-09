import { SettingsHandler } from '../abstract/SettingsHandler';
import { Constants } from '../Constants';

export class CSettings extends SettingsHandler {
  public resetToDefaults = async () => {
    const configMap = {
      'editor.defaultFormatter': Constants.MS_CPP_EXT_NAME,
    };

    await this.updateConfig('[c]', configMap);
  };
}

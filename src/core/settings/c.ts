import { SettingsHandler } from '../abstract/SettingsHandler';
import { Constants } from '../Constants';

export class CSettings extends SettingsHandler {
  public setRequiredConfig = async () => {
    const configMap = {
      'editor.defaultFormatter': Constants.CPP_EXT_NAME,
      'editor.formatOnSave': true,
    };

    await this.updateConfig('[c]', configMap);
  };
}

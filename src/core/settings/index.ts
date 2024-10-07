import { CSettings } from './c';
import { CppSettings } from './cpp';
import { ExtensionSettings } from './extension';

export class Settings {
  static cpp = new CppSettings();

  static ext = new ExtensionSettings();

  static c = new CSettings();
}

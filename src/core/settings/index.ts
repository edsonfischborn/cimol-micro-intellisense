import { CSettings } from './CSettings';
import { EditorSettings } from './EditorSettings';
import { ExtensionSettings } from './ExtensionSettings';
import { MsCppSettings } from './MsCppSettings';

export class Settings {
  static msCpp = new MsCppSettings();

  static ext = new ExtensionSettings();

  static c = new CSettings();

  static editor = new EditorSettings();
}

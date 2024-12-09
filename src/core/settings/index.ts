import { CSettings } from './CSettings';
import { EditorSettings } from './EditorSettings';
import { ExtensionSettings } from './ExtensionSettings';
import { MsCppExtSettings } from './MsCppExtSettings';

export class Settings {
  static msCppExt = new MsCppExtSettings();

  static ext = new ExtensionSettings();

  static c = new CSettings();

  static editor = new EditorSettings();
}

import { SettingsHandler } from '../abstract/SettingsHandler';
import { Constants } from '../Constants';

export class ExtensionSettings extends SettingsHandler {
  private defaultSdccExe = 'C:/8051/sdcc/bin/sdcc.exe';
  private defaultTccExe = 'C:/8051/tcc/tcc.exe';
  private defaultIncludePaths = ['C:/8051/sdcc/include'];
  private defaultSaveBfCompile = true;

  private includePathsOnCompileKey = 'compiler.includePathsOnCompile';
  private pathsKey = 'compiler.includePaths';
  private sdccExeKey = 'compiler.sdccExe';
  private tccExeKey = 'compiler.tccExe';
  private saveBfCompileKey = 'compiler.saveBeforeCompile';

  constructor() {
    super(Constants.EXT_NAME);
  }

  public resetToDefaults = async () => {
    await this.updateConfig(this.saveBfCompileKey, this.defaultSaveBfCompile);
    await this.updateConfig(this.sdccExeKey, this.defaultSdccExe);
    await this.updateConfig(this.tccExeKey, this.defaultTccExe);
    await this.updateConfig(this.pathsKey, this.defaultIncludePaths);
  };

  readonly getIncludePaths = (workspaceDir?: string) => {
    const workspaceRgxp = /\$\{workspaceFolder\}/g;
    const workspaceFolder = workspaceDir ?? '${workspaceFolder}';
    const includePaths = this.inspectConfig<string[]>(
      this.pathsKey,
      this.defaultIncludePaths,
    );

    return includePaths.map((path) =>
      path?.replace(workspaceRgxp, workspaceFolder)?.replace(/\\/g, '/'),
    );
  };

  readonly setIncludePaths = (paths: string[]) => {
    return this.updateConfig(this.pathsKey, paths);
  };

  readonly getSdccExePath = () => {
    return this.inspectConfig<string>(this.sdccExeKey, this.defaultSdccExe);
  };

  readonly getTccExePath = () => {
    return this.inspectConfig<string>(this.tccExeKey, this.defaultTccExe);
  };

  readonly getAllowSaveBeforeCompile = () => {
    return this.inspectConfig<boolean>(this.saveBfCompileKey, false);
  };

  readonly getAllowIncludePathsOnCompile = () => {
    return this.inspectConfig<boolean>(this.includePathsOnCompileKey, false);
  };
}

import { SettingsHandler } from '../abstract/SettingsHandler';
import { Constants } from '../Constants';

export class ExtensionSettings extends SettingsHandler {
  private defaultSdccExe = 'C:/8051/sdcc/bin/sdcc.exe';
  private defaultTccExe = 'C:/8051/tcc/tcc.exe';
  private defaultIncludePaths = ['C:/8051/sdcc/include'];

  private pathsKey = 'compiler.includePaths';
  private sdccExeKey = 'compiler.sdccExe';
  private tccExeKey = 'compiler.tccExe';
  private includePathsOnCompileKey = 'compiler.includePathsOnCompile';

  constructor() {
    super(Constants.EXT_NAME);
  }

  readonly setRequiredConfig = async () => {
    if (!this.getSdccExePath()) {
      await this.resetSdccExePath();
    }

    if (!this.getTccExePath()) {
      await this.resetTccExePath();
    }

    if (this.getIncludePaths()?.length <= 0) {
      await this.resetIncludePaths();
    }
  };

  readonly getIncludePaths = (workspaceDir?: string) => {
    const includePaths = this.inspectConfig<string[]>(this.pathsKey, []);
    const workspaceRgxp = /\$\{workspaceFolder\}/g;
    const workspaceFolder = workspaceDir ?? '${workspaceFolder}';

    return includePaths.map((path) =>
      path?.replace(workspaceRgxp, workspaceFolder)?.replace(/\\/g, '/'),
    );
  };

  readonly setIncludePaths = (paths: string[]) => {
    return this.updateConfig(this.pathsKey, paths);
  };

  readonly resetIncludePaths = () => {
    return this.updateConfig(this.pathsKey, this.defaultIncludePaths);
  };

  readonly getSdccExePath = () => {
    return this.inspectConfig<string>(this.sdccExeKey, '');
  };

  readonly resetSdccExePath = () => {
    return this.updateConfig(this.sdccExeKey, this.defaultSdccExe);
  };

  readonly getTccExePath = () => {
    return this.inspectConfig<string>(this.tccExeKey, '');
  };

  readonly resetTccExePath = () => {
    return this.updateConfig(this.tccExeKey, this.defaultTccExe);
  };

  readonly getAllowIncludePathsOnCompile = () => {
    return this.inspectConfig<boolean>(this.includePathsOnCompileKey, false);
  };
}

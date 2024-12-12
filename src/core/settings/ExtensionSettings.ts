import { CompilerProfile } from '@core/types/CompilerProfile';

import { SettingsHandler } from '../abstract/SettingsHandler';
import { Constants } from '../Constants';

export class ExtensionSettings extends SettingsHandler {
  private defaultSdccExe = 'C:/8051/sdcc/bin/sdcc.exe';
  private defaultTccExe = 'C:/8051/tcc/tcc.exe';
  private defaultSdccPaths = ['C:/8051/sdcc/include/mcs51'];
  private defaultTccPaths = ['C:/8051/tcc/include'];
  private defaultSaveBfCompile = true;
  private defaultProfile: CompilerProfile = 'C/8051';

  private sdccPathsKey = 'compiler.sdccIncludePaths';
  private tccPathsKey = 'compiler.tccIncludePaths';
  private sdccExeKey = 'compiler.sdccExe';
  private tccExeKey = 'compiler.tccExe';
  private saveBfCompileKey = 'compiler.saveBeforeCompile';
  private profileKey = 'compiler.profile';

  constructor() {
    super(Constants.EXT_NAME);
  }

  public resetToDefaults = async () => {
    await this.updateConfig(this.saveBfCompileKey, this.defaultSaveBfCompile);
    await this.updateConfig(this.sdccExeKey, this.defaultSdccExe);
    await this.updateConfig(this.tccExeKey, this.defaultTccExe);
    await this.updateConfig(this.sdccPathsKey, this.defaultSdccPaths);
    await this.updateConfig(this.tccPathsKey, this.defaultTccPaths);
    await this.updateConfig(this.profileKey, this.defaultProfile);
  };

  private readonly replaceWorkspaceFolder = (
    paths: string[],
    workspaceDir?: string,
  ) => {
    const workspaceRgxp = /\$\{workspaceFolder\}/g;
    const workspaceFolder = workspaceDir ?? '${workspaceFolder}';

    return paths.map((path) =>
      path?.replace(workspaceRgxp, workspaceFolder)?.replace(/\\/g, '/'),
    );
  };

  readonly getSdccIncludePaths = (workspaceDir?: string) => {
    const sdccPaths = this.inspectConfig<string[]>(
      this.sdccPathsKey,
      this.defaultSdccPaths,
    );

    return this.replaceWorkspaceFolder(sdccPaths, workspaceDir);
  };

  readonly getTccIncludePaths = (workspaceDir?: string) => {
    const tccPaths = this.inspectConfig<string[]>(
      this.tccPathsKey,
      this.defaultTccPaths,
    );

    return this.replaceWorkspaceFolder(tccPaths, workspaceDir);
  };

  readonly setSdccPaths = (paths: string[]) => {
    return this.updateConfig(this.sdccPathsKey, paths);
  };

  readonly setTccPaths = (paths: string[]) => {
    return this.updateConfig(this.tccPathsKey, paths);
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

  readonly setProfile = (profile: string) => {
    return this.updateConfig(this.profileKey, profile);
  };

  readonly getProfile = () => {
    return this.inspectConfig<CompilerProfile>(
      this.profileKey,
      this.defaultProfile,
    );
  };
}

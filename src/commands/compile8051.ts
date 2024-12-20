import { AbstractCommandListenner } from '@core/abstract/AbstractCommandListenner';
import { Constants } from '@core/Constants';
import { Settings } from '@core/settings';
import { Alert } from '@core/shared/Alert';
import { FileTypeListener } from '@core/shared/FileTypeListener';
import { Logger } from '@core/shared/Logger';
import { Workspace } from '@core/shared/Workspace';
import { FileProps } from '@core/types/FileProps';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';
import * as vscode from 'vscode';

class Compile8051 extends AbstractCommandListenner<null> {
  private fileListener: FileTypeListener;

  constructor() {
    super(Constants.COMMANDS.COMPILE_8051);
    this.fileListener = new FileTypeListener('c');
  }

  readonly exec = async () => {
    const currentFile = this.fileListener.getCurrentFile();

    if (!currentFile) {
      const msg = 'This file is not of type .c';
      Logger.log(msg);
      Alert.error(msg);
      return;
    }

    Workspace.runWithProgress('compiling...', () => this.compile(currentFile));
  };

  private compile = async (workingFile: FileProps) => {
    if (Settings.ext.getAllowSaveBeforeCompile()) {
      await Workspace.saveAll();
    }

    await this.runSdcc(workingFile);
    const document = this.fileListener.getActiveDocument();
    Workspace.showDocument(document as vscode.TextDocument);
  };

  private readonly runSdcc = async (workingFile: FileProps) => {
    try {
      const { dir, nameWithoutExt } = workingFile;
      const time = new Date().toLocaleTimeString();
      const outputFileName = this.getFileName(nameWithoutExt, 'hex');
      const memoryFileName = this.getFileName(nameWithoutExt, 'mem');
      const outputFilePath = resolve(dir, outputFileName);
      const compileCommand = this.getCompileCommand(workingFile);
      const filesMsg = `Generated files: ${outputFileName} - ISIS / 8051 | ${memoryFileName} - memory layout`;

      Logger.clear();
      Logger.focus();
      Logger.log(`Compiling ${workingFile.name}... ${time}`);
      Logger.log(compileCommand);

      await this.deleteCompiledFiles(workingFile);
      const sdccMsg = execSync(compileCommand, {
        stdio: 'pipe',
        encoding: 'utf-8',
      });

      if (!existsSync(outputFilePath)) {
        throw new Error('Error: Compiled file not found');
      }

      if (sdccMsg) {
        Logger.log('\nCOMPILATION SUCCESSFUL WITH WARNINGS! ⚠️⚠️');
        Logger.log(filesMsg);
        Logger.log('Warning(s):');
        Logger.log(sdccMsg);
        return;
      }

      Logger.log('\nCOMPILATION SUCCESSFUL! ✅️🚀');
      Logger.log(filesMsg);
    } catch (ex: any) {
      const msg = ex?.stdout || ex?.message || 'Unknown Error';
      Logger.log('\nCOMPILE ERROR! 🔴🐛');
      Logger.log('Error(s): ');
      Logger.log(msg);

      await this.deleteCompiledFiles(workingFile);
    } finally {
      await this.deleteBuildFiles(workingFile);
    }
  };

  private readonly getCompileCommand = (workingFile: FileProps) => {
    const { path, dir, nameWithoutExt } = workingFile;
    const compilerPath = Settings.ext.getSdccExePath();
    const includePaths = Settings.ext.getSdccIncludePaths();
    const configArgs = Settings.ext.getSdccFlags();
    const compiledFileName = this.getFileName(nameWithoutExt, 'hex');
    const compiledFilePath = resolve(dir, compiledFileName);
    const requiredArgs = ['-mmcs51', '--vc', '--use-stdout', '--out-fmt-ihx'];
    const args = [...new Set([...configArgs]), ...requiredArgs];

    for (const includePath of includePaths) {
      args.push(`-I${includePath}`);
    }

    return `${compilerPath} ${args?.join(' ')} ${path} -o ${compiledFilePath}`;
  };

  private readonly getFileName = (name: string, ext: string) => {
    return `${name}_HEX.${ext}`;
  };

  private readonly deleteCompiledFiles = async (workingFile: FileProps) => {
    const { dir, nameWithoutExt } = workingFile;
    await Workspace.deleteFiles([
      resolve(dir, this.getFileName(nameWithoutExt, 'hex')),
      resolve(dir, this.getFileName(nameWithoutExt, 'mem')),
    ]);
  };

  private readonly deleteBuildFiles = async (workingFile: FileProps) => {
    const { dir, nameWithoutExt } = workingFile;
    const buildExts = [
      'sym',
      'ihx',
      'rst',
      'rel',
      'map',
      'asm',
      'lst',
      'lnk',
      'lk',
    ];

    const paths = buildExts.map((ext) =>
      resolve(dir, this.getFileName(nameWithoutExt, ext)),
    );
    await Workspace.deleteFiles(paths);
  };
}

export const compile8051 = new Compile8051();

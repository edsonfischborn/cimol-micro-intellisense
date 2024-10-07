import { CurrentFileHandler } from '@core/abstract/CurrentFileHandler';
import { Settings } from '@core/settings';
import { Alert } from '@core/shared/Alert';
import { Logger } from '@core/shared/Logger';
import { Workspace } from '@core/shared/Workspace';
import { CommandListenner } from '@core/types/CommandListenner';
import { FileProps } from '@core/types/FileProps';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';
import * as vscode from 'vscode';

class Compile8051 extends CurrentFileHandler implements CommandListenner<null> {
  readonly command: string = 'compile8051';

  constructor() {
    super('c');
  }

  readonly exec = () => {
    const currentFile = this.getCurrentFile();

    if (!currentFile) {
      const msg = 'This file is not of type .c';
      Logger.log(msg);
      Alert.error(msg);

      return;
    }

    Workspace.runWithProgress('compiling...', async () => {
      await this.compileWithSdcc(currentFile);
      Workspace.showDocument(this.getActiveDocument() as vscode.TextDocument);
    });
  };

  private readonly compileWithSdcc = async (workingFile: FileProps) => {
    const { dir, nameWithoutExt } = workingFile;
    const outputFileName = this.generateFileName(nameWithoutExt, 'hex');
    const memoryFileName = this.generateFileName(nameWithoutExt, 'mem');
    const outputFilePath = resolve(dir, outputFileName);

    try {
      const time = new Date().toLocaleTimeString();
      const compileCommand = this.getCompileCommand(workingFile);
      const successMsg = `\nCOMPILATION SUCCESSFUL! Generated files: ${outputFileName} - ISIS / 8051 | ${memoryFileName} - memory layout`;

      await this.deleteCompiledFiles(dir, nameWithoutExt);

      Logger.clear();
      Logger.focus();
      Logger.log(`Compiling ${workingFile.name}... ${time}`);
      Logger.log(compileCommand);

      execSync(compileCommand, {
        stdio: 'pipe',
        encoding: 'utf-8',
      });

      if (!existsSync(outputFilePath)) {
        throw new Error('Error: Compiled file not found');
      }

      Logger.log(successMsg);
    } catch (ex: any) {
      const msg = ex?.stdout || ex?.message || 'Unknown Error';
      Logger.log('\nCOMPILE ERROR. VERIFY THE COMPILER MESSAGE BELOW: ');
      Logger.log(msg);

      await this.deleteCompiledFiles(dir, nameWithoutExt);
    } finally {
      await this.deleteBuildFiles(dir, nameWithoutExt);
    }
  };

  private readonly getCompileCommand = (workingFile: FileProps) => {
    const { path, dir, nameWithoutExt } = workingFile;
    const compilerPath = Settings.ext.getSdccExePath();
    const allowIncludePaths = Settings.ext.getAllowIncludePathsOnCompile();
    const includePaths = Settings.ext.getIncludePaths(this.getWorkspacePath());
    const compiledFileName = this.generateFileName(nameWithoutExt, 'hex');
    const compiledFilePath = resolve(dir, compiledFileName);

    const args = [
      '-mmcs51',
      '--std-sdcc11',
      '--vc',
      '--use-stdout',
      '--model-small',
      '--out-fmt-ihx',
    ];

    if (allowIncludePaths) {
      for (const includePath of includePaths) {
        args.push(`-I${includePath}`);
      }
    }

    const argsStr = args?.join(' ');
    return `${compilerPath} ${argsStr} ${path} -o ${compiledFilePath}`;
  };

  private readonly generateFileName = (fileName: string, ext: string) => {
    return `${fileName}_HEX.${ext}`;
  };

  private readonly deleteCompiledFiles = async (
    dir: string,
    nameWithoutExt: string,
  ) => {
    await Workspace.deleteFiles([
      resolve(dir, this.generateFileName(nameWithoutExt, 'hex')),
      resolve(dir, this.generateFileName(nameWithoutExt, 'mem')),
    ]);
  };

  private readonly deleteBuildFiles = async (
    dir: string,
    nameWithoutExt: string,
  ) => {
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
      resolve(dir, this.generateFileName(nameWithoutExt, ext)),
    );

    await Workspace.deleteFiles(paths);
  };
}

export const compile8051 = new Compile8051();

import { AbstractCommandListenner } from '@core/abstract/AbstractCommandListenner';
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
    super('cimol-micro-intellisense.compiler.8051');
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

    Workspace.runWithProgress('compiling...', async () => {
      if (Settings.ext.getAllowSaveBeforeCompile()) {
        await Workspace.saveAll();
      }
      await this.compileWithSdcc(currentFile);
      Workspace.showDocument(
        this.fileListener.getActiveDocument() as vscode.TextDocument,
      );
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
      const filesMsg = `Generated files: ${outputFileName} - ISIS / 8051 | ${memoryFileName} - memory layout`;

      await this.deleteCompiledFiles(dir, nameWithoutExt);

      Logger.clear();
      Logger.focus();
      Logger.log(`Compiling ${workingFile.name}... ${time}`);
      Logger.log(compileCommand);

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

      await this.deleteCompiledFiles(dir, nameWithoutExt);
    } finally {
      await this.deleteBuildFiles(dir, nameWithoutExt);
    }
  };

  private readonly getCompileCommand = (workingFile: FileProps) => {
    const { path, dir, nameWithoutExt } = workingFile;
    const compilerPath = Settings.ext.getSdccExePath();
    const includePaths = Settings.ext.getSdccIncludePaths();
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

    for (const includePath of includePaths) {
      args.push(`-I${includePath}`);
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

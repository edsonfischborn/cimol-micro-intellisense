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

class CompilePc extends AbstractCommandListenner<null> {
  private fileListener: FileTypeListener;

  constructor() {
    super(Constants.COMMANDS.COMPILE_PC);
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

    await this.runTcc(workingFile);
    const document = this.fileListener.getActiveDocument();
    Workspace.showDocument(document as vscode.TextDocument);
  };

  private readonly runTcc = async (workingFile: FileProps) => {
    try {
      const time = new Date().toLocaleTimeString();
      const compileCommand = this.getCompileCommand(workingFile);
      const compiledFileName = this.getCompiledFileName(workingFile);

      Logger.clear();
      Logger.focus();
      Logger.log(`Compiling ${workingFile.name}... ${time}`);
      Logger.log(compileCommand);

      await this.deleteCompiledFile(workingFile);
      execSync(compileCommand, {
        stdio: 'pipe',
        encoding: 'utf-8',
      });

      if (!existsSync(this.getCompiledFilePath(workingFile))) {
        throw new Error('Error: Compiled file not found');
      }

      Logger.log('\nCOMPILATION SUCCESSFUL! ✅️🚀');
      Logger.log(`Generated file: ${compiledFileName}`);
    } catch (ex: any) {
      const msg = ex?.stdout || ex?.message || 'Unknown Error';
      Logger.log('\nCOMPILE ERROR! 🔴🐛');
      Logger.log('Error(s): ');
      Logger.log(msg);
    }
  };

  private readonly getCompileCommand = (workingFile: FileProps) => {
    const compilerPath = Settings.ext.getTccExePath();
    const includePaths = Settings.ext.getTccIncludePaths();
    const compiledFilePath = this.getCompiledFilePath(workingFile);

    const args = [];
    for (const path of includePaths) {
      args.push(` -I ${path}`);
    }

    return `${compilerPath} ${args.join(' ')} -o ${compiledFilePath} ${workingFile.path}`;
  };

  private readonly getCompiledFilePath = (workingFile: FileProps) => {
    return resolve(workingFile.dir, this.getCompiledFileName(workingFile));
  };

  private readonly getCompiledFileName = (workingFile: FileProps) => {
    return `${workingFile.nameWithoutExt}.exe`;
  };

  private readonly deleteCompiledFile = async (workingFile: FileProps) => {
    await Workspace.deleteFiles([this.getCompiledFilePath(workingFile)]);
  };
}

export const compilePc = new CompilePc();

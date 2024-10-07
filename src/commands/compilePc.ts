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

class CompilePc extends CurrentFileHandler implements CommandListenner<null> {
  readonly command: string = 'compilePc';

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
      await this.compileWithTcc(currentFile);
      Workspace.showDocument(this.getActiveDocument() as vscode.TextDocument);
    });
  };

  private readonly compileWithTcc = async (workingFile: FileProps) => {
    try {
      const time = new Date().toLocaleTimeString();
      const compileCommand = this.getCompileCommand(workingFile);
      const compiledFileName = this.getCompiledFileName(workingFile);
      const successMsg = `\nCOMPILATION SUCCESSFUL! Generated file: ${compiledFileName}`;

      await this.deleteCompiledFile(workingFile);

      Logger.clear();
      Logger.focus();
      Logger.log(`Compiling ${workingFile.name}... ${time}`);
      Logger.log(compileCommand);

      execSync(compileCommand, {
        stdio: 'pipe',
        encoding: 'utf-8',
      });

      if (!existsSync(this.getCompiledFilePath(workingFile))) {
        throw new Error('Error: Compiled file not found');
      }

      Logger.log(successMsg);
    } catch (ex: any) {
      const msg = ex?.stdout || ex?.message || 'Unknown Error';
      Logger.log('\nCOMPILE ERROR. VERIFY THE COMPILER MESSAGE BELOW: ');
      Logger.log(msg);
    }
  };

  private readonly getCompileCommand = (workingFile: FileProps) => {
    const compilerPath = Settings.ext.getTccExePath();
    const allowIncludePaths = Settings.ext.getAllowIncludePathsOnCompile();
    const includePaths = Settings.ext.getIncludePaths(this.getWorkspacePath());
    const compiledFilePath = this.getCompiledFilePath(workingFile);

    let includeArgs = '';
    if (allowIncludePaths) {
      for (const path of includePaths) {
        includeArgs += ` -I ${path}`;
      }
    }

    return `${compilerPath}${includeArgs} -o ${compiledFilePath} ${workingFile.path}`;
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

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

class CompilePic extends AbstractCommandListenner<null> {
  private fileListener: FileTypeListener;

  constructor() {
    super(Constants.COMMANDS.COMPILE_PIC);
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

    await this.runCcs(workingFile);
    const document = this.fileListener.getActiveDocument();
    Workspace.showDocument(document as vscode.TextDocument);
  };

  private readonly runCcs = async (workingFile: FileProps) => {
    try {
      const { dir, nameWithoutExt } = workingFile;
      const time = new Date().toLocaleTimeString();
      const compileCommand = this.getCompileCommand(workingFile);
      const filesMsg = `Generated files: ${dir}\\${nameWithoutExt}.(bin|hex)`;

      Logger.clear();
      Logger.focus();
      Logger.log(`Compiling ${workingFile.name}... ${time}`);
      Logger.log(compileCommand);

      await this.deleteCompiledFiles(workingFile);
      const ccsMsg = execSync(compileCommand, {
        stdio: 'pipe',
        encoding: 'utf-8',
      });

      if (!this.isCompiledFileExists(workingFile)) {
        if (ccsMsg && ccsMsg.includes('Error#')) {
          throw new Error(ccsMsg);
        }

        const msg = `Error: unknown error, compiled file not found, try execute ${compileCommand} manually.`;
        throw new Error(msg);
      }

      if (ccsMsg && ccsMsg.includes('Warning#')) {
        Logger.log('\nCOMPILATION SUCCESSFUL WITH WARNINGS! ⚠️⚠️');
        Logger.log(filesMsg);
        Logger.log('Warning(s):');
        Logger.log(ccsMsg);
        return;
      }

      Logger.log('\nCOMPILATION SUCCESSFUL! ✅️🚀');
      Logger.log(filesMsg);
      Logger.log(ccsMsg ? `Info:\n${ccsMsg}` : '');
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
    const { path } = workingFile;
    const compilerPath = Settings.ext.getCcsPath();
    const configArgs = Settings.ext.getCcsFlags();
    const includePaths = Settings.ext.getCcsIncludePaths();
    const requiredArgs = ['+EX', '+STDOUT'];
    const args = [...new Set([...configArgs]), ...requiredArgs];
    args.push(`I="${includePaths?.join(';')}"`);

    return `${compilerPath} ${args?.join(' ')} ${path}`;
  };

  private readonly getFileName = (nameWithoutExt: string, ext: string) => {
    return `${nameWithoutExt}.${ext}`;
  };

  private readonly isCompiledFileExists = (workingFile: FileProps) => {
    const { dir, nameWithoutExt } = workingFile;
    return (
      existsSync(resolve(dir, this.getFileName(nameWithoutExt, 'bin'))) ||
      existsSync(resolve(dir, this.getFileName(nameWithoutExt, 'hex')))
    );
  };

  private readonly deleteCompiledFiles = async (workingFile: FileProps) => {
    const { dir, nameWithoutExt } = workingFile;
    await Workspace.deleteFiles([
      resolve(dir, this.getFileName(nameWithoutExt, 'bin')),
      resolve(dir, this.getFileName(nameWithoutExt, 'hex')),
    ]);
  };

  private readonly deleteBuildFiles = async (workingFile: FileProps) => {
    const { dir, nameWithoutExt } = workingFile;
    const buildExts = [
      'lst',
      'map',
      'tre',
      'sta',
      'err',
      'sym',
      'pjt',
      'cod',
      'coff',
      'dwarf',
      'tmp',
      'o',
      'ccspjt',
      'esym',
      'xsym',
    ];

    const paths = buildExts.map((ext) =>
      resolve(dir, this.getFileName(nameWithoutExt, ext)),
    );
    await Workspace.deleteFiles(paths);
  };
}

export const compilePic = new CompilePic();

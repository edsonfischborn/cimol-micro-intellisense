import { CurrentFileHandler } from '@core/abstract/CurrentFileHandler';
import { Alert } from '@core/shared/Alert';
import { Logger } from '@core/shared/Logger';
import { Workspace } from '@core/shared/Workspace';
import { CommandListenner } from '@core/types/CommandListenner';
import { FileProps } from '@core/types/FileProps';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';
import * as vscode from 'vscode';

class ExecPc extends CurrentFileHandler implements CommandListenner<null> {
  readonly command: string = 'execPc';

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

    Workspace.runWithProgress('running...', async () => {
      await this.runPC(currentFile);
      Workspace.showDocument(this.getActiveDocument() as vscode.TextDocument);
    });
  };

  private readonly runPC = async (workingFile: FileProps) => {
    try {
      const { dir, nameWithoutExt } = workingFile;
      const time = new Date().toLocaleTimeString();
      const fileExe = resolve(dir, `${nameWithoutExt}.exe`);

      Logger.clear();
      Logger.focus();
      Logger.log(`exec ${fileExe}... ${time}`);

      if (!existsSync(fileExe)) {
        throw new Error('Error: exe not found');
      }

      execSync(`start "" "${fileExe}"`, {
        stdio: 'ignore',
        encoding: 'utf-8',
      });
    } catch (ex: any) {
      const msg = ex?.stdout || ex?.message || 'Unknown Error';
      Logger.log('\nEXEC ERROR. VERIFY THE ERROR MESSAGE BELOW: ');
      Logger.log(msg);
    }
  };
}

export const execPc = new ExecPc();

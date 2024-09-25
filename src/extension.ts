import * as vscode from "vscode";
import { logger } from "./logger";
import { EXT_NAME } from "./constants";

export const activate = async (context: vscode.ExtensionContext) => {
  logger(`Starting ${EXT_NAME}...`);

  logger(`Started ${EXT_NAME}!`);
};

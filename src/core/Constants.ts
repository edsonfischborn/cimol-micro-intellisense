export class Constants {
  static readonly EXT_NAME = 'cimol-micro-intellisense';
  static readonly EXT_AUTHOR = 'edsonfischborn';
  static readonly MS_CPP_EXT_ALIAS = 'C_Cpp';
  static readonly MS_CPP_EXT_NAME = 'ms-vscode.cpptools';
  static readonly EXT_GIT_URL =
    'https://github.com/edsonfischborn/cimol-micro-intellisense';

  static readonly COMMANDS = {
    COMPILE_8051: 'cimol-micro-intellisense.compiler.8051',
    COMPILE_PC: 'cimol-micro-intellisense.compiler.pc',
    COMPILE_PIC: 'cimol-micro-intellisense.compiler.pic',
    RUN_PC: 'cimol-micro-intellisense.compiler.runPc',
    CHANGE_PROFILE: 'cimol-micro-intellisense.compiler.changeProfile',
  };

  static readonly PROFILES = {
    C_PIC: 'C/PIC',
    C_PC: 'C/PC',
    C_8051: 'C/8051',
  };
}

# Change Log

All notable changes to the "cimol-micro-intellisense" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.0.1] - 2024-10-07

### Added

- Compile 8051.
- Compile PC.
- Run PC.
- Settings.
- Keybindings.

## [0.0.2] - 2024-10-07

### Fixed

- Fixed keybindings button url.

## [0.0.3] - 2024-10-21

### Added

- Allow auto save before compile.

## [0.0.4] - 2024-12-19

### Added

- Default value for "editor tab size" setting.
- Default value for "save before compile" setting.
- More details on sdcc and tinyc output messages.
- Add compile profile, used for include paths intellisense and compile command selection.
- Add PIC compile command with ccs compiler.
- Accept custom flags for in sdcc, tinyc and ccs compile commands.

### Removed

- Removed "include paths on compile" setting.
- Removed "${workspaceFolder}" from settings.

### Fixed

- Show warnings in sdcc compiler output message.

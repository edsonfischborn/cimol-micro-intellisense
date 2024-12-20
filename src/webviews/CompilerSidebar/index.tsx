import { Chip } from '../icons/Chip';
import { Hammer } from '../icons/Hammer';
import { Monitor } from '../icons/Monitor';
import { MonitorPlay } from '../icons/MonitorPlay';
import { Play } from '../icons/Play';

import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import { Switch } from '@webviews/icons/Switch';
import { SidebarButton } from './SIderbarButton';
import { ActionButton } from './ActionButton';
import { CompilerProfile } from '@core/types/CompilerProfile';
import { ChipSolid } from '@webviews/icons/ChipSolid';
import { Constants } from '@core/Constants';

const { vscodeWebviewApi } = window.process;

const playIcon = <Play size={16} color="var(--vscode-testing-runAction)" />;
const hammerIcon = (
  <Hammer size={16} color="var(--vscode-editorError-foreground)" />
);
const switchIcon = (
  <Switch size={16} color="var(--vscode-settings-focusedRowBorder)" />
);

const dispathMessage = async (command: string) => {
  vscodeWebviewApi.postMessage({ command });
};

export const CompilerSidebar = () => {
  const [keyBindings, setKeyBindings] = useState<Record<string, string>>({});
  const [currentProfile, setCurrentProfile] = useState<CompilerProfile>(null);

  useEffect(() => {
    const handleMessage = (event: any) => {
      if (event.data.command === 'supplyKeybindings') {
        setKeyBindings(event.data.payload);
      }

      if (event.data.command === 'supplyCurrentProfile') {
        setCurrentProfile(event.data.payload);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <nav className={styles.compilerSidebar}>
      <div className={styles.section}>
        <div className={styles.sectionProfile}>
          <h4 className={styles.sectionProfileTitle}>Profile:</h4>
          <span className={styles.sectionProfileSelectValue}>
            {currentProfile}
          </span>
          <button className={styles.profileChangeButton}>
            <ActionButton
              tipPos="bottom"
              tip={keyBindings[Constants.COMMANDS.CHANGE_PROFILE]}
              onClick={() => dispathMessage(Constants.COMMANDS.CHANGE_PROFILE)}
              icon={switchIcon}
            />
          </button>
        </div>
      </div>

      <hr className={styles.sectionDivider} />

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>C/8051</h4>
        <ul className={styles.sectionActionsList}>
          <SidebarButton
            isActionDisabled={currentProfile !== Constants.PROFILES.C_8051}
            label="Compile - 8051"
            tip={keyBindings[Constants.COMMANDS.COMPILE_8051]}
            onActionClick={() =>
              dispathMessage(Constants.COMMANDS.COMPILE_8051)
            }
            infoIcon={<Chip size={17} />}
            actionIcon={hammerIcon}
          />
        </ul>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>C/PIC</h4>
        <ul className={styles.sectionActionsList}>
          <SidebarButton
            isActionDisabled={currentProfile !== Constants.PROFILES.C_PIC}
            label="Compile - PIC"
            tip={keyBindings[Constants.COMMANDS.COMPILE_PIC]}
            onActionClick={() => dispathMessage(Constants.COMMANDS.COMPILE_PIC)}
            infoIcon={<ChipSolid size={18} />}
            actionIcon={hammerIcon}
          />
        </ul>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>C</h4>
        <ul className={styles.sectionActionsList}>
          <SidebarButton
            isActionDisabled={currentProfile !== Constants.PROFILES.C_PC}
            label="Compile - PC"
            tip={keyBindings[Constants.COMMANDS.COMPILE_PC]}
            onActionClick={() => dispathMessage(Constants.COMMANDS.COMPILE_PC)}
            infoIcon={<Monitor size={16} />}
            actionIcon={hammerIcon}
          />

          <SidebarButton
            isActionDisabled={currentProfile !== Constants.PROFILES.C_PC}
            label="Run - PC"
            tip={keyBindings[Constants.COMMANDS.RUN_PC]}
            onActionClick={() => dispathMessage(Constants.COMMANDS.RUN_PC)}
            infoIcon={<MonitorPlay size={16.5} />}
            actionIcon={playIcon}
          />
        </ul>
      </div>
    </nav>
  );
};

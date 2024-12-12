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
/* import { ChipSolid } from '@webviews/icons/ChipSolid'; */

const { vscodeWebviewApi } = window.process;

const compile8051Command = 'cimol-micro-intellisense.compiler.8051';
const compilePcCommand = 'cimol-micro-intellisense.compiler.pc';
const runPcCommand = 'cimol-micro-intellisense.compiler.runPc';
/*  const compilePicCommand = 'cimol-micro-intellisense.compiler.pic'  */
const changeProfileCommand = 'cimol-micro-intellisense.compiler.changeProfile';
const playIcon = <Play size={16} color="var(--vscode-testing-runAction)" />;
const switchIcon = (
  <Switch size={16} color="var(--vscode-settings-focusedRowBorder)" />
);

const hammerIcon = (
  <Hammer size={16} color="var(--vscode-editorError-foreground)" />
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
              tip={keyBindings[changeProfileCommand]}
              onClick={() => dispathMessage(changeProfileCommand)}
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
            isActionDisabled={currentProfile !== 'C/8051'}
            label="Compile - 8051"
            tip={keyBindings[compile8051Command]}
            onActionClick={() => dispathMessage(compile8051Command)}
            infoIcon={<Chip size={17} />}
            actionIcon={hammerIcon}
          />
        </ul>
      </div>

      {/*  <div className={styles.section}>
        <h4 className={styles.sectionTitle}>C/PIC</h4>
        <ul className={styles.sectionActionsList}>
          <SidebarButton
            isActionDisabled={currentProfile !== 'C/PIC'}
            label="Compile - PIC"
            tip={keyBindings['cimol-micro-intellisense.compiler.pic']}
            onActionClick={() => dispathMessage('compilePic')}
            infoIcon={<ChipSolid size={18} />}
            actionIcon={hammerIcon}
          />
        </ul>
      </div> */}

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>C</h4>
        <ul className={styles.sectionActionsList}>
          <SidebarButton
            isActionDisabled={currentProfile !== 'C/PC'}
            label="Compile - PC"
            tip={keyBindings[compilePcCommand]}
            onActionClick={() => dispathMessage(compilePcCommand)}
            infoIcon={<Monitor size={16} />}
            actionIcon={hammerIcon}
          />

          <SidebarButton
            isActionDisabled={currentProfile !== 'C/PC'}
            label="Run - PC"
            tip={keyBindings[runPcCommand]}
            onActionClick={() => dispathMessage(runPcCommand)}
            infoIcon={<MonitorPlay size={16.5} />}
            actionIcon={playIcon}
          />
        </ul>
      </div>
    </nav>
  );
};

import { ActionButton } from './ActionButton';
import { Chip } from '../icons/Chip';
import { Hammer } from '../icons/Hammer';
import { Monitor } from '../icons/Monitor';
import { MonitorPlay } from '../icons/MonitorPlay';
import { Play } from '../icons/Play';

import styles from './styles.module.css';
import { useEffect, useState } from 'react';

const { vscodeWebviewApi } = window.process;

const hammerIcon = (
  <Hammer size={16} color="var(--vscode-editorError-foreground)" />
);

const playIcon = <Play size={16} color="var(--vscode-testing-runAction)" />;

const dispathMessage = async (command: string) => {
  vscodeWebviewApi.postMessage({ command });
};

export const CompilerSidebar = () => {
  const [keyBindings, setKeyBindings] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleMessage = (event: any) => {
      if (event.data.command === 'supplyKeybindings') {
        setKeyBindings(event.data.payload);
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
        <h4 className={styles.sectionTitle}>C/8051</h4>
        <ul className={styles.sectionActionsList}>
          <ActionButton
            label="Compile - 8051"
            tip={keyBindings['cimol-micro-intellisense.compiler.8051']}
            onActionClick={() => dispathMessage('compile8051')}
            infoIcon={<Chip size={17} />}
            actionIcon={hammerIcon}
          />
        </ul>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>C</h4>
        <ul className={styles.sectionActionsList}>
          <ActionButton
            label="Compile - PC"
            tip={keyBindings['cimol-micro-intellisense.compiler.pc']}
            onActionClick={() => dispathMessage('compilePc')}
            infoIcon={<Monitor size={16} />}
            actionIcon={hammerIcon}
          />

          <ActionButton
            label="Run - PC"
            tip={keyBindings['cimol-micro-intellisense.compiler.runPc']}
            onActionClick={() => dispathMessage('execPc')}
            infoIcon={<MonitorPlay size={16.5} />}
            actionIcon={playIcon}
          />
        </ul>
      </div>
    </nav>
  );
};

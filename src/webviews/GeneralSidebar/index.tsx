import { Constants } from '@core/Constants';
import { ActionButton } from './ActionButton';
import { Settings } from '../icons/Settings';
import { Github } from '../icons/Github';
import { Command } from '../icons/Command';

import styles from './styles.module.css';

const { vscodeWebviewApi } = window.process;

const onGitClick = () => {
  vscodeWebviewApi.postMessage({
    command: 'openLink',
    url: Constants.EXT_GIT_URL,
  });
};

const onSettingsClick = () => {
  vscodeWebviewApi.postMessage({ command: 'openSettings' });
};

const onKeybindingsClick = () => {
  vscodeWebviewApi.postMessage({ command: 'openKeybindings' });
};

export const GeneralSidebar = () => {
  return (
    <nav className={styles.generalSidebar}>
      <ul className={styles.sectionActionsList}>
        <ActionButton
          onActionClick={onGitClick}
          icon={<Github size={16} />}
          label="Github"
        />

        <ActionButton
          onActionClick={onSettingsClick}
          icon={<Settings size={16} />}
          label="Settings"
        />

        <ActionButton
          onActionClick={onKeybindingsClick}
          icon={<Command size={16} />}
          label="Keys"
        />
      </ul>
    </nav>
  );
};

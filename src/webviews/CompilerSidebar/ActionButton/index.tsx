import styles from './styles.module.css';

interface SidebarActionButtonProps {
  actionIcon: React.ReactNode;
  infoIcon: React.ReactNode;
  label: string;
  tip?: string;
  onActionClick: () => void;
}

export const ActionButton = (props: SidebarActionButtonProps) => {
  const { actionIcon, infoIcon, onActionClick, label, tip = '' } = props;

  return (
    <li className={styles.compilerSidebarActionButton}>
      <div className={styles.description}>
        <div className={styles.infoIconContainer}>{infoIcon}</div>

        <span className={styles.descriptionText}>{label}</span>
      </div>
      <button className={styles.button} onClick={onActionClick}>
        {tip && <span className={styles.buttonTip}>{tip}</span>}
        {actionIcon}
      </button>
    </li>
  );
};

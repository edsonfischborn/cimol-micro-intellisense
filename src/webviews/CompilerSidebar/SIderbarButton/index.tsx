import { ActionButton } from '../ActionButton';
import styles from './styles.module.css';

interface SidebarButtonProps {
  actionIcon: React.ReactNode;
  infoIcon: React.ReactNode;
  label: string;
  tip?: string;
  isActionDisabled?: boolean;
  onActionClick: () => void;
}

export const SidebarButton = (props: SidebarButtonProps) => {
  const {
    actionIcon,
    infoIcon,
    onActionClick,
    label,
    isActionDisabled = false,
    tip = '',
  } = props;

  return (
    <li className={styles.sidebarButton}>
      <div className={styles.description}>
        <div className={styles.infoIconContainer}>{infoIcon}</div>
        <span className={styles.descriptionText}>{label}</span>
      </div>

      <ActionButton
        isDisabled={isActionDisabled}
        icon={actionIcon}
        onClick={onActionClick}
        tip={tip}
      />
    </li>
  );
};
